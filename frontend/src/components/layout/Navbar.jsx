import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Plane, LayoutDashboard, Upload, LogOut, Menu, X } from 'lucide-react';
import useAuth from '@/hooks/useAuth';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/upload', label: 'Upload', icon: Upload },
  ];

  return (
    <>
      <nav className="bg-surface border-b border-border shadow-sm sticky top-0 z-50">
        <div className="max-w-300 mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

          <Link to="/dashboard" className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center"><Plane size={20} className="text-white" /></div>
            <span className="text-2xl font-bold text-primary-dark tracking-tight">Itiniq</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link key={to} to={to} className={`flex items-center gap-2 px-4 py-2 rounded-sm text-sm font-medium transition-colors duration-200 ${
                  isActive(to)
                    ? 'text-primary bg-surface-2'
                    : 'text-text-muted hover:text-primary hover:bg-surface-2'
                }`}
              >
                <Icon size={15} />
                {label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-base shrink-0">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <span className="text-sm font-medium text-text-primary max-w-30 truncate">
              {user?.name}
            </span>
            <button onClick={handleLogout} className="flex items-center gap-1.5 text-[13px] text-text-muted px-3 py-1.5 rounded-sm border border-border bg-transparent cursor-pointer transition-all duration-200  hover:bg-surface-2 hover:text-primary">
              <LogOut size={13} />
              Logout
            </button>
          </div>

          <div className="flex md:hidden items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-[13px] shrink-0">{user?.name?.[0]?.toUpperCase()}</div>
            <button onClick={() => setMenuOpen((v) => !v)} className="w-9 h-9 rounded-sm flex items-center justify-center text-text-muted bg-transparent border border-border cursor-pointer hover:bg-surface-2 transition-colors duration-200" aria-label="Toggle menu">
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>

        </div>
      </nav>

      {menuOpen && (
        <div className="md:hidden sticky top-16 z-40 bg-surface border-b border-border shadow-md animate-fade-in">
          <div className="max-w-300 mx-auto px-4 py-3 flex flex-col gap-1">

            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link key={to} to={to} onClick={() => setMenuOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-medium transition-colors duration-200 ${
                  isActive(to)
                    ? 'text-primary bg-surface-2'
                    : 'text-text-muted hover:text-primary hover:bg-surface-2'
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}

            <div className="border-t border-border mt-1 pt-3 pb-1 flex items-center justify-between px-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-[13px]">{user?.name?.[0]?.toUpperCase()}
                </div>
                <span className="text-sm font-medium text-text-primary max-w-40 truncate">{user?.name}
                </span>
              </div>
              <button onClick={handleLogout} className="flex items-center gap-1.5 text-[13px] text-text-muted px-3 py-1.5 rounded-sm border border-border bg-transparent cursor-pointer transition-all duration-200  hover:bg-surface-2 hover:text-primary">
                <LogOut size={13} />
                Logout
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}