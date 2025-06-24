// AdminProfilePage.tsx
import { useEffect, useState } from 'react'
import { Key } from 'lucide-react'
import { DashboardLayout } from '@/admin/components/layout/dashboard-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import adminService from '@/services/adminprofile.service'

export default function AdminProfilePage() {
  const [key, setKey] = useState('')
  const [id, setId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchAdminKey = async () => {
    setLoading(true)
    const response = await adminService.getOpenAIKey()
    if (response.success) {
      setKey(response.data.openaikey)
      setId(response.data.id)
      setError(null)
    } else {
      setError(response.message)
      setKey('')
      setId(null)
    }
    setLoading(false)
  }

  const handleSubmit = async () => {
    if (!key.trim()) {
      alert('Please enter a valid OpenAI key')
      return
    }
    const response = await adminService.upsertOpenAIKey(key)
    if (response.success) {
      setSuccess('Key saved successfully!')
      fetchAdminKey()
    } else {
      setError(response.message)
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
            <p className="text-muted-foreground">Set or update the Gemini admin key</p>
          </div>
        </div>

        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-600">{success}</p>}

        <div className="border p-4 rounded-lg bg-white space-y-4">
          <div className="flex items-center gap-2">
            <Input
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="Enter OpenAI API Key"
              className="w-full"
            />
            <Button onClick={handleSubmit}>Submit</Button>
          </div>
          {loading ? (
            <p>Loading...</p>
          ) : id !== null ? (
            <p className="text-sm text-gray-600">Stored Key ID: {id}</p>
          ) : (
            <p className="text-sm text-gray-600">No API key found</p>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
