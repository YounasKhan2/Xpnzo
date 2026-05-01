export interface DashboardStats {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpense: number;
  monthlySavings: number;
  balanceChange: number;
  incomeChange: number;
  expenseChange: number;
  savingsChange: number;
}

export interface ChartDataPoint {
  month: string;
  income: number;
  expense: number;
}
