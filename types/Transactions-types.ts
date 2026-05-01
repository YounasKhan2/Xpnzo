import type {  Transaction  } from '../global-types';

export interface TransactionFilters {
  search: string;
  category: string;
  status: string;
  dateRange: string;
}
