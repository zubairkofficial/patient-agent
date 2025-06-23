import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Lightbulb, ArrowLeft } from 'lucide-react';
import * as React from 'react';
import statementService from '@/services/statement.service';
import axios from 'axios';

interface Emotion {
  id: number;
  name: string;
}

interface Statement {
  id: number;
  statement: string;
  sectionId: number;
  createdAt: string;
  updatedAt: string;
  emotions?: Emotion[];
}

export default function StatementResponse() {
  const { id, statementId } = useParams();
  const [statement, setStatement] = React.useState<Statement | null>(null);
  const [response, setResponse] = React.useState('');
  const [aiReply, setAiReply] = React.useState('');
  const [rating, setRating] = React.useState<number | null>(null);
  const [submitted, setSubmitted] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [processing, setProcessing] = React.useState(false);

  const tips = [
    'Be specific about what exactly is worrying you',
    'Focus on actions that are within your control',
    'Start with the smallest, most manageable action',
    'Remember that taking any action, however small, can reduce worry',
  ];

  React.useEffect(() => {
    if (statementId) {
      fetchStatement(parseInt(statementId, 10));
    }
  }, [statementId]);

  const fetchStatement = async (stmtId: number) => {
    setLoading(true);
    const res = await statementService.getStatementById(stmtId);
    if (res.success) {
      setStatement({
        ...res.data,
        emotions: res.data.emotion || [],
      });
    } else {
      setError(res.message);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (response.length < 10 || !statement?.id) return;

    setSubmitted(true);
    setProcessing(true);

    try {
      const res = await axios.post(`http://localhost:3000/langgraph/ask`, {
        response,
        statementId: statement.id,
      });

      if (res.data?.bot_remarks) {
        setAiReply(res.data.bot_remarks);
        setRating(res.data.rating ?? null);
      } else {
        setAiReply('AI did not return a valid response.');
      }
    } catch (err: any) {
      setAiReply('Error fetching AI response.');
      console.error('AI error:', err);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div className="p-6 text-center">Loading statement...</div>;
  if (error) return <div className="p-6 text-red-600 text-center">Error: {error}</div>;
  if (!statement) return <div className="p-6 text-center">No statement found.</div>;

  return (
    <div className="max-w-3xl mx-auto py-8">
      {/* Back Button */}
      <div className="flex items-center gap-2 mb-4">
        <Link to={`/user/section/${id}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft />
          </Button>
        </Link>
        <span className="text-lg font-semibold">Back to Section</span>
      </div>

      {/* Statement Card */}
      <Card className="bg-blue-50 border-blue-200 mb-6">
        <div className="p-4 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex-1">
            <div className="font-bold text-lg mb-1">Therapeutic Exercise</div>
            <div className="text-blue-700 text-sm mb-2">
              Focus on this exercise and provide your honest response
            </div>
            <div className="bg-white rounded-lg p-4 border text-gray-700 text-base">
              {statement.statement}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            {statement.emotions && statement.emotions.length > 0 ? (
              <div className="flex flex-wrap gap-2 justify-end">
                {statement.emotions.map((emotion) => (
                  <span
                    key={emotion.id}
                    className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold"
                  >
                    {emotion.name}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-xs text-gray-400">No emotions tagged</span>
            )}
            <span className="text-xs text-gray-400">Take your time</span>
          </div>
        </div>
      </Card>

      {/* Tips Card */}
      <Card className="bg-yellow-50 border-yellow-200 mb-6">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="text-yellow-500" size={18} />
            <span className="font-bold text-lg text-yellow-800">Helpful Tips</span>
          </div>
          <ul className="list-disc pl-6 text-yellow-900 text-sm space-y-1">
            {tips.map((tip, idx) => (
              <li key={idx}>{tip}</li>
            ))}
          </ul>
        </div>
      </Card>

      {/* Response Form */}
      <Card>
        <div className="p-6">
          <div className="font-bold text-xl mb-2">Your Response</div>
          <div className="text-gray-600 mb-4 text-sm">
            Share your thoughts, feelings, or experience with this exercise.
          </div>
          <form onSubmit={handleSubmit}>
            <label className="block font-semibold mb-1">Your thoughts and reflections:</label>
            <textarea
              className="w-full border rounded-lg p-3 mb-2 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="How did it make you feel? What was helpful or challenging?"
              minLength={10}
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              required
            />
            <div className="text-xs text-gray-400 mb-2">
              Minimum 10 characters - {response.length} characters entered
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Your response is private and secure</span>
              <Button
                type="submit"
                className="bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-600"
                disabled={response.length < 10 || processing}
              >
                {processing ? 'Processing...' : 'Submit Response'}
              </Button>
            </div>
          </form>

          {/* AI Response */}
          {submitted && aiReply && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800 whitespace-pre-line">
              <strong>AI Response:</strong>
              <div className="mt-1 mb-2">{aiReply}</div>
              {rating !== null && (
                <div className="text-xs font-semibold text-green-700">
                  <span>AI Rating: </span>
                  <span className="bg-green-200 px-2 py-0.5 rounded-full">{rating}/10</span>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>

      <div className="text-center text-xs text-gray-400 mt-4">
        This exercise is part of your therapeutic journey.
      </div>
    </div>
  );
}
