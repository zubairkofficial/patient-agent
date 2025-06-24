import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Home, User, Settings, LogOut, Menu } from 'lucide-react';
import { useState } from 'react';
import { cn } from "@/lib/utils";

const navItems = [
  { label: 'Home', icon: Home, to: '/user/home' },
  // { label: 'Profile', icon: User, to: '/user/profile' },
  {
    label: 'Sign Out',
    icon: LogOut,
    to: '/',
    action: 'logout',
  },
];

export default function UserLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNavClick = (item: any) => {
    setSidebarOpen(false);
    navigate(item.to);
    if (item.action === 'logout') {
      localStorage.clear();
      navigate(item.to);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside
        className={cn(
          "fixed z-40 md:static md:translate-x-0 top-0 left-0 h-full w-64 bg-white border-r flex flex-col justify-between transition-transform duration-200",
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div>
          <div className="flex items-center gap-2 px-6 py-6 border-b">
            <div className="bg-blue-100 rounded-full p-2">
              <Home className="text-blue-600" />
            </div>
            <div>
              <div className="font-bold text-lg">Patient Agent</div>
              <div className="text-xs text-gray-500">Your Wellness Companion</div>
            </div>
          </div>

          <nav className="mt-6 flex flex-col gap-1 px-2">
            {navItems.map(({ label, icon: Icon, to, action }) => (
              <button
                key={label}
                className={cn(
                  "flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50 transition text-left",
                  location.pathname === to && action !== 'logout' && "bg-blue-100 text-blue-700 font-semibold"
                )}
                onClick={() => handleNavClick({ to, action })}
              >
                <Icon size={20} />
                {label}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      <button
        className="fixed top-4 left-4 z-50 md:hidden bg-white border rounded-full p-2 shadow"
        onClick={() => setSidebarOpen((v) => !v)}
        aria-label="Open sidebar"
      >
        <Menu size={24} />
      </button>

      <main className="flex-1 p-4 md:p-6 w-screen transition-all">
        <Outlet />
      </main>
    </div>
  );
}
