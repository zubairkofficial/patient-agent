import { Activity } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useEffect, useState } from 'react'
import sectionService from '@/services/section.service'
import statementService from '@/services/statement.service'
import emotionService from '@/services/emotions.service'
import skillsService from '@/services/skills.service'

interface ActivityItem {
  type: string
  name: string
  time: string
}

const activities: ActivityItem[] = [
  {
    type: 'Created new skill',
    name: 'Anxiety Management',
    time: '2 hours ago',
  },
  {
    type: 'Updated emotion',
    name: 'Stress',
    time: '4 hours ago',
  },
  {
    type: 'Added statement',
    name: 'Breathing Exercise Guide',
    time: '6 hours ago',
  },
  {
    type: 'Created section',
    name: 'Coping Strategies',
    time: '1 day ago',
  },
  {
    type: 'Updated skill',
    name: 'Mindfulness',
    time: '2 days ago',
  },
]

export function ActivityList() {
  const [sectionCount, setSectionCount] = useState<number | null>(null)
  const [statementCount, setStatementCount] = useState<number | null>(null)
  const [emotionCount, setEmotionCount] = useState<number | null>(null)
  const [skillCount, setSkillCount] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Fetch all counts in parallel
    Promise.all([
      sectionService.getAllSections(),
      statementService.getAllStatements(),
      emotionService.getAllEmotions(),
      skillsService.getAllSkills(),
    ]).then(([sections, statements, emotions, skills]) => {
      if (!sections.success) setError('Failed to fetch sections')
      if (!statements.success) setError('Failed to fetch statements')
      if (!emotions.success) setError('Failed to fetch emotions')
      if (!skills.success) setError('Failed to fetch skills')
      setSectionCount(sections.success ? sections.data.length : 0)
      setStatementCount(statements.success ? statements.data.length : 0)
      setEmotionCount(emotions.success ? emotions.data.length : 0)
      setSkillCount(skills.success ? skills.data.length : 0)
    })
  }, [])

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          <CardTitle>Recent Activity</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground">
          Latest changes to your content
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <div className="text-xs text-blue-700 font-semibold">Total Sections</div>
            <div className="text-2xl font-bold">
              {sectionCount !== null ? sectionCount : '...'}
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <div className="text-xs text-green-700 font-semibold">Total Statements</div>
            <div className="text-2xl font-bold">
              {statementCount !== null ? statementCount : '...'}
            </div>
          </div>
          <div className="bg-purple-50 rounded-lg p-3 text-center">
            <div className="text-xs text-purple-700 font-semibold">Total Emotions</div>
            <div className="text-2xl font-bold">
              {emotionCount !== null ? emotionCount : '...'}
            </div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-3 text-center">
            <div className="text-xs text-yellow-700 font-semibold">Total Skills</div>
            <div className="text-2xl font-bold">
              {skillCount !== null ? skillCount : '...'}
            </div>
          </div>
        </div>
        {error && (
          <div className="text-red-500 text-sm mb-2">{error}</div>
        )}
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="rounded-full p-2 bg-primary/10">
                <Activity className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">{activity.type}</p>
                <p className="text-sm text-muted-foreground">
                  {activity.name}
                </p>
              </div>
              <p className="text-sm text-muted-foreground">{activity.time}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
