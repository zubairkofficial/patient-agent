// src/pages/SectionsPage.tsx
import { useEffect, useState } from 'react';
import { Layers, Search, PencilIcon, Trash2Icon } from 'lucide-react';
import { SectionDialog } from '@/components/sections/section-dialog';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import sectionService from '@/services/section.service';

interface Section {
  id: number;
  title: string;
  skill: string;
  category: string;
  description: string;
  created: string;
}

export default function SectionsPage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    const response = await sectionService.getAllSections();
    if (response.success) {
      setSections(response.data);
    } else {
      console.error(response.message);
    }
  };

  const handleCreate = async (data: any) => {
    const response = await sectionService.createSection(data);
    if (response.success) {
      fetchSections();
    } else {
      console.error(response.message);
    }
  };

  const handleUpdate = async (id: number, data: any) => {
    const response = await sectionService.updateSection(id, data);
    if (response.success) {
      fetchSections();
    } else {
      console.error(response.message);
    }
  };

  const handleDelete = async (id: number) => {
    const response = await sectionService.deleteSection(id);
    if (response.success) {
      fetchSections();
    } else {
      console.error(response.message);
    }
  };

  const filteredSections = sections.filter(
    (section) =>
      section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      section.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      section.skill.toLowerCase().includes(searchQuery.toLowerCase()) ||
      section.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Layers className="h-8 w-8 text-purple-600" />
              Sections Management
            </h1>
            <p className="text-muted-foreground">
              Manage therapeutic sections and categories
            </p>
          </div>
          <SectionDialog mode="add" onSubmit={handleCreate} />
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search sections..."
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
                <TableHead>Skill</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="w-[400px]">Description</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSections.map((section) => (
                <TableRow key={section.id}>
                  <TableCell className="font-medium">{section.title}</TableCell>
                  <TableCell>
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                      {section.skill}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs">
                      {section.category}
                    </span>
                  </TableCell>
                  <TableCell>{section.description}</TableCell>
                  <TableCell>{section.created}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <SectionDialog
                        mode="edit"
                        defaultValues={{
                          title: section.title,
                          skill: section.skill,
                          category: section.category,
                          description: section.description,
                        }}
                        onSubmit={(data) => handleUpdate(section.id, data)}
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
                        onClick={() => handleDelete(section.id)}
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
