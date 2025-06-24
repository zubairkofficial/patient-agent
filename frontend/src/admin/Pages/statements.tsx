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

  const handleUpdate = async (id: number, data: any) => {
    const response = await statementService.updateStatement(id, data);
    if (response.success) {
      fetchStatements();
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this statement?")) return;
    const response = await statementService.deleteStatement(id);
    if (response.success) {
      fetchStatements();
    }
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
                        defaultValues={{
                          statement: s.statement,
                          emotionIds: s.emotion?.map((e) => e.id) || [],
                          emotionId: [],
                          skill: typeof s.skill === "number" ? s.skill : 0,
                          sectionId: Number(s.sectionId),
                        }}
                        onSubmit={(data) => handleUpdate(s.id, data)}
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
    </DashboardLayout>
  );
}
