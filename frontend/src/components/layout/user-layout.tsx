import { Home, User, Settings, LogOut, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

const user = {
  name: 'John Doe',
  level: 'Beginner',
  rating: 3.0,
  avatar: '',
};

const navItems = [
  { label: 'Home', icon: Home, path: '/user/dashboard' },
  { label: 'Profile', icon: User, path: '/profile' },
];

export default function UserLayout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <div className="flex min-h-screen bg-[#f7faff]">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r flex flex-col justify-between min-h-screen">
        <div>
          <div className="px-8 py-6 flex flex-col items-center">
            <div className="rounded-full bg-gray-200 h-16 w-16 mb-2" />
            <div className="font-bold text-lg text-gray-900">{user.name}</div>
            <div className="text-xs text-gray-500 mb-2">Wellness Level: {user.level}</div>
            <div className="flex items-center gap-1 mb-1">
              {[1,2,3,4,5].map(i => <Star key={i} className={`h-4 w-4 ${i <= 3 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />)}
              <span className="text-xs text-gray-500 ml-1">{user.rating}</span>
            </div>
          </div>
          <nav className="px-4 space-y-2">
            {navItems.map((item) => (
              <Button
                key={item.label}
                variant={location.pathname === item.path ? 'secondary' : 'ghost'}
                className={`w-full justify-start gap-2 ${location.pathname === item.path ? 'bg-blue-600 text-white hover:bg-blue-700' : ''}`}
                onClick={() => navigate(item.path)}
              >
                <item.icon className="h-5 w-5" /> {item.label}
              </Button>
            ))}
          </nav>
        </div>
        <div className="px-4 pb-6 space-y-2">
          <Button variant="ghost" className="w-full justify-start gap-2"><Settings className="h-5 w-5" /> Settings</Button>
          <Button variant="ghost" className="w-full justify-start gap-2"><LogOut className="h-5 w-5" /> Sign Out</Button>
        </div>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-10">{children}</main>
    </div>
  );
}
