import { Activity } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

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
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="rounded-full p-2 bg-primary/10">
                <Activity className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">{activity.type}</p>
                <p className="text-sm text-muted-foreground">{activity.name}</p>
              </div>
              <p className="text-sm text-muted-foreground">{activity.time}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
