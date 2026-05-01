import React, { useMemo } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db, type LocalTransaction } from "../../../db/db";
import StatCard from "../StatCard";
import CashFlowChart from "../CashFlowChart";
import RecentTransactions from "../RecentTransactions";
import { Wallet, ArrowDownRight, ArrowUpRight, PiggyBank } from "lucide-react";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const pctChange = (current: number, last: number): number =>
  last === 0 ? 0 : parseFloat((((current - last) / last) * 100).toFixed(1));

// ─── Component ────────────────────────────────────────────────────────────────

const DashboardView: React.FC = () => {
  const transactions = useLiveQuery(() =>
    // NOTE: use .filter() not .where("isDeleted").equals(0) — IndexedDB key
    // comparison is strict-typed: stored boolean `false` !== number `0`.
    db.transactions.filter((t) => !t.isDeleted).sortBy("date")
  );

  const { stats, cashFlowData } = useMemo(() => {
    if (!transactions) return { stats: null, cashFlowData: [] };

    const now = new Date();
    const curM = now.getMonth();
    const curY = now.getFullYear();
    const lastM = curM === 0 ? 11 : curM - 1;
    const lastY = curM === 0 ? curY - 1 : curY;

    const isCurMonth = (t: LocalTransaction) => {
      const d = new Date(t.date);
      return d.getMonth() === curM && d.getFullYear() === curY;
    };
    const isLastMonth = (t: LocalTransaction) => {
      const d = new Date(t.date);
      return d.getMonth() === lastM && d.getFullYear() === lastY;
    };

    const curTxs = transactions.filter(isCurMonth);
    const lastTxs = transactions.filter(isLastMonth);

    const sum = (arr: LocalTransaction[], type: "income" | "expense") =>
      arr.filter((t) => t.type === type).reduce((s, t) => s + t.amount, 0);

    const income = sum(curTxs, "income");
    const expense = sum(curTxs, "expense");
    const lastIncome = sum(lastTxs, "income");
    const lastExpense = sum(lastTxs, "expense");

    const totalBalance = transactions.reduce(
      (s, t) => (t.type === "income" ? s + t.amount : s - t.amount),
      0
    );

    // ── Cash flow (last 6 months) ──
    const monthMap: Record<string, { month: string; income: number; expense: number; order: number }> = {};
    transactions.forEach((t) => {
      const d = new Date(t.date);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (!monthMap[key]) {
        monthMap[key] = {
          month: MONTH_NAMES[d.getMonth()],
          income: 0,
          expense: 0,
          order: d.getFullYear() * 12 + d.getMonth(),
        };
      }
      if (t.type === "income") monthMap[key].income += t.amount;
      else monthMap[key].expense += t.amount;
    });

    const cashFlowData = Object.values(monthMap)
      .sort((a, b) => a.order - b.order)
      .slice(-6);

    return {
      stats: {
        totalBalance,
        monthlyIncome: income,
        monthlyExpense: expense,
        monthlySavings: income - expense,
        balanceChange: pctChange(income - expense, lastIncome - lastExpense),
        incomeChange: pctChange(income, lastIncome),
        expenseChange: pctChange(expense, lastExpense),
        savingsChange: pctChange(income - expense, lastIncome - lastExpense),
      },
      cashFlowData,
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-80 bg-gray-200 rounded-xl" />
          <div className="lg:col-span-1 h-80 bg-gray-200 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Stat Cards */}
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
          title="Net Savings"
          amount={stats.monthlySavings}
          change={stats.savingsChange}
          icon={<PiggyBank size={24} />}
          iconColorClass="text-info"
          iconBgClass="bg-info-light"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CashFlowChart data={cashFlowData} />
        </div>
        <div className="lg:col-span-1">
          <RecentTransactions transactions={transactions.slice().reverse().slice(0, 5)} />
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
