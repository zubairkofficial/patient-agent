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
    skills: string[] // skill IDs as strings
    description: string
  }
  onSubmit: (data: {
    title: string
    skills: string[]
    description: string
  }) => void
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  loading?: boolean
}

interface Skill {
  id: number | string
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

  const isOpen = controlledOpen !== undefined ? controlledOpen : open
  const isLoading = controlledLoading !== undefined ? controlledLoading : loadingSkills

  useEffect(() => {
    fetchSkills()
  }, [])

  useEffect(() => {
    if (isOpen && defaultValues) {
      setTitle(defaultValues.title || '')
      setSelectedSkills((defaultValues.skills || []).map((id) => String(id)))
      setDescription(defaultValues.description || '')
    }
  }, [isOpen, defaultValues])

  const fetchSkills = async () => {
    try {
      setLoadingSkills(true)
      const res = await skillsService.getAllSkills()
      if (res.success) {
        setSkills(res.data)
      } else {
        console.error('Failed to load skills:', res.message)
      }
    } catch (err) {
      console.error('Error fetching skills:', err)
    } finally {
      setLoadingSkills(false)
    }
  }

  // Convert all skills to select options with string IDs
  const allSkillOptions = skills.map((s) => ({
    value: String(s.id),
    label: s.title,
  }))

  // Selected options to display
  const selectedSkillOptions = allSkillOptions.filter((option) =>
    selectedSkills.includes(option.value)
  )

  // Only show unselected skills in dropdown
  const availableSkillOptions = allSkillOptions.filter(
    (option) => !selectedSkills.includes(option.value)
  )

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
    <Dialog open={isOpen} onOpenChange={onOpenChange || setOpen}>
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

            {/* Skills */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Skills</label>
              <Select
                isMulti
                isLoading={isLoading}
                options={[...selectedSkillOptions, ...availableSkillOptions]}
                value={selectedSkillOptions}
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
              <Button
                type="button"
                variant="outline"
                onClick={() => (onOpenChange ? onOpenChange(false) : setOpen(false))}
              >
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
