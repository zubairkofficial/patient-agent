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
import skillsService from '@/services/skills.service'
import emotionService from '@/services/emotions.service'

interface Section {
  id: number
  name: string
}

interface Skill {
  id: number
  name: string
}

interface Emotion {
  id: number
  name: string
}

interface StatementDialogProps {
  mode: 'add' | 'edit'
  defaultValues?: {
    statement: string
    skill: string | number
    emotion: string | number
    sectionId: string | number
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
  const [skills, setSkills] = useState<Skill[]>([])
  const [emotions, setEmotions] = useState<Emotion[]>([])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [sectionRes, skillRes, emotionRes] = await Promise.all([
        sectionService.getAllSections(),
        skillsService.getAllSkills(),
        emotionService.getAllEmotions(),
      ])

      if (sectionRes.success) setSections(sectionRes.data)
      else setError(sectionRes.message)

      if (skillRes.success) setSkills(skillRes.data)
      else setError(skillRes.message)

      if (emotionRes.success) setEmotions(emotionRes.data)
      else setError(emotionRes.message)

      if (defaultValues) {
        setStatement(defaultValues.statement || '')
        setEmotion(
          typeof defaultValues.emotion === 'number'
            ? emotionRes.data.find((e: Emotion) => e.id === defaultValues.emotion)?.name || ''
            : defaultValues.emotion
        )

        const foundSection = sectionRes.data.find(
          (s: Section) =>
            s.id === Number(defaultValues.sectionId) ||
            s.name === defaultValues.sectionId
        )
        if (foundSection) setSectionId(foundSection.id)

        const foundSkill = skillRes.data.find(
          (s: Skill) =>
            s.id === Number(defaultValues.skill) ||
            s.name === defaultValues.skill
        )
        if (foundSkill) setSkill(foundSkill.id)
      }
    } catch {
      setError('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (open) fetchData()
  }, [open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!statement || skill === null || !emotion || sectionId === null) {
      alert('Please fill out all fields.')
      return
    }
    onSubmit({ statement, skill, emotion, sectionId })
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
          <DialogTitle>
            {mode === 'add' ? 'Create Statement' : 'Edit Statement'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'add'
              ? 'Add a new therapeutic statement.'
              : 'Edit this statement.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Statement</label>
            <Textarea
              value={statement}
              onChange={(e) => setStatement(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Skill</label>
              <Select
                value={skill?.toString() || ''}
                onValueChange={(value) => setSkill(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select skill" />
                </SelectTrigger>
                <SelectContent>
                  {skills.map((s) => (
                    <SelectItem key={s.id} value={s.id.toString()}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Emotion</label>
              <Select
                value={emotion}
                onValueChange={setEmotion}
              >
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

            <div className="space-y-2">
              <label className="text-sm font-medium">Section</label>
              <Select
                value={sectionId?.toString() || ''}
                onValueChange={(value) => setSectionId(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={loading ? 'Loading...' : 'Select section'} />
                </SelectTrigger>
                <SelectContent>
                  {sections.map((s) => (
                    <SelectItem key={s.id} value={s.id.toString()}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
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
