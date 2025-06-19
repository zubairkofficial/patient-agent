import { useEffect, useState } from 'react'
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
import statementService from '@/services/statement.service'

interface Statement {
  id: number
  description: string
  skill: string
  emotion: string
  section: string
  created: string
}

export default function StatementsPage() {
  const [statements, setStatements] = useState<Statement[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  const fetchStatements = async () => {
    const response = await statementService.getAllStatements()
    if (response.success) {
      setStatements(response.data)
    } else {
      console.error(response.message)
    }
  }

  useEffect(() => {
    fetchStatements()
  }, [])

  const handleCreate = async (data: any) => {
    const response = await statementService.createStatement(data)
    if (response.success) {
      fetchStatements()
    } else {
      console.error(response.message)
    }
  }

  const handleUpdate = async (id: number, data: any) => {
    const response = await statementService.updateStatement(id, data)
    if (response.success) {
      fetchStatements()
    } else {
      console.error(response.message)
    }
  }

  const handleDelete = async (id: number) => {
    const response = await statementService.deleteStatement(id)
    if (response.success) {
      fetchStatements()
    } else {
      console.error(response.message)
    }
  }

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
          </div>
          <StatementDialog
            mode="add"
            onSubmit={handleCreate}
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
                    <div className="flex items-center gap-2">
                      <StatementDialog
                        mode="edit"
                        defaultValues={{
                          description: statement.description,
                          skill: statement.skill,
                          emotion: statement.emotion,
                          section: statement.section,
                        }}
                        onSubmit={(data) => handleUpdate(statement.id, data)}
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
                        onClick={() => handleDelete(statement.id)}
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
