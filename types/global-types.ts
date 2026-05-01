export type TransactionCategory =
  | 'Food & Dining'
  | 'Shopping'
  | 'Transportation'
  | 'Entertainment'
  | 'Health & Fitness'
  | 'Utilities'
  | 'Groceries'
  | 'Housing'
  | 'Travel'
  | 'Education'
  | 'Income'
  | 'Other';

export type TransactionType = 'income' | 'expense';
export type TransactionStatus = 'completed' | 'pending' | 'failed';
export type RecurringFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly';
export type BudgetStatus = 'on-track' | 'warning' | 'over-budget';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  currency: string;
}

export interface Transaction {
  id?: string;
  localId?: number;
  name: string;
  category: TransactionCategory | string;
  type: TransactionType;
  amount: number;
  date: string;
  status: TransactionStatus;
  icon?: string;
  account?: string;
  notes?: string;
}

export interface Budget {
  id?: string;
  localId?: number;
  category: TransactionCategory | string;
  limit: number;
  spent: number;
  color: string;
  icon: string;
  status: BudgetStatus;
}

export interface RecurringTransaction {
  id?: string;
  localId?: number;
  name: string;
  amount: number;
  frequency: RecurringFrequency;
  nextDate: string;
  category: TransactionCategory | string;
  isActive: boolean;
  icon?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'alert' | 'info' | 'system' | 'success';
  isRead: boolean;
  time: string;
  date: string;
}

export interface LoginActivity {
  id: string;
  device: string;
  location: string;
  ip: string;
  date: string;
  isCurrent: boolean;
}
