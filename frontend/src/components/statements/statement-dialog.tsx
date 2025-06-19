import { useState } from 'react'
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

interface StatementDialogProps {
  mode: 'add' | 'edit'
  defaultValues?: {
    description: string
    skill: string
    emotion: string
    section: string
  }
  onSubmit: (data: {
    description: string
    skill: string
    emotion: string
    section: string
  }) => void
  trigger?: React.ReactNode
}

const skills = [
  'Anxiety Management',
  'Mindfulness Practice',
  'Sleep Hygiene',
]

const emotions = [
  'Anxiety',
  'Stress',
  'Calm',
  'Joy',
]

const sections = [
  'Initial Assessment',
  'Breathing Techniques',
  'Daily Meditation',
]

export function StatementDialog({
  mode,
  defaultValues,
  onSubmit,
  trigger,
}: StatementDialogProps) {
  const [open, setOpen] = useState(false)
  const [description, setDescription] = useState(defaultValues?.description || '')
  const [skill, setSkill] = useState(defaultValues?.skill || '')
  const [emotion, setEmotion] = useState(defaultValues?.emotion || '')
  const [section, setSection] = useState(defaultValues?.section || '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ description, skill, emotion, section })
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
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter statement description"
              required
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label htmlFor="skill" className="text-sm font-medium">
                Skill
              </label>
              <Select
                value={skill}
                onValueChange={setSkill}
                required
              >
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
            <div className="space-y-2">
              <label htmlFor="emotion" className="text-sm font-medium">
                Emotion
              </label>
              <Select
                value={emotion}
                onValueChange={setEmotion}
                required
              >
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
            <div className="space-y-2">
              <label htmlFor="section" className="text-sm font-medium">
                Section
              </label>
              <Select
                value={section}
                onValueChange={setSection}
                required
              >
                <SelectTrigger id="section">
                  <SelectValue placeholder="Select section" />
                </SelectTrigger>
                <SelectContent>
                  {sections.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
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
              {mode === 'add' ? 'Create Statement' : 'Update Statement'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
