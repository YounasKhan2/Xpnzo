import React from "react";
import Card from "../../components/Card";

interface BudgetSummaryStats {
  totalBudget: number;
  totalSpent: number;
  remaining: number;
  totalLimit: number;
}

interface BudgetSummaryProps {
  stats: BudgetSummaryStats;
}

const BudgetSummary: React.FC<BudgetSummaryProps> = ({ stats }) => {
  const percentage = Math.min((stats.totalSpent / stats.totalLimit) * 100, 100);

  return (
    <Card
      padding="lg"
      className="bg-primary text-white overflow-hidden relative border-none"
    >
      <div className="absolute right-0 top-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
      <div className="absolute left-0 bottom-0 w-48 h-48 bg-white opacity-10 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4" />

      <div className="relative z-10">
        <h2 className="text-xl font-bold font-heading m-0 mb-6">
          Total Budget Summary
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div>
            <p className="text-primary-light text-sm font-medium mb-1">
              Total Budget
            </p>
            <p className="text-3xl font-bold m-0">
              {stats.totalLimit.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-primary-light text-sm font-medium mb-1">
              Total Spent
            </p>
            <p className="text-3xl font-bold m-0">
              {stats.totalSpent.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-primary-light text-sm font-medium mb-1">
              Remaining
            </p>
            <p className="text-3xl font-bold m-0">
              {stats.remaining.toLocaleString()}
            </p>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm font-medium mb-2 text-primary-light">
            <span>{percentage.toFixed(1)}% Used</span>
            <span>{(100 - percentage).toFixed(1)}% Left</span>
          </div>
          <div className="h-3 w-full bg-primary-dark rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default BudgetSummary;
