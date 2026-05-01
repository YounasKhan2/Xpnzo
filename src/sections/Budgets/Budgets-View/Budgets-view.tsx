import React, { useMemo } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../../db/db";
import Button from "../../../components/Button";
import BudgetCard from "../BudgetCard";
import BudgetSummary from "../BudgetSummary";
import { Plus } from "lucide-react";

const BudgetsView: React.FC = () => {
  const budgets = useLiveQuery(() => db.budgets.toArray());
  const transactions = useLiveQuery(() => db.transactions.toArray());

  const enrichedBudgets = useMemo(() => {
    if (!budgets || !transactions) return null;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return budgets.map(budget => {
      const spentThisMonth = transactions
        .filter(t => 
          t.category === budget.category && 
          t.type === 'expense' &&
          new Date(t.date).getMonth() === currentMonth &&
          new Date(t.date).getFullYear() === currentYear
        )
        .reduce((sum, t) => sum + t.amount, 0);

      const percentage = (spentThisMonth / budget.limit) * 100;
      let status: 'on-track' | 'warning' | 'over-budget' = 'on-track';
      if (percentage >= 100) status = 'over-budget';
      else if (percentage >= 80) status = 'warning';

      return {
        ...budget,
        spent: spentThisMonth,
        status
      };
    });
  }, [budgets, transactions]);

  const stats = useMemo(() => {
    if (!enrichedBudgets) return { totalBudget: 0, totalLimit: 0, totalSpent: 0, remaining: 0 };
    const totalLimit = enrichedBudgets.reduce((sum, b) => sum + b.limit, 0);
    const totalSpent = enrichedBudgets.reduce((sum, b) => sum + b.spent, 0);
    return {
      totalBudget: totalLimit,
      totalLimit,
      totalSpent,
      remaining: totalLimit - totalSpent,
    };
  }, [enrichedBudgets]);

  if (!enrichedBudgets) {
    return (
      <div className="flex flex-col gap-8 opacity-50 animate-pulse">
        <div className="h-48 bg-gray-200 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-200 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-text-primary m-0">
          Your Budgets
        </h2>
        <Button variant="primary" icon={<Plus size={16} />}>
          Create Budget
        </Button>
      </div>

      <BudgetSummary stats={stats} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {enrichedBudgets.map((budget) => (
          <BudgetCard key={budget.localId ?? budget.category} budget={budget} />
        ))}

        {/* Add New Budget Card placeholder */}
        <div className="h-full border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center p-8 text-center cursor-pointer hover:border-primary hover:bg-primary-light/50 transition-all group min-h-[200px]">
          <div className="w-12 h-12 rounded-full bg-bg flex items-center justify-center text-text-muted group-hover:text-primary group-hover:bg-white mb-3 transition-colors shadow-sm">
            <Plus size={24} />
          </div>
          <p className="font-bold text-text-primary group-hover:text-primary transition-colors m-0">
            Create New Budget
          </p>
          <p className="text-sm text-text-muted mt-1">
            Set a new spending limit
          </p>
        </div>
      </div>
    </div>
  );
};

export default BudgetsView;
