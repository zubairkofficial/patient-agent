import { useEffect, useState } from "react";
import sectionService from "@/services/section.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Search, Brain } from "lucide-react";
import { useNavigate } from "react-router-dom";

// const recentActivity = [
//   { title: "Anxiety Management", completed: 3, total: 12, date: "Today" },
//   { title: "Mindfulness Practice", completed: 8, total: 8, date: "Yesterday" },
//   { title: "Sleep Hygiene", completed: 5, total: 10, date: "2 days ago" },
// ];

export default function Home() {
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSections = async () => {
      setLoading(true);
      const res = await sectionService.getAllSections();
      if (res.success) {
        setSections(res.data);
      } else {
        console.error("Failed to load sections:", res.message);
      }
      setLoading(false);
    };
    fetchSections();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="text-2xl font-bold">Your Wellness Journey</div>
          <div className="text-gray-500">
            Continue your path to better mental health with personalized therapeutic exercises
          </div>
        </div>
        {/* Stats */}
        <div className="flex gap-4">
          <div className="bg-blue-50 rounded-xl p-4 flex flex-col items-center">
            <div className="text-xs text-blue-600 font-semibold">Total Progress</div>
            <div className="text-2xl font-bold">68%</div>
            <div className="text-xs text-gray-400">26 of 38 completed</div>
            <Progress value={68} className="mt-2 h-2 bg-blue-100" />
          </div>
          <div className="bg-green-50 rounded-xl p-4 flex flex-col items-center">
            <div className="text-xs text-green-600 font-semibold">Current Streak</div>
            <div className="text-2xl font-bold">7 days</div>
            <div className="text-xs text-gray-400">Keep it up!</div>
          </div>
          <div className="bg-purple-50 rounded-xl p-4 flex flex-col items-center">
            <div className="text-xs text-purple-600 font-semibold">Time Invested</div>
            <div className="text-2xl font-bold">2.5h</div>
            <div className="text-xs text-gray-400">This week</div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search wellness sections..."
            className="w-full rounded-lg border px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      {/* Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section) => (
          <Card key={section.id} className="border-t-4 border-blue-500">
            <CardHeader className="flex flex-row items-center gap-3 pb-2">
              <Brain className="text-blue-500" size={28} />
              <div>
                <CardTitle className="text-lg">{section.title}</CardTitle>
                <div className="flex flex-wrap gap-2 mt-2">
                  {section.skillList?.map((skill: any) => (
                    <span
                      key={skill.id}
                      className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full"
                    >
                      {skill.title}
                    </span>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-gray-600 mb-2">{section.description || section.desc}</div>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>{section.exercises || 0} exercises</span>
                <span>•</span>
                <span>{section.time || "5-10 min"}</span>
                <span>•</span>
                <span>{section.level || "Beginner"}</span>
              </div>
              <button
                onClick={() => navigate(`/user/section/${section.id}`)}
                className="mt-4 w-full bg-black text-white py-2 rounded-lg font-semibold hover:bg-gray-900 transition"
              >
                Start Session
              </button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Activity
      <div className="mt-8">
        <div className="text-xl font-bold mb-4">Recent Activity</div>
        <div className="space-y-3">
          {recentActivity.map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-lg p-4 flex items-center justify-between shadow-sm"
            >
              <div>
                <div className="font-semibold">{item.title}</div>
                <div className="text-xs text-gray-400">
                  {item.completed} of {item.total} completed
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Progress
                  value={Math.round((item.completed / item.total) * 100)}
                  className="w-32 h-2 bg-gray-100"
                />
                <span className="text-xs text-gray-400">{item.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
}
