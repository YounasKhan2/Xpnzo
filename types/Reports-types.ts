export interface WeeklyDataPoint {
  week: string;
  expense: number;
}

export interface ReportSummaryStats {
  totalExpenses: number;
  netSavings: number;
  savingsRate: number;
}
