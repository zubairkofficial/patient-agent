import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import sectionService from '@/services/section.service'
import emotionService from '@/services/emotions.service'
import skillsService from '@/services/skills.service'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Skill {
  id: number
  title: string
}

interface Section {
  id: number
  title: string
}

interface Emotion {
  id: number
  name: string
}

interface StatementDialogProps {
  mode: 'add' | 'edit'
  defaultValues?: {
    emotionId: never[]
    statement: string
    skill: number
    sectionId: number
    emotionIds: number[]
  }
  onSubmit: (data: {
    statement: string
    skill: number
    sectionId: number
    emotionIds: number[]
  }) => void
  trigger?: React.ReactNode
}

export function StatementDialog({
  mode,
  defaultValues,
  onSubmit,
  trigger,
}: StatementDialogProps) {
  const [open, setOpen] = useState(false)
  const [statement, setStatement] = useState('')
  const [skill, setSkill] = useState<number | null>(null)
  const [sectionId, setSectionId] = useState<number | null>(null)

  const [selectedEmotions, setSelectedEmotions] = useState<number[]>([])
  const [sections, setSections] = useState<Section[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [emotions, setEmotions] = useState<Emotion[]>([])
  const [loading, setLoading] = useState(false)

  const toggleEmotion = (id: number) => {
    setSelectedEmotions(prev =>
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    )
  }

  useEffect(() => {
    if (open) fetchData()
  }, [open])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [sectionRes, emotionRes, skillRes] = await Promise.all([
        sectionService.getAllSections(),
        emotionService.getAllEmotions(),
        skillsService.getAllSkills(),
      ])

      if (sectionRes.success) setSections(sectionRes.data)
      if (emotionRes.success) setEmotions(emotionRes.data)
      if (skillRes.success) setSkills(skillRes.data)

      if (defaultValues) {
        setStatement(defaultValues.statement)
        setSkill(defaultValues.skill)
        setSectionId(defaultValues.sectionId)
        setSelectedEmotions(defaultValues.emotionIds || [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!statement || skill === null || sectionId === null || selectedEmotions.length === 0) {
      alert('Please fill out all fields.')
      return
    }
    onSubmit({
      statement,
      skill,
      sectionId,
      emotionIds: selectedEmotions,
    })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-orange-600 hover:bg-orange-700">
            + Add Statement
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === 'add' ? 'Create Statement' : 'Edit Statement'}</DialogTitle>
          <DialogDescription>
            {mode === 'add'
              ? 'Add a new therapeutic statement.'
              : 'Edit this therapeutic statement.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Statement */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Statement</label>
            <Textarea
              value={statement}
              onChange={(e) => setStatement(e.target.value)}
              required
            />
          </div>

          {/* Section Select */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Section</label>
            <Select
              value={sectionId?.toString() || ''}
              onValueChange={(val) => setSectionId(Number(val))}
            >
              <SelectTrigger>
                <SelectValue placeholder={loading ? 'Loading...' : 'Select section'} />
              </SelectTrigger>
              <SelectContent>
                {sections.map((section) => (
                  <SelectItem key={section.id} value={section.id.toString()}>
                    {section.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Skill Select */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Skill</label>
            <Select
              value={skill?.toString() || ''}
              onValueChange={(val) => setSkill(Number(val))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select skill" />
              </SelectTrigger>
              <SelectContent>
                {skills.map((sk) => (
                  <SelectItem key={sk.id} value={sk.id.toString()}>
                    {sk.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Emotions Multi-select */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Emotions</label>
            <ScrollArea className="max-h-40 border rounded p-2">
              {emotions.map((emotion) => (
                <div key={emotion.id} className="flex items-center gap-2 py-1">
                  <Checkbox
                    id={`emotion-${emotion.id}`}
                    checked={selectedEmotions.includes(emotion.id)}
                    onCheckedChange={() => toggleEmotion(emotion.id)}
                  />
                  <label htmlFor={`emotion-${emotion.id}`} className="text-sm">
                    {emotion.name}
                  </label>
                </div>
              ))}
              {!loading && emotions.length === 0 && (
                <p className="text-sm text-muted">No emotions available</p>
              )}
            </ScrollArea>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-orange-600 hover:bg-orange-700">
              {mode === 'add' ? 'Create' : 'Update'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
