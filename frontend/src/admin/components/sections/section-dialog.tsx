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
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  loading?: boolean;
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
  open: controlledOpen,
  onOpenChange,
  loading: controlledLoading,
}: SectionDialogProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [description, setDescription] = useState('')
  const [skills, setSkills] = useState<Skill[]>([])
  const [loadingSkills, setLoadingSkills] = useState(false)

  // Use controlled open/loading if provided
  const isOpen = controlledOpen !== undefined ? controlledOpen : open;
  const isLoading = controlledLoading !== undefined ? controlledLoading : loadingSkills;

  // Fetch all skills on mount (so we can always show all options)
  useEffect(() => {
    fetchSkills();
  }, []);

  // Reset form fields when dialog opens or defaultValues change
  useEffect(() => {
    if (isOpen) {
      setTitle(defaultValues?.title || '')
      setSelectedSkills(defaultValues?.skills || [])
      setDescription(defaultValues?.description || '')
    }
    // eslint-disable-next-line
  }, [isOpen, defaultValues])

  const fetchSkills = async () => {
    setLoadingSkills(true)
    const res = await skillsService.getAllSkills()
    if (res.success) setSkills(res.data)
    else console.error('Failed to load skills:', res.message)
    setLoadingSkills(false)
  }

  // Map skill IDs to full skill objects for display
  const selectedSkillObjects = skills.filter((s) => selectedSkills.includes(s.id));

  const skillOptions = skills.map((s) => ({
    value: s.id,
    label: s.title,
  }))

  const handleSkillChange = (selected: any) => {
    const ids = selected ? selected.map((s: any) => s.value) : []
    setSelectedSkills(ids)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || selectedSkills.length === 0 || !description) {
      alert('Please fill out all fields.')
      return
    }
    onSubmit({ title, skills: selectedSkills, description })
    if (onOpenChange) onOpenChange(false)
    else setOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange ? onOpenChange : setOpen}>
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
        {isLoading ? (
          <div className="py-8 text-center">Loading...</div>
        ) : (
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
              isLoading={isLoading}
              options={skillOptions}
              value={skillOptions.filter((s) => selectedSkills.includes(s.value))}
              onChange={handleSkillChange}
              placeholder="Choose skills"
              className="text-sm"
              classNamePrefix="react-select"
            />
            {/* Show selected skills as chips below the select, like emotions in statements */}
            {selectedSkillObjects.length > 0 ? (
              <div className="flex flex-wrap gap-1 mt-2">
                {selectedSkillObjects.map((skill) => (
                  <span
                    key={skill.id}
                    className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full"
                  >
                    {skill.title}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-muted-foreground">—</span>
            )}
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
            <Button type="button" variant="outline" onClick={() => (onOpenChange ? onOpenChange(false) : setOpen(false))}>
              Cancel
            </Button>
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
              {mode === 'add' ? 'Create Section' : 'Update Section'}
            </Button>
          </div>
        </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
