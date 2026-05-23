import { Link, useNavigate } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-surface border-b border-border shadow---shadow-sm) sticky top-0 z-100">
      <div className="max-w-300 mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2">
          <span className="text-2xl">✈️</span>
          <span className="text-xl font-bold text-primary-dark">Itiniq</span>
        </Link>

        {/* Nav links + user */}
        <div className="flex items-center gap-6">
          <Link
            to="/dashboard"
            className="text-text-muted font-medium text-sm transition-colors duration-200 hover:text-primary"
          >
            Dashboard
          </Link>
          <Link
            to="/upload"
            className="text-text-muted font-medium text-sm transition-colors duration-200 hover:text-primary"
          >
            Upload
          </Link>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-[13px]">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <span className="text-sm font-medium text-text-primary">
              {user?.name}
            </span>
            <button
              onClick={handleLogout}
              className="text-[13px] text-text-muted px-3 py-1.5 rounded-sm border border-border bg-transparent cursor-pointer transition-all duration-200 font-(--font-body) hover:bg-surface-2 hover:text-primary"
            >
              Logout
            </button>
          </div>
        </div>

      </div>
    </nav>
  );
}