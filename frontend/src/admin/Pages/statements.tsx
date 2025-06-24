import { useEffect, useState } from "react";
import {
  MessageSquare,
  Search,
  PencilIcon,
  Trash2Icon,
} from "lucide-react";
import { StatementDialog } from "@/admin/components/statements/statement-dialog";
import { DashboardLayout } from "@/admin/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

import statementService from "@/services/statement.service";
import skillsService from "@/services/skills.service";
import sectionService from "@/services/section.service";

interface Emotion {
  id: number;
  name: string;
}

interface Statement {
  id: number;
  statement: string;
  skill?: number | string;
  emotion?: Emotion[]; // ✅ updated key to match API response
  sectionId: string;
  createdAt: string;
  updatedAt: string;
}

interface Skill {
  id: number;
  name: string;
}

interface Section {
  id: number;
  title: string;
}

export default function StatementsPage() {
  const [statements, setStatements] = useState<Statement[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [editOpenId, setEditOpenId] = useState<number | null>(null);

  useEffect(() => {
    fetchStatements();
    fetchSkills();
    fetchSections();
  }, []);

  const fetchStatements = async () => {
    const response = await statementService.getAllStatements();
    if (response.success) {
      setStatements(response.data);
    } else {
      console.error(response.message);
    }
  };

  const fetchSkills = async () => {
    const response = await skillsService.getAllSkills();
    if (response.success) {
      setSkills(response.data);
    }
  };

  const fetchSections = async () => {
    const response = await sectionService.getAllSections();
    if (response.success) {
      setSections(response.data);
    }
  };

  const handleCreate = async (data: any) => {
    const response = await statementService.createStatement(data);
    if (response.success) {
      fetchStatements();
    }
  };

  const handleEditOpen = async (id: number) => {
    setEditLoading(true);
    setEditOpenId(id);
    const response = await statementService.getStatementById(id);
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

  const handleUpdate = async (id: number, data: any) => {
    const response = await statementService.updateStatement(id, data);
    if (response.success) {
      fetchStatements();
      handleEditClose();
    }
  };

  const handleDelete = async (id: number) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (deleteId === null) return;
    const response = await statementService.deleteStatement(deleteId);
    if (response.success) {
      fetchStatements();
    }
    setDeleteDialogOpen(false);
    setDeleteId(null);
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setDeleteId(null);
  };

  const getSectionTitle = (id: string) => {
    const section = sections.find((s) => String(s.id) === String(id));
    return section ? section.title : "—";
  };

  const filteredStatements = statements.filter((s) =>
    [
      s.statement,
      s.emotion?.map((e) => e.name).join(" "),
      getSectionTitle(s.sectionId),
    ]
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
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

        {/* Search */}
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

        {/* Table */}
        <div className="border rounded-lg bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[400px]">Statement</TableHead>
                <TableHead>Emotions</TableHead>
                <TableHead>Section</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStatements.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>
                    {s.statement.length > 70
                      ? s.statement.slice(0, 70) + "..."
                      : s.statement}
                  </TableCell>
                  <TableCell>
                    {s.emotion && s.emotion.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {s.emotion.map((e) => (
                          <span
                            key={e.id}
                            className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full"
                          >
                            {e.name.trim()}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>{getSectionTitle(s.sectionId)}</TableCell>
                  <TableCell>
                    {new Date(s.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <StatementDialog
                        mode="edit"
                        defaultValues={
                          editOpenId === s.id && editData
                            ? {
                                statement: editData.statement,
                                emotionIds: Array.isArray(editData.emotion)
                                  ? editData.emotion.map((e: any) => e.id)
                                  : [],
                                sectionId: editData.section?.id || Number(editData.sectionId),
                                skill: 0, // Remove skill dropdown, but keep prop for type
                                emotionId: [], // Remove emotionId dropdown, but keep prop for type
                              }
                            : {
                                statement: s.statement,
                                emotionIds: s.emotion?.map((e) => e.id) || [],
                                sectionId: Number(s.sectionId),
                                skill: 0,
                                emotionId: [],
                              }
                        }
                        onSubmit={(data) => handleUpdate(s.id, data)}
                        open={editOpenId === s.id}
                        onOpenChange={(open) => {
                          if (!open) handleEditClose();
                        }}
                        loading={editLoading}
                        trigger={
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={async (e) => {
                              e.preventDefault();
                              await handleEditOpen(s.id);
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
                        onClick={() => handleDelete(s.id)}
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
            <DialogTitle>Delete Statement</DialogTitle>
          </DialogHeader>
          <div className="py-4">Are you sure you want to delete this statement?</div>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={cancelDelete}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
