import { useEffect, useState } from 'react'
import { Brain, Search, PencilIcon, Trash2Icon } from 'lucide-react'
import { SkillDialog } from '@/admin/components/skills/skill-dialog'
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
import skillsService from '../../services/skills.service' // ✅ Import service

interface Skill {
  updatedAt: string | number | Date
  createdAt: string | number | Date
  id: number
  title: string
  description: string
  created: string
  updated: string
}

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  // ✅ Load skills initially
  useEffect(() => {
    fetchSkills()
  }, [])

  const fetchSkills = async () => {
    const response = await skillsService.getAllSkills()
    if (response.success && Array.isArray(response.data)) {
      setSkills(response.data)
    } else {
      setSkills([])
      console.error(response.message)
    }
  }

  const handleCreate = async (data: { title: string; description: string }) => {
    const response = await skillsService.createSkill(data)
    if (response.success) {
      fetchSkills()
    } else {
      console.error(response.message)
    }
  }

  const handleUpdate = async (id: number, data: { title: string; description: string }) => {
    const response = await skillsService.updateSkill(id, data)
    if (response.success) {
      fetchSkills()
    } else {
      console.error(response.message)
    }
  }

  const handleDelete = async (id: number) => {
    const response = await skillsService.deleteSkill(id)
    if (response.success) {
      fetchSkills()
    } else {
      console.error(response.message)
    }
  }

  const filteredSkills = skills.filter(
    skill =>
      skill.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Brain className="h-8 w-8 text-blue-600" />
              Skills Management
            </h1>
            <p className="text-muted-foreground">
              Manage therapeutic skills and techniques
            </p>
          </div>
          <SkillDialog
            mode="add"
            onSubmit={handleCreate}
          />
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search skills..."
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
                <TableHead className="w-[500px]">Description</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSkills.map((skill) => (
                <TableRow key={skill.id}>
                  <TableCell className="font-medium">{skill.title}</TableCell>
                  <TableCell>{skill.description}</TableCell>
                  <TableCell>{new Date(skill.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <SkillDialog
                        mode="edit"
                        defaultValues={{
                          title: skill.title,
                          description: skill.description,
                        }}
                        onSubmit={(data) => handleUpdate(skill.id, data)}
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
                        onClick={() => handleDelete(skill.id)}
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
