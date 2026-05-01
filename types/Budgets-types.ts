import type {  Budget  } from '../global-types';

export interface BudgetSummaryStats {
  totalLimit: number;
  totalSpent: number;
  remaining: number;
}
