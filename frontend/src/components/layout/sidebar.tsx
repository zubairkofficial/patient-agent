import { Link, useLocation, useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { LayoutGrid, Brain, Smile, Layers, MessageSquare, LogOut , Key } from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
  { name: 'Skills', href: '/skills', icon: Brain },
  { name: 'Emotions', href: '/emotions', icon: Smile },
  { name: 'Sections', href: '/sections', icon: Layers },
  { name: 'Statements', href: '/statements', icon: MessageSquare },
  { name: 'Key', href: '/apikey', icon: Key },
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token') // ✅ Clear token
    navigate('/login')               // ✅ Redirect to login
  }

  return (
    <div className={cn('flex flex-col h-screen border-r bg-white', className)}>
      <div className="p-6">
        <Link to="/dashboard" className="flex items-center gap-2">
          <img src="/logo.svg" alt="Patient Agent" className="h-8 w-8" />
          <div className="flex flex-col">
            <span className="text-xl font-bold">Patient Agent</span>
            <span className="text-sm text-muted-foreground">Admin Dashboard</span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname.startsWith(item.href)
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary hover:bg-primary/15'
                  : 'text-gray-700 hover:bg-gray-100'
              )}
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">Admin User</p>
            <p className="text-xs text-muted-foreground truncate">
              admin@patientagent.com
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 mt-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100"
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </button>
      </div>
    </div>
  )
}
