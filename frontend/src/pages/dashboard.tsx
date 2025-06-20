import { useEffect, useState } from 'react'
import { Brain, Smile, Layers, MessageSquare } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { StatsCard } from '@/components/dashboard/stats-card'
import { ActivityList } from '@/components/dashboard/activity-list'
import { SystemOverview } from '@/components/dashboard/system-overview'
import skillsService from '@/services/skills.service'
import emotionService from '@/services/emotions.service'
import sectionService from '@/services/section.service'
import statementService from '@/services/statement.service'

export default function DashboardPage() {
  const [counts, setCounts] = useState({
    skills: 0,
    emotions: 0,
    sections: 0,
    statements: 0,
  })

  const fetchCounts = async () => {
    try {
      const [skillsRes, emotionsRes, sectionsRes, statementsRes] = await Promise.all([
        skillsService.getAllSkills(),
        emotionService.getAllEmotions(),
        sectionService.getAllSections(),
        statementService.getAllStatements(),
      ])

      setCounts({
        skills: skillsRes.success ? skillsRes.data.length : 0,
        emotions: emotionsRes.success ? emotionsRes.data.length : 0,
        sections: sectionsRes.success ? sectionsRes.data.length : 0,
        statements: statementsRes.success ? statementsRes.data.length : 0,
      })
    } catch (error) {
      console.error('Failed to fetch dashboard counts', error)
    }
  }

  useEffect(() => {
    fetchCounts()
  }, [])

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to the Patient Agent admin dashboard
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Skills"
            value={counts.skills.toString()}
            description="+2 this week"
            icon={Brain}
            iconClassName="text-blue-600"
          />
          <StatsCard
            title="Emotions"
            value={counts.emotions.toString()}
            description="+1 this week"
            icon={Smile}
            iconClassName="text-green-600"
          />
          <StatsCard
            title="Sections"
            value={counts.sections.toString()}
            description="No change"
            icon={Layers}
            iconClassName="text-purple-600"
          />
          <StatsCard
            title="Statements"
            value={counts.statements.toString()}
            description="+12 this week"
            icon={MessageSquare}
            iconClassName="text-orange-600"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <ActivityList />
          <SystemOverview />
        </div>
      </div>
    </DashboardLayout>
  )
}
