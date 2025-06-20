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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import sectionService from '@/services/section.service'
import emotionService from '@/services/emotions.service'

interface Skill {
  id: number
  title: string
}

interface Section {
  id: number
  title: string
  skills: Skill[]
}

interface Emotion {
  id: number
  name: string
}

interface StatementDialogProps {
  mode: 'add' | 'edit'
  defaultValues?: {
    statement: string
    skill: number | string
    emotion: number | string
    sectionId: number | string
  }
  onSubmit: (data: {
    statement: string
    skill: number
    emotion: string
    sectionId: number
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
  const [emotion, setEmotion] = useState('')
  const [sectionId, setSectionId] = useState<number | null>(null)

  const [sections, setSections] = useState<Section[]>([])
  const [emotions, setEmotions] = useState<Emotion[]>([])
  const [loading, setLoading] = useState(false)

  // Get skills for selected section
  const filteredSkills = sections.find(s => s.id === sectionId)?.skills || []

  useEffect(() => {
    if (open) fetchData()
  }, [open])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [sectionRes, emotionRes] = await Promise.all([
        sectionService.getAllSections(),
        emotionService.getAllEmotions(),
      ])

      if (sectionRes.success) setSections(sectionRes.data)
      if (emotionRes.success) setEmotions(emotionRes.data)

      if (defaultValues) {
        setStatement(defaultValues.statement)

        const selectedEmotion =
          typeof defaultValues.emotion === 'number'
            ? emotionRes.data.find((e: any) => e.id === defaultValues.emotion)?.name
            : defaultValues.emotion
        setEmotion(selectedEmotion || '')

        const selectedSection = sectionRes.data.find(
          (s: Section) => s.id === Number(defaultValues.sectionId)
        )
        if (selectedSection) {
          setSectionId(selectedSection.id)
          const selectedSkill = selectedSection.skills.find(
            (sk: Skill) => sk.id === Number(defaultValues.skill)
          )
          if (selectedSkill) {
            setSkill(selectedSkill.id)
          }
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!statement || !emotion || skill === null || sectionId === null) {
      alert('Please fill out all fields.')
      return
    }
    onSubmit({
      statement,
      skill,
      emotion,
      sectionId,
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
          {/* Statement Text */}
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
              onValueChange={(val) => {
                setSectionId(Number(val))
                setSkill(null) // reset skill when section changes
              }}
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

          <div className="grid grid-cols-3 gap-4">
            {/* Emotion Select */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Emotion</label>
              <Select value={emotion} onValueChange={setEmotion}>
                <SelectTrigger>
                  <SelectValue placeholder="Select emotion" />
                </SelectTrigger>
                <SelectContent>
                  {emotions.map((e) => (
                    <SelectItem key={e.id} value={e.name}>
                      {e.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Skill Select */}
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium">Skill</label>
              <Select
                value={skill?.toString() || ''}
                onValueChange={(val) => setSkill(Number(val))}
                disabled={!sectionId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select skill" />
                </SelectTrigger>
                <SelectContent>
                  {filteredSkills.map((sk) => (
                    <SelectItem key={sk.id} value={sk.id.toString()}>
                      {sk.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
