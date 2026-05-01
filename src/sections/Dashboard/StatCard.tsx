import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import Card from "../../components/Card";

interface StatCardProps {
  title: string;
  amount: number;
  change: number;
  icon: React.ReactNode;
  iconColorClass: string;
  iconBgClass: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  amount,
  change,
  icon,
  iconColorClass,
  iconBgClass,
}) => {
  const isPositive = change >= 0;

  return (
    <Card padding="md">
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center ${iconBgClass} ${iconColorClass}`}
        >
          {icon}
        </div>
        <div
          className={`flex items-center gap-1 text-sm font-semibold px-2 py-1 rounded-md ${
            isPositive
              ? "bg-success-light text-green-700"
              : "bg-danger-light text-red-700"
          }`}
        >
          {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          <span>{Math.abs(change)}%</span>
        </div>
      </div>
      <div>
        <p className="text-sm text-text-secondary font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-text-primary m-0">
          {amount.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </h3>
      </div>
    </Card>
  );
};

export default StatCard;
