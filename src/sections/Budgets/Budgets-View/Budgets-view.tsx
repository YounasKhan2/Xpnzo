import React from "react";
import Button from "../../../components/Button";
import BudgetCard from "../BudgetCard";
import BudgetSummary from "../BudgetSummary";
import { mockBudgets } from "../../../data/mockData";
import { Plus } from "lucide-react";

const BudgetsView: React.FC = () => {
  const stats = {
    totalLimit: mockBudgets.reduce((sum, b) => sum + b.limit, 0),
    totalSpent: mockBudgets.reduce((sum, b) => sum + b.spent, 0),
    get remaining() {
      return this.totalLimit - this.totalSpent;
    },
  };

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
        {mockBudgets.map((budget) => (
          <BudgetCard key={budget.id} budget={budget} />
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
