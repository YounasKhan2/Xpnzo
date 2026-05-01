import type {
  Transaction,
  Budget,
  RecurringTransaction,
  Notification,
  LoginActivity,
  User,
} from "../../types/global-types";

export const mockUser: User = {
  id: "u1",
  name: "Jonathan Mitchell",
  email: "jonathan.mitchell@email.com",
  currency: "USD",
};

export const mockTransactions: Transaction[] = [
  {
    id: "t1",
    name: "Spotify Premium",
    category: "Entertainment",
    type: "expense",
    amount: 9.99,
    date: "2025-04-30",
    status: "completed",
    account: "Chase Checking",
  },
  {
    id: "t2",
    name: "Salary Deposit",
    category: "Income",
    type: "income",
    amount: 5200.0,
    date: "2025-04-28",
    status: "completed",
    account: "Chase Checking",
  },
  {
    id: "t3",
    name: "Whole Foods Market",
    category: "Groceries",
    type: "expense",
    amount: 124.5,
    date: "2025-04-27",
    status: "completed",
    account: "Amex Gold",
  },
  {
    id: "t4",
    name: "Netflix Subscription",
    category: "Entertainment",
    type: "expense",
    amount: 15.99,
    date: "2025-04-26",
    status: "completed",
    account: "Chase Checking",
  },
  {
    id: "t5",
    name: "Uber Ride",
    category: "Transportation",
    type: "expense",
    amount: 18.5,
    date: "2025-04-25",
    status: "completed",
    account: "Amex Gold",
  },
];

export const mockBudgets: Budget[] = [
  {
    id: "b1",
    category: "Groceries",
    limit: 400,
    spent: 310,
    color: "#5B67CA",
    icon: "🛒",
    status: "on-track",
  },
  {
    id: "b2",
    category: "Food & Dining",
    limit: 300,
    spent: 275,
    color: "#F59E0B",
    icon: "🍽️",
    status: "warning",
  },
  {
    id: "b3",
    category: "Entertainment",
    limit: 150,
    spent: 160,
    color: "#EF4444",
    icon: "🎬",
    status: "over-budget",
  },
];

export const mockRecurring: RecurringTransaction[] = [
  {
    id: "r1",
    name: "Rent",
    amount: 1200.0,
    frequency: "monthly",
    nextDate: "2025-05-01",
    category: "Housing",
    isActive: true,
  },
  {
    id: "r2",
    name: "Netflix",
    amount: 15.99,
    frequency: "monthly",
    nextDate: "2025-05-04",
    category: "Entertainment",
    isActive: true,
  },
];

export const mockNotifications: Notification[] = [
  {
    id: "n1",
    title: "Budget Alert",
    message: "You've exceeded your Entertainment budget by 10.00 this month.",
    type: "alert",
    isRead: false,
    time: "2 hours ago",
    date: "2025-04-30",
  },
  {
    id: "n2",
    title: "Salary Received",
    message:
      "Your monthly salary of 5,200.00 has been credited to Chase Checking.",
    type: "success",
    isRead: false,
    time: "5 hours ago",
    date: "2025-04-28",
  },
];

export const mockLoginActivity: LoginActivity[] = [
  {
    id: "la1",
    device: "Chrome on Windows",
    location: "New York, US",
    ip: "192.168.1.1",
    date: "Apr 30, 2025 – 10:24 AM",
    isCurrent: true,
  },
  {
    id: "la2",
    device: "Safari on iPhone",
    location: "Brooklyn, US",
    ip: "10.0.0.42",
    date: "Apr 28, 2025 – 8:15 PM",
    isCurrent: false,
  },
];

export const cashFlowData = [
  { month: "Nov", income: 4800, expense: 3200 },
  { month: "Dec", income: 5100, expense: 3800 },
  { month: "Jan", income: 4600, expense: 2900 },
  { month: "Feb", income: 5200, expense: 3500 },
  { month: "Mar", income: 4900, expense: 3100 },
  { month: "Apr", income: 6050, expense: 3620 },
];

export const dashboardStats = {
  totalBalance: 24560.8,
  monthlyIncome: 6050.0,
  monthlyExpense: 3620.45,
  monthlySavings: 2429.55,
  balanceChange: +5.2,
  incomeChange: +12.4,
  expenseChange: -3.1,
  savingsChange: +8.7,
};

export const categorySpendingData = [
  { name: "Housing", value: 1200, color: "#3B82F6" },
  { name: "Food & Dining", value: 850, color: "#F59E0B" },
  { name: "Transportation", value: 340, color: "#10B981" },
  { name: "Entertainment", value: 250, color: "#8B5CF6" },
  { name: "Shopping", value: 540, color: "#EC4899" },
  { name: "Others", value: 440.45, color: "#9CA3AF" },
];

export const weeklySpendingData = [
  { week: "Week 1", expense: 850 },
  { week: "Week 2", expense: 720 },
  { week: "Week 3", expense: 950 },
  { week: "Week 4", expense: 1100 },
];
