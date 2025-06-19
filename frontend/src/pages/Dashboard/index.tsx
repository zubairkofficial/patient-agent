import { useState } from 'react';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

const API_BASE = 'http://localhost:3000/langgraph';

export default function AgentChatPage() {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<{ role: string; content: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    setLoading(true);

    try {
      // Step 1: Ask
      const askRes = await axios.get(`${API_BASE}/ask`, {
        params: { prompt: input },
      });

      const botResponse = askRes.data.response;

      setHistory((prev) => [
        ...prev,
        { role: 'user', content: input },
        { role: 'bot', content: botResponse },
      ]);

      // Step 2: Optional confirmation
      if (botResponse.toLowerCase().includes('do you want me to proceed')) {
        const confirmRes = await axios.get(`${API_BASE}/confirm`, {
          params: { prompt: input, confirm: 'yes' },
        });

        const confirmBot = confirmRes.data.response;

        setHistory((prev) => [
          ...prev,
          { role: 'user', content: 'yes' },
          { role: 'bot', content: confirmBot },
        ]);
      }

      setInput('');
    } catch (err) {
      console.error(err);
      alert('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen p-6">
      <h1 className="text-2xl font-semibold mb-4">LangGraph Agent</h1>

      <Card className="flex-1 overflow-hidden">
        <CardContent className="p-4 h-full">
          <ScrollArea className="h-full pr-4">
            <div className="space-y-4">
              {history.map((msg, idx) => (
                <div
                  key={idx}
                  className={
                    msg.role === 'user'
                      ? 'text-right'
                      : 'text-left text-blue-700'
                  }
                >
                  <p className="bg-muted p-2 rounded-xl inline-block max-w-xs">
                    {msg.content}
                  </p>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <div className="flex gap-2 mt-4">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Ask something like: Add 5 and 8"
          disabled={loading}
        />
        <Button onClick={sendMessage} disabled={loading}>
          {loading ? 'Sending...' : 'Send'}
        </Button>
      </div>
    </div>
  );
}
