import React, { useMemo } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../../db/db";
import WeeklyBarChart from "../WeeklyBarChart";
import CategoryBreakdown from "../CategoryBreakdown";
import Card from "../../../components/Card";
import Button from "../../../components/Button";
import { Download, Share2, TrendingDown, TrendingUp, PiggyBank } from "lucide-react";

const CATEGORY_COLORS = [
  "#3B82F6", "#F59E0B", "#10B981", "#8B5CF6", "#EC4899", "#9CA3AF",
];

const ReportsView: React.FC = () => {
  const transactions = useLiveQuery(() => db.transactions.toArray());

  // ── Current month filter ──────────────────────────────────────────────────
  const { currentMonthTxs, lastMonthTxs, currentMonthLabel } = useMemo(() => {
    if (!transactions) return { currentMonthTxs: [], lastMonthTxs: [], currentMonthLabel: "" };

    const now = new Date();
    const curM = now.getMonth();
    const curY = now.getFullYear();
    const lastM = curM === 0 ? 11 : curM - 1;
    const lastY = curM === 0 ? curY - 1 : curY;

    const label = now.toLocaleDateString("en-US", { month: "long", year: "numeric" });

    return {
      currentMonthTxs: transactions.filter((t) => {
        const d = new Date(t.date);
        return d.getMonth() === curM && d.getFullYear() === curY;
      }),
      lastMonthTxs: transactions.filter((t) => {
        const d = new Date(t.date);
        return d.getMonth() === lastM && d.getFullYear() === lastY;
      }),
      currentMonthLabel: label,
    };
  }, [transactions]);

  // ── Monthly summary stats ─────────────────────────────────────────────────
  const summaryStats = useMemo(() => {
    const expense = currentMonthTxs
      .filter((t) => t.type === "expense")
      .reduce((s, t) => s + t.amount, 0);
    const income = currentMonthTxs
      .filter((t) => t.type === "income")
      .reduce((s, t) => s + t.amount, 0);
    const lastExpense = lastMonthTxs
      .filter((t) => t.type === "expense")
      .reduce((s, t) => s + t.amount, 0);
    const lastIncome = lastMonthTxs
      .filter((t) => t.type === "income")
      .reduce((s, t) => s + t.amount, 0);

    const savings = income - expense;
    const lastSavings = lastIncome - lastExpense;
    const savingsRate = income > 0 ? ((savings / income) * 100).toFixed(1) : "0.0";
    const lastRate = lastIncome > 0 ? ((lastSavings / lastIncome) * 100).toFixed(1) : "0.0";

    const pct = (cur: number, last: number) =>
      last === 0 ? 0 : parseFloat((((cur - last) / last) * 100).toFixed(1));

    return {
      expense,
      savings,
      savingsRate,
      expenseChange: pct(expense, lastExpense),
      savingsChange: pct(savings, lastSavings),
      savingsRateChange: parseFloat(savingsRate) - parseFloat(lastRate),
    };
  }, [currentMonthTxs, lastMonthTxs]);

  // ── Weekly breakdown ──────────────────────────────────────────────────────
  const weeklySpendingData = useMemo(() => {
    const weeks = [
      { week: "Week 1", expense: 0 },
      { week: "Week 2", expense: 0 },
      { week: "Week 3", expense: 0 },
      { week: "Week 4", expense: 0 },
    ];
    currentMonthTxs
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        const day = new Date(t.date).getDate();
        const idx = Math.min(Math.floor((day - 1) / 7), 3);
        weeks[idx].expense += t.amount;
      });
    return weeks;
  }, [currentMonthTxs]);

  // ── Category spending (current + last month for real trends) ────────────
  const categorySpendingData = useMemo(() => {
    const cats: Record<string, number> = {};
    currentMonthTxs.filter((t) => t.type === "expense").forEach((t) => {
      cats[t.category] = (cats[t.category] ?? 0) + t.amount;
    });

    const lastCats: Record<string, number> = {};
    lastMonthTxs.filter((t) => t.type === "expense").forEach((t) => {
      lastCats[t.category] = (lastCats[t.category] ?? 0) + t.amount;
    });

    return Object.entries(cats).map(([name, value], i) => ({
      name,
      value,
      color: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
      prevValue: lastCats[name], // undefined if category didn't exist last month
    }));
  }, [currentMonthTxs, lastMonthTxs]);

  // ── Loading state ─────────────────────────────────────────────────────────
  if (!transactions) {
    return (
      <div className="flex flex-col gap-6 opacity-50 animate-pulse">
        <div className="h-10 bg-gray-200 rounded-lg w-64" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => <div key={i} className="h-32 bg-gray-200 rounded-xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80 bg-gray-200 rounded-xl" />
          <div className="h-80 bg-gray-200 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-text-primary m-0">{currentMonthLabel} Report</h2>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" icon={<Share2 size={16} />}>Share</Button>
          <Button variant="primary" size="sm" icon={<Download size={16} />}>Download PDF</Button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card padding="md" className="flex flex-col gap-4">
          <div className="flex items-center gap-3 text-text-muted font-medium text-sm">
            <TrendingDown size={18} className="text-danger" />
            Total Expenses
          </div>
          <h3 className="text-3xl font-bold text-text-primary m-0">
            {summaryStats.expense.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h3>
          <p className={`text-sm font-medium ${summaryStats.expenseChange <= 0 ? "text-success" : "text-danger"}`}>
            {summaryStats.expenseChange > 0 ? "+" : ""}{summaryStats.expenseChange}% from last month
          </p>
        </Card>

        <Card padding="md" className="flex flex-col gap-4">
          <div className="flex items-center gap-3 text-text-muted font-medium text-sm">
            <TrendingUp size={18} className="text-success" />
            Net Savings
          </div>
          <h3 className="text-3xl font-bold text-text-primary m-0">
            {summaryStats.savings.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h3>
          <p className={`text-sm font-medium ${summaryStats.savingsChange >= 0 ? "text-success" : "text-danger"}`}>
            {summaryStats.savingsChange > 0 ? "+" : ""}{summaryStats.savingsChange}% from last month
          </p>
        </Card>

        <Card padding="md" className="flex flex-col gap-4">
          <div className="flex items-center gap-3 text-text-muted font-medium text-sm">
            <PiggyBank size={18} className="text-primary" />
            Savings Rate
          </div>
          <h3 className="text-3xl font-bold text-text-primary m-0">{summaryStats.savingsRate}%</h3>
          <p className={`text-sm font-medium ${summaryStats.savingsRateChange >= 0 ? "text-success" : "text-danger"}`}>
            {summaryStats.savingsRateChange >= 0 ? "+" : ""}{summaryStats.savingsRateChange.toFixed(1)}% from last month
          </p>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WeeklyBarChart data={weeklySpendingData} />
        <CategoryBreakdown data={categorySpendingData} />
      </div>
    </div>
  );
};

export default ReportsView;
