// src/components/emotions/emotion-dialog.tsx
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

interface EmotionDialogProps {
  mode: 'add' | 'edit'
  defaultValues?: {
    name: string
    detail: string
  }
  onSubmit: (data: { name: string; detail: string }) => void
  trigger?: React.ReactNode
}

export function EmotionDialog({
  mode,
  defaultValues,
  onSubmit,
  trigger,
}: EmotionDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [detail, setDetail] = useState('')

  const handleOpen = (isOpen: boolean) => {
    setOpen(isOpen)
    if (isOpen && defaultValues) {
      setName(defaultValues.name || '')
      setDetail(defaultValues.detail || '')
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ name, detail })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            {mode === 'add' ? '+ Add Emotion' : 'Edit Emotion'}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === 'add' ? 'Create New Emotion' : 'Edit Emotion'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'add'
              ? 'Add a new emotional state to the system.'
              : 'Update the emotion information below.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Name
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter emotion name"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="detail" className="text-sm font-medium">
              Detail
            </label>
            <Textarea
              id="detail"
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              placeholder="Enter emotion detail"
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
            <Button type="submit">
              {mode === 'add' ? 'Create Emotion' : 'Update Emotion'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
