import React from "react";
import Card from "../../components/Card";
import type { Budget } from "../../../types/global-types";
import { Pencil, Trash2 } from "lucide-react";

interface BudgetCardProps {
  budget: Budget;
  onEdit?: (budget: Budget) => void;
  onDelete?: (budget: Budget) => void;
}

const BudgetCard: React.FC<BudgetCardProps> = ({ budget, onEdit, onDelete }) => {
  const percentage = Math.min((budget.spent / budget.limit) * 100, 100);
  const remaining = budget.limit - budget.spent;
  const isOver = remaining < 0;

  const getStatusColor = () => {
    if (percentage < 80) return "bg-success";
    if (percentage < 100) return "bg-warning";
    return "bg-danger";
  };

  return (
    <Card
      padding="md"
      hoverable
      className="h-full flex flex-col cursor-pointer hover:border-primary transition-colors group"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-sm"
            style={{
              backgroundColor: `${budget.color}15`,
              color: budget.color,
            }}
          >
            {budget.icon}
          </div>
          <div>
            <h4 className="text-base font-bold text-text-primary m-0 group-hover:text-primary transition-colors">
              {budget.category}
            </h4>
            <p className="text-xs text-text-muted mt-0.5">
              {isOver ? "Over budget" : `${percentage.toFixed(0)}% used`}
            </p>
          </div>
        </div>

        {/* Actions Menu */}
        {(onEdit || onDelete) && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {onEdit && (
              <button
                className="w-8 h-8 rounded border-none bg-transparent flex items-center justify-center text-text-muted hover:text-primary hover:bg-primary-light/30 transition-colors cursor-pointer"
                onClick={(e) => { e.stopPropagation(); onEdit(budget); }}
                title="Edit Budget"
              >
                <Pencil size={14} />
              </button>
            )}
            {onDelete && (
              <button
                className="w-8 h-8 rounded border-none bg-transparent flex items-center justify-center text-text-muted hover:text-danger hover:bg-danger-light/30 transition-colors cursor-pointer"
                onClick={(e) => { e.stopPropagation(); onDelete(budget); }}
                title="Delete Budget"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        )}
      </div>

      <div className="mt-auto">
        <div className="flex items-end justify-between mb-2">
          <div>
            <span className="text-2xl font-bold text-text-primary">
              {budget.spent.toFixed(0)}
            </span>
            <span className="text-sm text-text-muted">
              {" "}
              / {budget.limit.toFixed(0)}
            </span>
          </div>
          <span
            className={`text-sm font-semibold ${
              isOver ? "text-danger" : "text-text-secondary"
            }`}
          >
            {isOver
              ? `-${Math.abs(remaining).toFixed(0)}`
              : `${remaining.toFixed(0)} left`}
          </span>
        </div>

        <div className="h-2 w-full bg-border rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${getStatusColor()} transition-all duration-500 ease-out`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </Card>
  );
};

export default BudgetCard;
