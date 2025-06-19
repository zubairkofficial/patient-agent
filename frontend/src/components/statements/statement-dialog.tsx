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
import sectionService from '../../services/section.service'

interface Section {
  id: number
  name: string
}

interface StatementDialogProps {
  mode: 'add' | 'edit'
  defaultValues?: {
    statement: string
    skill: string
    emotion: string
    sectionId: string | number
  }
  onSubmit: (data: {
    statement: string
    skill: string
    emotion: string
    sectionId: number
  }) => void
  trigger?: React.ReactNode
}

const skills = ['Anxiety Management', 'Mindfulness Practice', 'Sleep Hygiene']
const emotions = ['Anxiety', 'Stress', 'Calm', 'Joy']

export function StatementDialog({
  mode,
  defaultValues,
  onSubmit,
  trigger,
}: StatementDialogProps) {
  const [open, setOpen] = useState(false)
  const [statement, setStatement] = useState('')
  const [skill, setSkill] = useState('')
  const [emotion, setEmotion] = useState('')
  const [sectionId, setSectionId] = useState<number | null>(null)
  const [sections, setSections] = useState<Section[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchSections = async () => {
    setLoading(true)
    try {
      const response = await sectionService.getAllSections()
      if (response.success) {
        setSections(response.data)
        // Pre-select matching section if editing
        if (defaultValues?.sectionId) {
          const found = response.data.find(
            (s: Section) =>
              s.id === Number(defaultValues.sectionId) ||
              s.name === defaultValues.sectionId
          )
          if (found) setSectionId(found.id)
        }
      } else {
        setError(response.message)
      }
    } catch {
      setError('Failed to load sections')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (open) {
      setStatement(defaultValues?.statement || '')
      setSkill(defaultValues?.skill || '')
      setEmotion(defaultValues?.emotion || '')
      setSectionId(null)
      fetchSections()
    }
  }, [open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!statement || !skill || !emotion || sectionId === null) {
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
            {mode === 'add' ? 'Create New Statement' : 'Edit Statement'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'add'
              ? 'Add a new therapeutic statement to the system.'
              : 'Update the statement information below.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Statement Field */}
          <div className="space-y-2">
            <label htmlFor="statement" className="text-sm font-medium">
              Statement
            </label>
            <Textarea
              id="statement"
              value={statement}
              onChange={(e) => setStatement(e.target.value)}
              placeholder="Enter therapeutic statement"
              required
            />
          </div>

          {/* Skill, Emotion, Section */}
          <div className="grid grid-cols-3 gap-4">
            {/* Skill */}
            <div className="space-y-2">
              <label htmlFor="skill" className="text-sm font-medium">
                Skill
              </label>
              <Select value={skill} onValueChange={setSkill}>
                <SelectTrigger id="skill">
                  <SelectValue placeholder="Select skill" />
                </SelectTrigger>
                <SelectContent>
                  {skills.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Emotion */}
            <div className="space-y-2">
              <label htmlFor="emotion" className="text-sm font-medium">
                Emotion
              </label>
              <Select value={emotion} onValueChange={setEmotion}>
                <SelectTrigger id="emotion">
                  <SelectValue placeholder="Select emotion" />
                </SelectTrigger>
                <SelectContent>
                  {emotions.map((e) => (
                    <SelectItem key={e} value={e}>
                      {e}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Section */}
            <div className="space-y-2">
              <label htmlFor="section" className="text-sm font-medium">
                Section
              </label>
              <Select
                value={sectionId !== null ? sectionId.toString() : ''}
                onValueChange={(value) => setSectionId(Number(value))}
              >
                <SelectTrigger id="section">
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
              {error && <p className="text-sm text-red-600">{error}</p>}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-orange-600 hover:bg-orange-700">
              {mode === 'add' ? 'Create Statement' : 'Update Statement'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
