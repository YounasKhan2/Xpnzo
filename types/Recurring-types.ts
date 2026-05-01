import type {  RecurringTransaction  } from '../global-types';

export interface RecurringSummary {
  totalMonthly: number;
  totalYearly: number;
  activeCount: number;
}
