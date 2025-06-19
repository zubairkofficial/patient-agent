import { Brain, Smile, Layers, MessageSquare } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { StatsCard } from '@/components/dashboard/stats-card'
import { ActivityList } from '@/components/dashboard/activity-list'
import { SystemOverview } from '@/components/dashboard/system-overview'

export default function DashboardPage() {
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
            value="24"
            description="+2 this week"
            icon={Brain}
            iconClassName="text-blue-600"
          />
          <StatsCard
            title="Emotions"
            value="18"
            description="+1 this week"
            icon={Smile}
            iconClassName="text-green-600"
          />
          <StatsCard
            title="Sections"
            value="12"
            description="No change"
            icon={Layers}
            iconClassName="text-purple-600"
          />
          <StatsCard
            title="Statements"
            value="156"
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
