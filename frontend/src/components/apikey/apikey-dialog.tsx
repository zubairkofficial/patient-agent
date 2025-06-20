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
import { useState, useEffect } from 'react'

interface AdminDialogProps {
  mode: 'edit'
  defaultValue: string
  onSubmit: (data: { openaikey: string }) => void
  trigger?: React.ReactNode
}

export function AdminDialog({ mode, defaultValue, onSubmit, trigger }: AdminDialogProps) {
  const [open, setOpen] = useState(false)
  const [openaikey, setOpenAiKey] = useState(defaultValue)

  useEffect(() => {
    if (open) {
      setOpenAiKey(defaultValue)
    }
  }, [open, defaultValue])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!openaikey.trim()) {
      alert('Please enter a valid OpenAI key')
      return
    }
    onSubmit({ openaikey })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button>Update OpenAI Key</Button>}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === 'edit' ? 'Update OpenAI Key' : 'Set OpenAI Key'}
          </DialogTitle>
          <DialogDescription>
            Enter the OpenAI API key for admin usage.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            value={openaikey}
            onChange={(e) => setOpenAiKey(e.target.value)}
            placeholder="Enter OpenAI Key"
            required
          />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
