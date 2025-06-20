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
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import skillsService from '../../services/skills.service'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Checkbox } from '@/components/ui/checkbox'

interface SectionDialogProps {
  mode: 'add' | 'edit'
  defaultValues?: {
    title: string
    skills: string[] // skill IDs
    description: string
  }
  onSubmit: (data: {
    title: string
    skills: string[]
    description: string
  }) => void
  trigger?: React.ReactNode
}

interface Skill {
  id: string
  name: string
  title: string
}

export function SectionDialog({
  mode,
  defaultValues,
  onSubmit,
  trigger,
}: SectionDialogProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState(defaultValues?.title || '')
  const [selectedSkills, setSelectedSkills] = useState<string[]>(defaultValues?.skills || [])
  const [description, setDescription] = useState(defaultValues?.description || '')
  const [skills, setSkills] = useState<Skill[]>([])
  const [loadingSkills, setLoadingSkills] = useState(false)

  useEffect(() => {
    const fetchSkills = async () => {
      setLoadingSkills(true)
      const res = await skillsService.getAllSkills()
      if (res.success) setSkills(res.data)
      else console.error('Failed to load skills:', res.message)
      setLoadingSkills(false)
    }
    fetchSkills()
  }, [])

  const toggleSkill = (id: string) => {
    setSelectedSkills((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || selectedSkills.length === 0 || !description) {
      alert('Please fill out all fields.')
      return
    }
    onSubmit({ title, skills: selectedSkills, description })
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
          <DialogTitle>{mode === 'add' ? 'Create New Section' : 'Edit Section'}</DialogTitle>
          <DialogDescription>
            {mode === 'add'
              ? 'Add a new therapeutic section to the system.'
              : 'Update the section information below.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
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

          {/* Multi-Select Skills */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Skills</label>
            <ScrollArea className="max-h-40 border rounded p-2">
              {skills.map((s) => (
                <div key={s.id} className="flex items-center gap-2 py-1">
                  <Checkbox
                    id={`skill-${s.id}`}
                    checked={selectedSkills.includes(s.id)}
                    onCheckedChange={() => toggleSkill(s.id)}
                  />
                  <label htmlFor={`skill-${s.id}`} className="text-sm">
                    {s.title}
                  </label>
                </div>
              ))}
              {loadingSkills && <p className="text-xs text-muted">Loading...</p>}
              {!loadingSkills && skills.length === 0 && (
                <p className="text-sm text-muted">No skills available</p>
              )}
            </ScrollArea>
          </div>

          {/* Description */}
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

          {/* Buttons */}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
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
