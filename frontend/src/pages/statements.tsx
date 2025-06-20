import { useEffect, useState } from "react";
import { MessageSquare, Search, PencilIcon, Trash2Icon } from "lucide-react";
import { StatementDialog } from "@/components/statements/statement-dialog";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import statementService from '@/services/statement.service'
import skillsService from '@/services/skills.service'
import emotionService from '@/services/emotions.service'
import { data } from 'react-router-dom'

interface Statement {
  updatedAt: string | number | Date
  createdAt: string | number | Date
  id: number
  statement: string
  skill?: number | string
  emotion?: string | number
  sectionId: string
  section?: string
  created: string
}

interface Skill {
  id: number
  name: string
}

interface Emotion {
  title: string | number
  id: number
  name: string
}

export default function StatementsPage() {
  const [statements, setStatements] = useState<Statement[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [emotions, setEmotions] = useState<Emotion[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  const fetchStatements = async () => {
    const response = await statementService.getAllStatements();
    if (response.success) {
      setStatements(response.data)
      console.log('statment',response)
    } else {
      console.error(response.message)
    }
  }

  const fetchSkills = async () => {
    const response = await skillsService.getAllSkills()
    if (response.success) {
      setSkills(response.data)
      console.log('skills',response)
    } else {
      console.error(response.message)
    }
  }

  const fetchEmotions = async () => {
    const response = await emotionService.getAllEmotions()
    if (response.success) {
      setEmotions(response.data)
      console.log('emotions',response)
    } else {
      console.error(response.message);
    }
  };

  useEffect(() => {
    fetchStatements()
    fetchSkills()
    fetchEmotions()
  }, [])

  const handleCreate = async (data: any) => {
    const response = await statementService.createStatement(data);
    if (response.success) {
      fetchStatements();
    } else {
      console.error(response.message);
    }
  };

  const handleUpdate = async (id: number, data: any) => {
    const response = await statementService.updateStatement(id, data);
    if (response.success) {
      fetchStatements();
    } else {
      console.error(response.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this statement?')) return
    const response = await statementService.deleteStatement(id)
    if (response.success) {
      fetchStatements();
    } else {
      console.error(response.message);
    }
  };

  const getSkillName = (id: number | string) => {
    const skill = skills.find((s) => s.id === Number(id));
    return typeof skill?.name === 'string' ? skill.name : '—';
  }

  const getEmotionName = (id: number | string) => {
    const emotion = emotions.find((e) => e.id === Number(id) || e.name === id);
    if (typeof emotion?.name === 'string') return emotion.name;
    if (typeof emotion?.name === 'number') return emotion.name.toString();
    return '—';
  }

  const filteredStatements = statements.filter((statement) =>
    (statement.statement || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    getSkillName(statement.skill || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    getEmotionName(statement.emotion || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (statement.section || '').toLowerCase().includes(searchQuery.toLowerCase())
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
          <StatementDialog mode="add" onSubmit={handleCreate} />
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
                <TableHead className="w-[400px]">Statement</TableHead>
                <TableHead>Skill</TableHead>
                <TableHead>Emotion</TableHead>
                <TableHead>Section ID</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStatements.map((statement) => (
                <TableRow key={statement.id}>
                  <TableCell>{statement.statement || '—'}</TableCell>
                  <TableCell>{getSkillName(statement.skill || '')}</TableCell>
                  <TableCell>{getEmotionName(statement.emotion || '')}</TableCell>
                  <TableCell>{statement.sectionId || '—'}</TableCell>
                  <TableCell>{new Date(statement.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(statement.updatedAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <StatementDialog
                        mode="edit"
                        defaultValues={{
                          statement: statement.statement || '',
                          skill: statement.skill || '',
                          emotion: statement.emotion || '',
                          sectionId: statement.sectionId || '',
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
  );
}
