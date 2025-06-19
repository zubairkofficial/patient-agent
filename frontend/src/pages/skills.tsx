import { useState } from 'react'
import { Brain, Search, PencilIcon, Trash2Icon } from 'lucide-react'
import { SkillDialog } from '@/components/skills/skill-dialog'
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

interface Skill {
  id: number
  title: string
  description: string
  created: string
  updated: string
}

const skills: Skill[] = [
  {
    id: 1,
    title: 'Anxiety Management',
    description: 'Techniques and strategies for managing anxiety and stress in daily life',
    created: '2024-01-15',
    updated: '2024-01-15',
  },
  {
    id: 2,
    title: 'Mindfulness Practice',
    description: 'Mindfulness exercises and meditation techniques for mental wellness',
    created: '2024-01-14',
    updated: '2024-01-16',
  },
  {
    id: 3,
    title: 'Sleep Hygiene',
    description: 'Best practices for improving sleep quality and establishing healthy sleep patterns',
    created: '2024-01-13',
    updated: '2024-01-13',
  },
]

export default function SkillsPage() {
  const [searchQuery, setSearchQuery] = useState('')

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
          </div>          <SkillDialog
            mode="add"
            onSubmit={(data) => {
              console.log('Create skill:', data)
              // API integration will go here
            }}
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
                <TableHead>Updated</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSkills.map((skill) => (
                <TableRow key={skill.id}>
                  <TableCell className="font-medium">{skill.title}</TableCell>
                  <TableCell>{skill.description}</TableCell>
                  <TableCell>{skill.created}</TableCell>
                  <TableCell>{skill.updated}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">                      <SkillDialog
                        mode="edit"
                        defaultValues={{
                          title: skill.title,
                          description: skill.description,
                        }}
                        onSubmit={(data) => {
                          console.log('Update skill:', skill.id, data)
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
                          console.log('Delete skill:', skill.id)
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
