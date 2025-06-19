import { useState } from 'react'
import { MessageSquare, Search, PencilIcon, Trash2Icon } from 'lucide-react'
import { StatementDialog } from '@/components/statements/statement-dialog'
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

interface Statement {
  id: number
  description: string
  skill: string
  emotion: string
  section: string
  created: string
  actions?: React.ReactNode
}

const statements: Statement[] = [
  {
    id: 1,
    description: 'Take three deep breaths, inhaling for 4 counts and exhaling for 6 counts',
    skill: 'Mindfulness Practice',
    emotion: 'Anxiety',
    section: 'Breathing Techniques',
    created: '2024-01-15',
  },
  {
    id: 2,
    description: 'Notice five things you can see around you',
    skill: 'Grounding',
    emotion: 'Anxiety',
    section: 'Initial Assessment',
    created: '2024-01-14',
  },
  {
    id: 3,
    description: 'Sit comfortably, close your eyes, and focus on your breath',
    skill: 'Mindfulness Practice',
    emotion: 'Calm',
    section: 'Daily Meditation',
    created: '2024-01-13',
  },
]

export default function StatementsPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredStatements = statements.filter(
    statement =>
      statement.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      statement.skill.toLowerCase().includes(searchQuery.toLowerCase()) ||
      statement.emotion.toLowerCase().includes(searchQuery.toLowerCase()) ||
      statement.section.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <MessageSquare className="h-8 w-8" />
              Statements Management
            </h1>
            <p className="text-muted-foreground">
              Manage therapeutic statements and guidance
            </p>
          </div>          <StatementDialog
            mode="add"
            onSubmit={(data) => {
              console.log('Create statement:', data)
              // API integration will go here
            }}
          />
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search statements..."
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
                <TableHead className="w-[400px]">Description</TableHead>
                <TableHead>Skill</TableHead>
                <TableHead>Emotion</TableHead>
                <TableHead>Section</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStatements.map((statement) => (
                <TableRow key={statement.id}>
                  <TableCell>{statement.description}</TableCell>
                  <TableCell>{statement.skill}</TableCell>
                  <TableCell>{statement.emotion}</TableCell>
                  <TableCell>{statement.section}</TableCell>
                  <TableCell>{statement.created}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">                      <StatementDialog
                        mode="edit"
                        defaultValues={{
                          description: statement.description,
                          skill: statement.skill,
                          emotion: statement.emotion,
                          section: statement.section,
                        }}
                        onSubmit={(data) => {
                          console.log('Update statement:', statement.id, data)
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
                          console.log('Delete statement:', statement.id)
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
