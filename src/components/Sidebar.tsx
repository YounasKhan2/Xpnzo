import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ArrowLeftRight,
  PiggyBank,
  BarChart2,
  RefreshCcw,
  FileText,
  Bell,
  Shield,
  Settings,
  HelpCircle,
  LogOut,
  Wallet,
  X,
} from "lucide-react";

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const mainNav: NavItem[] = [
  { label: "Dashboard",    path: "/",              icon: <LayoutDashboard size={18} /> },
  { label: "Transactions", path: "/transactions",  icon: <ArrowLeftRight size={18} /> },
  { label: "Budgets",      path: "/budgets",       icon: <PiggyBank size={18} /> },
  { label: "Analytics",    path: "/analytics",     icon: <BarChart2 size={18} /> },
  { label: "Recurring",    path: "/recurring",     icon: <RefreshCcw size={18} /> },
  { label: "Reports",      path: "/reports",       icon: <FileText size={18} /> },
];

const accountNav: NavItem[] = [
  { label: "Notifications", path: "/notifications", icon: <Bell size={18} /> },
  { label: "Security",      path: "/security",      icon: <Shield size={18} /> },
  { label: "Settings",      path: "/settings",      icon: <Settings size={18} /> },
  { label: "Support",       path: "/support",       icon: <HelpCircle size={18} /> },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen = false, onClose }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onClose?.();
    navigate("/login");
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-md text-base font-medium transition-all duration-150 cursor-pointer ${
      isActive
        ? "bg-sidebar-active text-white [&>span]:text-primary"
        : "text-sidebar-text hover:bg-sidebar-hover hover:text-white"
    }`;

  return (
    <>
      {/* Sidebar panel */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-50 w-[var(--spacing-sidebar-width)] bg-sidebar flex flex-col py-5 flex-shrink-0 overflow-y-auto
          transition-transform duration-300 ease-in-out
          lg:relative lg:translate-x-0 lg:z-auto lg:h-screen lg:sticky lg:top-0
          ${isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}
        `}
      >
        {/* Logo + Mobile close button */}
        <div className="flex items-center justify-between px-5 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary rounded-md flex items-center justify-center flex-shrink-0">
              <Wallet size={20} color="#fff" />
            </div>
            <span className="font-heading text-2xl font-extrabold text-white tracking-tight">
              Xpnzo
            </span>
          </div>
          {/* Close button — mobile only */}
          <button
            className="lg:hidden w-8 h-8 flex items-center justify-center rounded-md text-sidebar-text hover:text-white hover:bg-sidebar-hover transition-colors"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Main Navigation */}
        <nav className="px-3 flex-1">
          <p className="text-xs font-bold text-sidebar-text uppercase tracking-widest px-3 mb-2">
            Main Menu
          </p>
          <ul className="flex flex-col gap-0.5">
            {mainNav.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === "/"}
                  className={navLinkClass}
                  onClick={onClose}
                >
                  <span className="flex items-center flex-shrink-0 transition-colors duration-150">
                    {item.icon}
                  </span>
                  <span className="font-body">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Account Navigation */}
        <nav className="px-3 flex-none border-t border-white/5 pt-4 mt-4">
          <p className="text-xs font-bold text-sidebar-text uppercase tracking-widest px-3 mb-2">
            Account
          </p>
          <ul className="flex flex-col gap-0.5">
            {accountNav.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={navLinkClass}
                  onClick={onClose}
                >
                  <span className="flex items-center flex-shrink-0 transition-colors duration-150">
                    {item.icon}
                  </span>
                  <span className="font-body">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-4 px-3 border-t border-white/5 mt-auto">
          <button
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sidebar-text bg-transparent border-none w-full text-base font-medium cursor-pointer font-body transition-all duration-150 hover:bg-danger/15 hover:text-red-300"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
