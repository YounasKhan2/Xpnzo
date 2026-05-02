import React from "react";
import Card from "../../components/Card";
import { Wallet, TrendingDown, TrendingUp, PiggyBank } from "lucide-react";

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
  const percentage = stats.totalLimit > 0
    ? Math.min((stats.totalSpent / stats.totalLimit) * 100, 100)
    : 0;

  const kpis = [
    {
      title: "Total Budget",
      value: stats.totalLimit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      icon: <Wallet size={22} />,
      iconBg: "bg-primary-light",
      iconColor: "text-primary",
      sub: "Combined monthly limits",
    },
    {
      title: "Total Spent",
      value: stats.totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      icon: <TrendingDown size={22} />,
      iconBg: "bg-danger-light",
      iconColor: "text-danger",
      sub: `${percentage.toFixed(1)}% of total budget`,
    },
    {
      title: "Remaining",
      value: stats.remaining.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      icon: <PiggyBank size={22} />,
      iconBg: "bg-success-light",
      iconColor: "text-success",
      sub: `${(100 - percentage).toFixed(1)}% left to spend`,
    },
    {
      title: "Budget Health",
      value: percentage <= 80 ? "On Track" : percentage < 100 ? "Warning" : "Over Budget",
      icon: <TrendingUp size={22} />,
      iconBg: percentage <= 80 ? "bg-success-light" : percentage < 100 ? "bg-warning-light" : "bg-danger-light",
      iconColor: percentage <= 80 ? "text-success" : percentage < 100 ? "text-warning" : "text-danger",
      sub: `Overall spending status`,
      isText: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {kpis.map((kpi) => (
        <Card key={kpi.title} padding="md" className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-text-muted">{kpi.title}</p>
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${kpi.iconBg} ${kpi.iconColor}`}>
              {kpi.icon}
            </div>
          </div>
          <div>
            <p className={`font-bold m-0 leading-tight ${kpi.isText ? "text-xl" : "text-2xl"} text-text-primary`}>
              {kpi.value}
            </p>
            <p className="text-xs text-text-muted mt-1">{kpi.sub}</p>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default BudgetSummary;
