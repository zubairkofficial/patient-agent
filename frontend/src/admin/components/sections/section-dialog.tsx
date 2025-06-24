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
import skillsService from '../../../services/skills.service'
import Select from 'react-select'

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

  const skillOptions = skills.map((s) => ({
    value: s.id,
    label: s.title,
  }))

  const handleSkillChange = (selected: any) => {
    const ids = selected.map((s: any) => s.value)
    setSelectedSkills(ids)
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

          {/* Multi-select with react-select */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Skills</label>
            <Select
              isMulti
              isLoading={loadingSkills}
              options={skillOptions}
              value={skillOptions.filter((s) => selectedSkills.includes(s.value))}
              onChange={handleSkillChange}
              placeholder="Choose skills"
              className="text-sm"
              classNamePrefix="react-select"
            />
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
