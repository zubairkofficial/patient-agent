import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  CheckCircle,
  Circle,
  Clock,
  Target,
  BadgeCheck,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Link, useParams } from 'react-router-dom';
import statementService from '@/services/statement.service';
import sectionService from '@/services/section.service';

interface Emotion {
  id: number;
  name: string;
}

interface SectionMeta {
  title: string;
  description: string;
  time: string;
  level: string;
}

interface Statement {
  id: number;
  statement: string;
  completed?: boolean;
  completedDate?: string;
  emotions?: Emotion[]; // Correct spelling
  sectionId: number;
}

export default function Statements() {
  const { id } = useParams<{ id: string }>();
  const [statements, setStatements] = useState<Statement[]>([]);
  const [sectionMeta, setSectionMeta] = useState<SectionMeta | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const sectionId = parseInt(id, 10);
      loadStatements(sectionId);
      loadSectionMeta(sectionId);
    }
  }, [id]);

  const loadStatements = async (sectionId: number) => {
    setLoading(true);
    const res = await statementService.getStatementsBySectionId(sectionId);
    if (res.success) {
      // Normalize emotion(s)
      const normalized = res.data.map((s: any) => ({
        ...s,
        emotions: s.emotion || [], // Fix backend prop
      }));
      setStatements(normalized);
    } else {
      console.error('Failed to fetch statements:', res.message);
    }
    setLoading(false);
  };

  const loadSectionMeta = async (sectionId: number) => {
    const res = await sectionService.getSectionById(sectionId);
    if (res.success) {
      setSectionMeta(res.data);
    } else {
      console.error('Failed to fetch section meta:', res.message);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (statements.length === 0)
    return <div className="p-4">No statements found for this section.</div>;

  const total = statements.length;
  const completedCount = statements.filter((s) => s.completed).length;
  const percent = Math.round((completedCount / total) * 100);

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Back Link */}
      <div className="flex items-center gap-2 mb-4">
        <Link to="/user/home">
          <Button variant="ghost" size="icon">
            <ArrowLeft />
          </Button>
        </Link>
        <span className="text-lg font-semibold">Back to Home</span>
      </div>

      {/* Section Header */}
      {sectionMeta && (
        <div className="mb-6">
          <div className="text-3xl font-bold mb-1">{sectionMeta.title}</div>
          <div className="text-gray-500 mb-2">{sectionMeta.description}</div>
          <div className="flex flex-wrap gap-4 bg-blue-50 rounded-xl p-4 items-center">
            <div>
              <div className="text-xs font-semibold text-blue-700">Your Progress</div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xl">
                  {completedCount} of {total}
                </span>
                <span className="text-xs bg-blue-100 text-blue-700 rounded-full px-2 py-0.5 font-semibold">
                  {percent}% Complete
                </span>
              </div>
              <Progress value={percent} className="mt-1 h-2 bg-blue-100" />
            </div>
            <div className="flex items-center gap-2">
              <Clock className="text-blue-400" size={18} />
              <span className="text-sm font-medium">Estimated Time</span>
              <span className="font-semibold">{sectionMeta.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="text-blue-400" size={18} />
              <span className="text-sm font-medium">Difficulty</span>
              <span className="font-semibold">{sectionMeta.level}</span>
            </div>
          </div>
        </div>
      )}

      {/* Statements List */}
      <div>
        <div className="text-2xl font-bold mb-4">Therapeutic Statements</div>
        <div className="space-y-4">
          {statements.map((s, idx) => (
            <Card
              key={s.id}
              className={s.completed ? 'bg-green-50 border-green-200' : ''}
            >
              <CardHeader className="flex items-center gap-3 pb-2">
                {s.completed ? (
                  <CheckCircle className="text-green-500" />
                ) : (
                  <Circle className="text-gray-300" />
                )}
                <div className="flex flex-col md:flex-row md:items-center gap-2 w-full">
                  <CardTitle className="flex items-center gap-2 text-base">
                    {s.emotions?.[0]?.name && (
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                        {s.emotions[0].name}
                      </span>
                    )}
                  </CardTitle>
                  {s.completed && (
                    <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                      Completed
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-gray-700 mb-2">{s.statement}</div>
                {s.completed ? (
                  <div className="flex items-center gap-2 text-xs text-green-700">
                    <BadgeCheck size={16} /> Completed on {s.completedDate}
                  </div>
                ) : (
                  <div className="flex justify-end">
                    <Button variant="outline">Start</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="flex justify-end mt-8">
          <Button className="bg-blue-600 text-white px-8 py-2 rounded-lg font-semibold hover:bg-blue-700">
            Continue Next Exercise
          </Button>
        </div>
      </div>
    </div>
  );
}
