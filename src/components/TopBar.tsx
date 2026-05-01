import React, { useState, useRef, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Search, Bell, Menu, ChevronRight, LogOut, Settings, User } from 'lucide-react';
import { useAuth } from '../lib/useAuth';

// ── Page metadata ─────────────────────────────────────────────────────────────
const pageMeta: Record<string, { title: string; subtitle: string; breadcrumbs?: string[] }> = {
  '/':              { title: 'Dashboard',          subtitle: 'Welcome back 👋',                    breadcrumbs: ['Home'] },
  '/transactions':  { title: 'Transactions',        subtitle: 'Track every dollar you spend',       breadcrumbs: ['Home', 'Transactions'] },
  '/budgets':       { title: 'Budgets',             subtitle: 'Stay on top of your spending goals', breadcrumbs: ['Home', 'Budgets'] },
  '/analytics':     { title: 'Analytics',           subtitle: 'Insights into your financial health',breadcrumbs: ['Home', 'Analytics'] },
  '/recurring':     { title: 'Recurring',           subtitle: 'Manage your subscriptions & bills',  breadcrumbs: ['Home', 'Recurring'] },
  '/reports':       { title: 'Reports',             subtitle: 'Monthly summary and breakdown',       breadcrumbs: ['Home', 'Reports'] },
  '/notifications': { title: 'Notifications',       subtitle: 'Your alerts and updates',            breadcrumbs: ['Home', 'Notifications'] },
  '/security':      { title: 'Security & Privacy',  subtitle: 'Manage your account security',       breadcrumbs: ['Home', 'Security'] },
  '/settings':      { title: 'Account Settings',    subtitle: 'Customize your Xpnzo experience',   breadcrumbs: ['Home', 'Settings'] },
  '/support':       { title: 'Support Center',      subtitle: "We're here to help you",            breadcrumbs: ['Home', 'Support'] },
};

interface TopBarProps {
  onMenuClick?: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onMenuClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const page = pageMeta[location.pathname] ?? { title: 'Xpnzo', subtitle: '', breadcrumbs: ['Home'] };
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Compute initials from user name
  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
    navigate('/login');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="bg-card border-b border-border sticky top-0 z-30">
      {/* Main bar */}
      <div className="flex items-center justify-between px-4 md:px-6 lg:px-8 h-[var(--spacing-topbar-height)] gap-3">
        {/* Left: hamburger + title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            className="lg:hidden w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-md text-text-secondary hover:bg-bg transition-colors"
            onClick={onMenuClick}
            aria-label="Open navigation menu"
          >
            <Menu size={22} />
          </button>
          <div className="min-w-0">
            <h1 className="font-heading text-lg md:text-2xl font-bold text-text-primary m-0 leading-tight truncate">
              {page.title}
            </h1>
            <p className="hidden md:block text-sm text-text-muted mb-0 mt-0.5 leading-none">
              {page.subtitle}
            </p>
          </div>
        </div>

        {/* Right: search + bell + avatar */}
        <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
          {/* Search */}
          <div className="relative hidden sm:flex items-center">
            <Search size={15} className="absolute left-3 text-text-muted pointer-events-none" />
            <input
              type="text"
              placeholder="Search..."
              className="py-2 pr-4 pl-8 border-[1.5px] border-border rounded-full bg-bg text-sm font-body text-text-primary w-[150px] md:w-[200px] outline-none transition-all duration-150 focus:border-primary focus:ring-[3px] focus:ring-primary/10 focus:w-[190px] md:focus:w-[250px] placeholder:text-text-muted"
            />
          </div>

          {/* Bell */}
          <Link
            to="/notifications"
            className="relative w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-md bg-bg border-[1.5px] border-border text-text-secondary transition-all duration-150 hover:bg-primary-light hover:text-primary hover:border-primary"
            aria-label="Notifications"
          >
            <Bell size={18} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full border-2 border-card" />
          </Link>

          {/* Avatar + Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((o) => !o)}
              className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold cursor-pointer transition-transform duration-150 hover:scale-105 font-heading flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label="User menu"
            >
              {initials}
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                {/* User info header */}
                <div className="px-4 py-3 border-b border-border">
                  <p className="text-sm font-semibold text-text-primary truncate">{user?.name ?? 'User'}</p>
                  <p className="text-xs text-text-muted truncate">{user?.email}</p>
                </div>

                {/* Menu items */}
                <div className="py-1">
                  <Link
                    to="/settings"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:bg-bg hover:text-text-primary transition-colors"
                  >
                    <User size={15} />
                    Profile Settings
                  </Link>
                  <Link
                    to="/security"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:bg-bg hover:text-text-primary transition-colors"
                  >
                    <Settings size={15} />
                    Security
                  </Link>
                </div>

                {/* Logout */}
                <div className="border-t border-border py-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-danger hover:bg-danger/5 transition-colors"
                  >
                    <LogOut size={15} />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Breadcrumb bar */}
      {page.breadcrumbs && page.breadcrumbs.length > 1 && (
        <div className="px-4 md:px-6 lg:px-8 py-2 flex items-center gap-1.5 border-t border-border/50 bg-bg/50 overflow-x-auto">
          {page.breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={crumb}>
              {idx > 0 && <ChevronRight size={13} className="text-text-muted flex-shrink-0" />}
              {idx === page.breadcrumbs!.length - 1 ? (
                <span className="text-xs font-semibold text-primary whitespace-nowrap">{crumb}</span>
              ) : (
                <Link to="/" className="text-xs text-text-muted hover:text-text-primary transition-colors whitespace-nowrap">
                  {crumb}
                </Link>
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </header>
  );
};

export default TopBar;

