import React from "react";
import Card from "../../components/Card";
import Badge from "../../components/Badge";
import type { Transaction } from "../../../types/global-types";
import { ShoppingBag, Coffee, Home, Zap, Heart, Film } from "lucide-react";

interface RecentTransactionsProps {
  transactions: Transaction[];
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "Shopping":
      return <ShoppingBag size={18} />;
    case "Food & Dining":
      return <Coffee size={18} />;
    case "Housing":
      return <Home size={18} />;
    case "Utilities":
      return <Zap size={18} />;
    case "Health & Fitness":
      return <Heart size={18} />;
    case "Entertainment":
      return <Film size={18} />;
    default:
      return <ShoppingBag size={18} />;
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case "Shopping":
      return "bg-purple-100 text-purple-600";
    case "Food & Dining":
      return "bg-amber-100 text-amber-600";
    case "Housing":
      return "bg-blue-100 text-blue-600";
    case "Utilities":
      return "bg-cyan-100 text-cyan-600";
    case "Health & Fitness":
      return "bg-emerald-100 text-emerald-600";
    case "Entertainment":
      return "bg-rose-100 text-rose-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  transactions,
}) => {
  return (
    <Card padding="none" className="h-full flex flex-col overflow-hidden">
      <div className="flex items-center justify-between p-6 border-b border-border">
        <h3 className="text-lg font-bold text-text-primary m-0">
          Recent Transactions
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto">
        <ul className="divide-y divide-border">
          {transactions.slice(0, 5).map((tx) => (
            <li
              key={tx.id}
              className="p-4 px-6 flex items-center gap-4 hover:bg-bg/50 transition-colors cursor-pointer"
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${getCategoryColor(tx.category)}`}
              >
                {getCategoryIcon(tx.category)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-bold text-text-primary truncate">
                  {tx.name}
                </p>
                <p className="text-sm text-text-muted truncate mt-0.5">
                  {tx.category} • {tx.date}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <span
                  className={`text-base font-bold ${tx.type === "income" ? "text-success" : "text-text-primary"}`}
                >
                  {tx.type === "income" ? "+" : "-"}
                  {tx.amount.toFixed(2)}
                </span>
                <Badge
                  variant={
                    tx.status === "completed"
                      ? "success"
                      : tx.status === "pending"
                        ? "warning"
                        : "danger"
                  }
                  size="sm"
                >
                  {tx.status}
                </Badge>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
};

export default RecentTransactions;
