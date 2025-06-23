import { Users, Activity, Database } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function SystemOverview() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          <CardTitle>System Overview</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground">
          Platform health and usage
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="rounded-full p-2 bg-green-100">
            <Users className="h-4 w-4 text-green-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Active Users</p>
            <p className="text-2xl font-bold">1,247</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="rounded-full p-2 bg-blue-100">
            <Activity className="h-4 w-4 text-blue-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">System Status</p>
            <p className="text-sm font-medium text-green-600">Healthy</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="rounded-full p-2 bg-purple-100">
            <Database className="h-4 w-4 text-purple-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">AI Processing</p>
            <p className="text-sm font-medium text-green-600">Online</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
