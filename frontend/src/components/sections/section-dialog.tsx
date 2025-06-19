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
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface SectionDialogProps {
  mode: 'add' | 'edit'
  defaultValues?: {
    title: string
    skill: string
    category: string
    description: string
  }
  onSubmit: (data: {
    title: string
    skill: string
    category: string
    description: string
  }) => void
  trigger?: React.ReactNode
}

const skills = [
  'Anxiety Management',
  'Mindfulness Practice',
  'Sleep Hygiene',
]

const categories = [
  'Assessment',
  'Practice',
  'Theory',
  'Exercise',
]

export function SectionDialog({
  mode,
  defaultValues,
  onSubmit,
  trigger,
}: SectionDialogProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState(defaultValues?.title || '')
  const [skill, setSkill] = useState(defaultValues?.skill || '')
  const [category, setCategory] = useState(defaultValues?.category || '')
  const [description, setDescription] = useState(defaultValues?.description || '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ title, skill, category, description })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-purple-600 hover:bg-purple-700">
            + Add Section
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === 'add' ? 'Create New Section' : 'Edit Section'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'add'
              ? 'Add a new therapeutic section to the system.'
              : 'Update the section information below.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter section title"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
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
              <label htmlFor="category" className="text-sm font-medium">
                Category
              </label>
              <Select
                value={category}
                onValueChange={setCategory}
                required
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter section description"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
              {mode === 'add' ? 'Create Section' : 'Update Section'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
