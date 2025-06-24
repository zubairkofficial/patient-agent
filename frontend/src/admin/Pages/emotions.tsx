import { useEffect, useState } from 'react'
import { Smile, Search, PencilIcon, Trash2Icon } from 'lucide-react'
import { EmotionDialog } from '@/admin/components/emotions/emotion-dialog'
import { DashboardLayout } from '@/admin/components/layout/dashboard-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import emotionService from '../../services/emotions.service'

interface Emotion {
  id: number
  name: string
  detail: string
  createdAt: string
  updatedAt: string
}

export default function EmotionsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [emotions, setEmotions] = useState<Emotion[]>([])

  const fetchEmotions = async () => {
    const res = await emotionService.getAllEmotions()
    if (res.success) {
      setEmotions(res.data)
    } else {
      console.error(res.message)
    }
  }

  useEffect(() => {
    fetchEmotions()
  }, [])

  const handleCreate = async (data: { name: string; detail: string }) => {
    const res = await emotionService.createEmotion(data)
    if (res.success) fetchEmotions()
  }

  const handleUpdate = async (id: number, data: { name: string; detail: string }) => {
    const res = await emotionService.updateEmotion(id, data)
    if (res.success) fetchEmotions()
  }

  const handleDelete = async (id: number) => {
    const res = await emotionService.deleteEmotion(id)
    if (res.success) fetchEmotions()
  }

  const filteredEmotions = emotions.filter(
    (emotion) =>
      emotion.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emotion.detail.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Smile className="h-8 w-8" />
              Emotions Management
            </h1>
            <p className="text-muted-foreground">
              Manage emotional states and their descriptions
            </p>
          </div>
          <EmotionDialog
            mode="add"
            onSubmit={handleCreate}
          />
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search emotions..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="border rounded-lg bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead className="w-[500px]">Detail</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmotions.map((emotion) => (
                <TableRow key={emotion.id}>
                  <TableCell className="font-medium">{emotion.name}</TableCell>
                  <TableCell>{emotion.detail}</TableCell>
                  <TableCell>{new Date(emotion.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <EmotionDialog
                        mode="edit"
                        defaultValues={{
                          name: emotion.name,
                          detail: emotion.detail,
                        }}
                        onSubmit={(data) => handleUpdate(emotion.id, data)}
                        trigger={
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <PencilIcon className="h-4 w-4" />
                          </Button>
                        }
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => handleDelete(emotion.id)}
                      >
                        <Trash2Icon className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  )
}
