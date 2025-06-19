import { useState } from 'react'
import { Smile, Search, PencilIcon, Trash2Icon } from 'lucide-react'
import { EmotionDialog } from '@/components/emotions/emotion-dialog'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
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

interface Emotion {
  id: number
  title: string
  detail: string
  created: string
  updated: string
}

const emotions: Emotion[] = [
  {
    id: 1,
    title: 'Anxiety',
    detail: 'A feeling of worry, nervousness, or unease about something with an uncertain outcome',
    created: '2024-01-15',
    updated: '2024-01-15',
  },
  {
    id: 2,
    title: 'Stress',
    detail: 'A state of mental or emotional strain resulting from adverse or demanding circumstances',
    created: '2024-01-14',
    updated: '2024-01-16',
  },
  {
    id: 3,
    title: 'Calm',
    detail: 'A peaceful state of mind, free from agitation, excitement, or disturbance',
    created: '2024-01-13',
    updated: '2024-01-13',
  },
  {
    id: 4,
    title: 'Joy',
    detail: 'A feeling of great pleasure and happiness, often accompanied by a sense of fulfillment',
    created: '2024-01-12',
    updated: '2024-01-12',
  },
]

export default function EmotionsPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredEmotions = emotions.filter(
    emotion =>
      emotion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
              Manage emotional states and their descriptions            </p>
          </div>
          <EmotionDialog
            mode="add"
            onSubmit={(data) => {
              console.log('Create emotion:', data)
              // API integration will go here
            }}
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
                <TableHead>Updated</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmotions.map((emotion) => (
                <TableRow key={emotion.id}>
                  <TableCell className="font-medium">{emotion.title}</TableCell>
                  <TableCell>{emotion.detail}</TableCell>
                  <TableCell>{emotion.created}</TableCell>
                  <TableCell>{emotion.updated}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">                      <EmotionDialog
                        mode="edit"
                        defaultValues={{
                          title: emotion.title,
                          detail: emotion.detail,
                        }}
                        onSubmit={(data) => {
                          console.log('Update emotion:', emotion.id, data)
                          // API integration will go here
                        }}
                        trigger={
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </Button>
                        }
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => {
                          console.log('Delete emotion:', emotion.id)
                          // API integration will go here
                        }}
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
