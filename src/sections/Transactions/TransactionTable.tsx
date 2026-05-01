import React from "react";
import Card from "../../components/Card";
import Badge from "../../components/Badge";
import type { Transaction } from "../../../types/global-types";

interface TransactionTableProps {
  transactions: Transaction[];
}

const statusVariant = (s: string) =>
  s === "completed" ? "success" : s === "pending" ? "warning" : "danger";

const TransactionTable: React.FC<TransactionTableProps> = ({ transactions }) => {
  if (transactions.length === 0) {
    return (
      <Card padding="md" className="text-center py-12">
        <p className="text-text-muted">No transactions yet. Add one to get started!</p>
      </Card>
    );
  }

  return (
    <Card padding="none" className="overflow-hidden">
      {/* ── Desktop table (md+) ─────────────────────────────────── */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-bg/50 border-b border-border">
              <th className="py-4 px-6 font-semibold text-sm text-text-secondary">Transaction</th>
              <th className="py-4 px-6 font-semibold text-sm text-text-secondary">Category</th>
              <th className="py-4 px-6 font-semibold text-sm text-text-secondary">Date</th>
              <th className="py-4 px-6 font-semibold text-sm text-text-secondary">Status</th>
              <th className="py-4 px-6 font-semibold text-sm text-text-secondary text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {transactions.map((tx, index) => (
              <tr key={tx.id ?? tx.localId ?? index} className="hover:bg-bg/30 transition-colors">
                <td className="py-4 px-6">
                  <p className="font-bold text-text-primary m-0">{tx.name}</p>
                  <p className="text-sm text-text-muted m-0 mt-0.5">{tx.account}</p>
                </td>
                <td className="py-4 px-6 text-text-secondary">{tx.category}</td>
                <td className="py-4 px-6 text-text-secondary">{tx.date}</td>
                <td className="py-4 px-6">
                  <Badge variant={statusVariant(tx.status ?? "")}>{tx.status}</Badge>
                </td>
                <td className={`py-4 px-6 text-right font-bold ${tx.type === "income" ? "text-success" : "text-text-primary"}`}>
                  {tx.type === "income" ? "+" : "-"}
                  {tx.amount.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Mobile stacked cards (< md) ──────────────────────────── */}
      <div className="md:hidden divide-y divide-border">
        {transactions.map((tx, index) => (
          <div key={tx.id ?? tx.localId ?? index} className="flex items-center justify-between px-4 py-3.5 gap-3">
            {/* Left: name + category */}
            <div className="min-w-0 flex-1">
              <p className="font-bold text-text-primary text-sm m-0 truncate">{tx.name}</p>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="text-xs text-text-muted">{tx.category}</span>
                <span className="text-text-muted/40">·</span>
                <span className="text-xs text-text-muted">{tx.date}</span>
              </div>
            </div>
            {/* Right: amount + status */}
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
              <span className={`font-bold text-sm ${tx.type === "income" ? "text-success" : "text-text-primary"}`}>
                {tx.type === "income" ? "+" : "-"}{tx.amount.toFixed(2)}
              </span>
              <Badge variant={statusVariant(tx.status ?? "")} size="sm">{tx.status}</Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default TransactionTable;
