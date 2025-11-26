import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, List, FileText, Send, LogOut, Mail } from 'lucide-react';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/lists', label: 'Listas', icon: List },
    { path: '/templates', label: 'Templates', icon: FileText },
    { path: '/campaigns', label: 'Campanhas', icon: Send },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-purple-800 to-indigo-900 text-white shadow-2xl">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-white bg-opacity-20 p-2 rounded-lg">
              <Mail size={28} />
            </div>
            <div>
              <h1 className="text-lg font-bold">Koch Construtora</h1>
            </div>
          </div>

          <nav className="space-y-2">
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    isActive(item.path)
                      ? 'bg-white bg-opacity-20 text-white'
                      : 'text-purple-100 hover:bg-white hover:bg-opacity-10'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white border-opacity-20">
          <div className="mb-4">
            <p className="text-sm text-purple-200">Logado como</p>
            <p className="font-medium truncate">{user?.email}</p>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 bg-white bg-opacity-10 hover:bg-opacity-20 px-4 py-2 rounded-lg transition"
          >
            <LogOut size={18} />
            Sair
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        {children}
      </div>
    </div>
  );
}

