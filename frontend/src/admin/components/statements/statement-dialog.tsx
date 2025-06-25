import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import SelectReact from 'react-select';

import sectionService from '@/services/section.service';
import emotionService from '@/services/emotions.service';
import skillsService from '@/services/skills.service';

interface Skill {
  id: number;
  title: string;
}

interface Section {
  id: number;
  title: string;
  skillList?: Skill[];
}

interface Emotion {
  id: number;
  name: string;
}

interface StatementDialogProps {
  mode: 'add' | 'edit';
  defaultValues?: {
    statement: string;
    sectionId: number;
    emotionIds: number[];
  };
  onSubmit: (data: {
    statement: string;
    sectionId: number;
    emotionIds: number[];
  }) => void;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  loading?: boolean;
}

export function StatementDialog({
  mode,
  defaultValues,
  onSubmit,
  trigger,
  open: controlledOpen,
  onOpenChange,
  loading: controlledLoading,
}: StatementDialogProps) {
  const [open, setOpen] = useState(false);
  const [statement, setStatement] = useState('');
  const [sectionId, setSectionId] = useState<number | null>(null);
  const [selectedEmotions, setSelectedEmotions] = useState<number[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [emotions, setEmotions] = useState<Emotion[]>([]);
  const [loading, setLoading] = useState(false);

  const isOpen = controlledOpen !== undefined ? controlledOpen : open;
  const isLoading = controlledLoading !== undefined ? controlledLoading : loading;

  useEffect(() => {
    if (isOpen) fetchData();
  }, [isOpen]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sectionRes, emotionRes] = await Promise.all([
        sectionService.getAllSections(),
        emotionService.getAllEmotions(),
      ]);

      if (sectionRes.success) setSections(sectionRes.data);
      if (emotionRes.success) setEmotions(emotionRes.data);
      console.log('Sections:', sectionRes.data);
      console.log('Emotions:', emotionRes.data);

      if (defaultValues) {
        setStatement(defaultValues.statement);
        setSectionId(defaultValues.sectionId);
        setSelectedEmotions(defaultValues.emotionIds || []);
      }
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const emotionOptions = emotions.map((e) => ({
    value: e.id,
    label: e.name,
  }));

  const handleEmotionChange = (selected: any) => {
    const ids = selected.map((s: any) => s.value);
    setSelectedEmotions(ids);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!statement || sectionId === null || selectedEmotions.length === 0) {
      return;
    }
    onSubmit({ statement, sectionId, emotionIds: selectedEmotions });
    setOpen(false);
  };

  const selectedSection = sections.find((s) => s.id === sectionId);
  const filteredSkills = selectedSection?.skillList || [];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange || setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-orange-600 hover:bg-orange-700">
            + Add Statement
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === 'add' ? 'Create Statement' : 'Edit Statement'}</DialogTitle>
          <DialogDescription>
            {mode === 'add'
              ? 'Add a new therapeutic statement.'
              : 'Edit this therapeutic statement.'}
          </DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <div className="py-8 text-center">Loading...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Statement Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Statement</label>
              <Textarea
                value={statement}
                onChange={(e) => setStatement(e.target.value)}
                required
              />
            </div>

            {/* Section Select */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Section</label>
              <Select
                value={sectionId?.toString() || ''}
                onValueChange={(val) => {
                  const secId = Number(val);
                  setSectionId(secId);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select section" />
                </SelectTrigger>
                <SelectContent>
                  {sections.map((section) => (
                    <SelectItem key={section.id} value={section.id.toString()}>
                      {section.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Emotions Multi-select */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Emotions</label>
              <SelectReact
                isMulti
                options={emotionOptions}
                isLoading={isLoading}
                value={emotionOptions.filter((e) =>
                  selectedEmotions.includes(e.value)
                )}
                onChange={handleEmotionChange}
                placeholder="Choose emotions"
                className="text-sm"
              />
            </div>

            {/* Submit + Cancel */}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => (onOpenChange ? onOpenChange(false) : setOpen(false))}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-orange-600 hover:bg-orange-700">
                {mode === 'add' ? 'Create' : 'Update'}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
