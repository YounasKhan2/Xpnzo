import React from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Bell } from 'lucide-react';

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  '/':              { title: 'Dashboard',           subtitle: 'Welcome back, Jonathan 👋' },
  '/transactions':  { title: 'Transactions',         subtitle: 'Track every dollar you spend' },
  '/budgets':       { title: 'Budgets',              subtitle: 'Stay on top of your spending goals' },
  '/analytics':     { title: 'Analytics',            subtitle: 'Insights into your financial health' },
  '/recurring':     { title: 'Recurring',            subtitle: 'Manage your subscriptions & bills' },
  '/reports':       { title: 'Financial Reports',    subtitle: 'Monthly summary and breakdown' },
  '/notifications': { title: 'Notifications',        subtitle: 'Your alerts and updates' },
  '/security':      { title: 'Security & Privacy',   subtitle: 'Manage your account security' },
  '/settings':      { title: 'Account Settings',     subtitle: 'Customize your Xpnzo experience' },
  '/support':       { title: 'Support Center',       subtitle: 'We\'re here to help you' },
};

const TopBar: React.FC = () => {
  const location = useLocation();
  const page = pageTitles[location.pathname] || { title: 'Xpnzo', subtitle: '' };

  return (
    <header className="h-[var(--spacing-topbar-height)] bg-card border-b border-border flex items-center justify-between px-8 gap-4 sticky top-0 z-[100]">
      <div className="flex-1">
        <h1 className="font-heading text-2xl font-bold text-text-primary m-0 leading-[1.2]">{page.title}</h1>
        <p className="text-sm text-text-muted mt-0.5 mb-0">{page.subtitle}</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative flex items-center">
          <Search size={16} className="absolute left-3 text-text-muted pointer-events-none" />
          <input
            type="text"
            placeholder="Search transactions..."
            className="py-2 pr-4 pl-9 border-[1.5px] border-border rounded-full bg-bg text-sm font-body text-text-primary w-[220px] outline-none transition-all duration-150 focus:border-primary focus:ring-[3px] focus:ring-primary/10 focus:w-[260px] placeholder:text-text-muted"
          />
        </div>
        <button className="relative w-10 h-10 flex items-center justify-center rounded-md bg-bg border-[1.5px] border-border text-text-secondary cursor-pointer transition-all duration-150 hover:bg-primary-light hover:text-primary hover:border-primary" aria-label="Notifications">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full border-2 border-card" />
        </button>
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold cursor-pointer transition-transform duration-150 hover:scale-105 font-heading" aria-label="User profile">
          <span>JM</span>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
