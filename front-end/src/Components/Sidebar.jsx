import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, FileText, Users, Package, BarChart3, Settings, ChevronLeft, ChevronRight } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/Dashboard', icon: Home },
  { name: 'Invoices', path: '/invoices', icon: FileText },
  { name: 'Clients', path: '/clients', icon: Users },
  { name: 'Products / Services', path: '/products', icon: Package },
  { name: 'Reports', path: '/reports', icon: BarChart3 },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside className={`fixed left-0 top-0 h-screen bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 overflow-hidden z-10 ${isCollapsed ? 'w-16' : 'w-64'}`}>
      <div className={`flex items-center p-4 border-b border-gray-200 dark:border-gray-700 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        {!isCollapsed && <h1 className="text-xl font-bold text-gray-800 dark:text-white">Billing Dashboard</h1>}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
      <nav className="mt-4">
        <ul className="space-y-2 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.path === '/' 
              ? location.pathname === '/' 
              : location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
            return (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`flex items-center p-3 rounded-md transition-colors ${
                    isActive
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  } ${isCollapsed ? 'justify-center' : ''}`}
                  aria-label={item.name}
                >
                  <Icon size={20} className={isCollapsed ? '' : 'mr-3'} />
                  {!isCollapsed && <span>{item.name}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}