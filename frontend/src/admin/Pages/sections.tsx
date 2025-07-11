import { useEffect, useState, type ReactNode } from 'react';
import { Layers, Search, PencilIcon, Trash2Icon } from 'lucide-react';
import { SectionDialog } from '@/admin/components/sections/section-dialog';
import { DashboardLayout } from '@/admin/components/layout/dashboard-layout';
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface Skill {
  id: number;
  title: string;
}

interface Section {
  id: number;
  title: string;
  skillList: Skill[];
  category: string;
  description: string;
  createdAt: string | number | Date;
  List?: ReactNode;
}

export default function SectionsPage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [editData, setEditData] = useState<any>(null);
  const [editOpenId, setEditOpenId] = useState<number | null>(null);
  const [editLoading, setEditLoading] = useState(false);

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

  const handleDelete = (id: number) => {
    setDeleteId(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (deleteId === null) return
    const response = await sectionService.deleteSection(deleteId)
    if (response.success) {
      fetchSections()
    } else {
      console.error(response.message)
    }
    setDeleteDialogOpen(false)
    setDeleteId(null)
  }

  const cancelDelete = () => {
    setDeleteDialogOpen(false)
    setDeleteId(null)
  }

  const handleEditOpen = async (id: number) => {
    setEditLoading(true);
    setEditOpenId(id);
    const response = await sectionService.getSectionById(id);
    if (response.success) {
      setEditData(response.data);
    } else {
      setEditData(null);
      console.error(response.message);
    }
    setEditLoading(false);
  };

  const handleEditClose = () => {
    setEditOpenId(null);
    setEditData(null);
    setEditLoading(false);
  };

  const filteredSections = sections.filter((section) => {
    const skills = section.skillList.map((s) => s.title).join(' ').toLowerCase();
    return (
      section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      section.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skills.includes(searchQuery.toLowerCase()) ||
      section.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

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
                <TableHead>Skills</TableHead>
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
                    <div className="flex flex-wrap gap-1">
                      {section.skillList?.map((skill) => (
                        <span
                          key={skill.id}
                          className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs"
                        >
                          {skill.title}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    {section.description.length > 70
                      ? section.description.slice(0, 70) + '...'
                      : section.description}
                  </TableCell>
                  <TableCell>{new Date(section.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <SectionDialog
                        mode="edit"
                        defaultValues={
                          editOpenId === section.id && editData
                            ? {
                                title: editData.title,
                                skills: editData.skillList?.map((skill: any) => String(skill.id)) || [],
                                description: editData.description,
                              }
                            : {
                                title: section.title,
                                skills: section.skillList.map((skill) => String(skill.id)),
                                description: section.description,
                              }
                        }
                        onSubmit={(data) => handleUpdate(section.id, data)}
                        open={editOpenId === section.id}
                        onOpenChange={(open) => {
                          if (!open) handleEditClose();
                        }}
                        loading={editLoading}
                        trigger={
                          <Button variant="ghost" size="icon" className="h-8 w-8"
                            onClick={async (e) => {
                              e.preventDefault();
                              await handleEditOpen(section.id);
                            }}
                          >
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Section</DialogTitle>
          </DialogHeader>
          <div className="py-4">Are you sure you want to delete this section?</div>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={cancelDelete}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
