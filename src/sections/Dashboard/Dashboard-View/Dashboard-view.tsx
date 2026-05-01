import React, { useMemo } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../../db/db";
import StatCard from "../StatCard";
import CashFlowChart from "../CashFlowChart";
import RecentTransactions from "../RecentTransactions";
import { Wallet, ArrowDownRight, ArrowUpRight, PiggyBank } from "lucide-react";
import { cashFlowData } from "../../../data/mockData";

const DashboardView: React.FC = () => {
  const transactions = useLiveQuery(() => 
    db.transactions.orderBy('date').reverse().toArray()
  );

  const stats = useMemo(() => {
    if (!transactions) return null;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthlyTransactions = transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const income = monthlyTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = monthlyTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalBalance = transactions.reduce((sum, t) => 
      t.type === 'income' ? sum + t.amount : sum - t.amount, 0
    );

    return {
      totalBalance,
      monthlyIncome: income,
      monthlyExpense: expense,
      monthlySavings: income - expense,
      // For now, keep the changes hardcoded or calculate from last month if needed
      balanceChange: +5.2,
      incomeChange: +12.4,
      expenseChange: -3.1,
      savingsChange: +8.7,
    };
  }, [transactions]);

  if (!transactions || !stats) {
    return (
      <div className="flex flex-col gap-8 opacity-50 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Balance"
          amount={stats.totalBalance}
          change={stats.balanceChange}
          icon={<Wallet size={24} />}
          iconColorClass="text-primary"
          iconBgClass="bg-primary-light"
        />
        <StatCard
          title="Monthly Income"
          amount={stats.monthlyIncome}
          change={stats.incomeChange}
          icon={<ArrowDownRight size={24} />}
          iconColorClass="text-success"
          iconBgClass="bg-success-light"
        />
        <StatCard
          title="Monthly Expense"
          amount={stats.monthlyExpense}
          change={stats.expenseChange}
          icon={<ArrowUpRight size={24} />}
          iconColorClass="text-danger"
          iconBgClass="bg-danger-light"
        />
        <StatCard
          title="Total Savings"
          amount={stats.monthlySavings}
          change={stats.savingsChange}
          icon={<PiggyBank size={24} />}
          iconColorClass="text-info"
          iconBgClass="bg-info-light"
        />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CashFlowChart data={cashFlowData} />
        </div>
        <div className="lg:col-span-1">
          <RecentTransactions transactions={transactions} />
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
