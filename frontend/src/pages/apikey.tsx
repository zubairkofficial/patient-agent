import { useEffect, useState } from 'react'
import { Key, PencilIcon } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { AdminDialog } from '@/components/apikey/apikey-dialog'
import adminService from '@/services/adminprofile.service'

interface AdminKey {
  id: number
  openaikey: string
}

export default function AdminProfilePage() {
  const [adminKey, setAdminKey] = useState<AdminKey | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  const fetchAdminKey = async () => {
    setLoading(true)
    const response = await adminService.getOpenAIKey()
    if (response.success) {
      setAdminKey(response.data)
      setError(null)
    } else {
      setAdminKey(null)
      setError(response.message)
    }
    setLoading(false)
  }

  const handleUpdate = async (data: { openaikey: string }) => {
    const response = await adminService.upsertOpenAIKey(data.openaikey)
    if (response.success) {
      fetchAdminKey()
    } else {
      alert(response.message)
    }
  }

  useEffect(() => {
    fetchAdminKey()
  }, [])

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Key className="h-8 w-8" /> Admin API Key
            </h1>
            <p className="text-muted-foreground">Manage OpenAI admin key</p>
          </div>
          {adminKey && (
            <AdminDialog
              mode="edit"
              defaultValue={adminKey.openaikey}
              onSubmit={handleUpdate}
            />
          )}
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <div className="border rounded-lg bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>OpenAI API Key</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={3}>Loading...</TableCell>
                </TableRow>
              ) : adminKey ? (
                <TableRow>
                  <TableCell>{adminKey.id}</TableCell>
                  <TableCell>{adminKey.openaikey}</TableCell>
                  <TableCell>
                    <AdminDialog
                      mode="edit"
                      defaultValue={adminKey.openaikey}
                      onSubmit={handleUpdate}
                      trigger={
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                      }
                    />
                  </TableCell>
                </TableRow>
              ) : (
                <TableRow>
                  <TableCell colSpan={3}>No API key found or access denied</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  )
}
