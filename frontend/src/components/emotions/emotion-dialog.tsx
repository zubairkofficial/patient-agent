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
    title: string
    detail: string
  }
  onSubmit: (data: { title: string; detail: string }) => void
  trigger?: React.ReactNode
}

export function EmotionDialog({
  mode,
  defaultValues,
  onSubmit,
  trigger,
}: EmotionDialogProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState(defaultValues?.title || '')
  const [detail, setDetail] = useState(defaultValues?.detail || '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ title, detail })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
            <label htmlFor="title" className="text-sm font-medium">
              Title
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter emotion title"
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
