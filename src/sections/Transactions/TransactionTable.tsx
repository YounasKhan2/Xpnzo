import React, { useState } from "react";
import Card from "../../components/Card";
import Badge from "../../components/Badge";
import type { LocalTransaction } from "../../db/db";
import { db } from "../../db/db";
import { syncEngine } from "../../db/syncEngine";
import { Pencil, Trash2 } from "lucide-react";

interface TransactionTableProps {
  transactions: LocalTransaction[];
  onEdit: (tx: LocalTransaction) => void;
}

const statusVariant = (s: string) =>
  s === "completed" ? "success" : s === "pending" ? "warning" : "danger";

const TransactionTable: React.FC<TransactionTableProps> = ({ transactions, onEdit }) => {
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (tx: LocalTransaction) => {
    if (!tx.localId) return;
    const confirmed = window.confirm(`Delete "${tx.name}"? This cannot be undone.`);
    if (!confirmed) return;

    setDeletingId(tx.localId);
    try {
      await db.transactions.delete(tx.localId);
      // Queue cloud deletion if it was already synced
      if (tx.id) {
        const now = Date.now();
        await db.syncQueue.add({
          action: "delete",
          collection: "transactions",
          payload: { id: tx.id, localId: tx.localId, isDeleted: true, updatedAt: now },
          retryCount: 0,
          timestamp: now,
        });
        syncEngine.startSync();
      }
    } catch (err) {
      console.error("Failed to delete transaction:", err);
    } finally {
      setDeletingId(null);
    }
  };

  if (transactions.length === 0) {
    return (
      <Card padding="md" className="text-center py-12">
        <p className="text-text-muted">No transactions yet. Add one to get started!</p>
      </Card>
    );
  }

  const amountClass = (type: string) =>
    type === "income" ? "text-success" : "text-danger";

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
              <th className="py-4 px-6 font-semibold text-sm text-text-secondary text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {transactions.map((tx, index) => (
              <tr
                key={tx.id ?? tx.localId ?? index}
                className="hover:bg-bg/30 transition-colors"
              >
                <td className="py-4 px-6">
                  <p className="font-bold text-text-primary m-0">{tx.name}</p>
                  {tx.account && (
                    <p className="text-sm text-text-muted m-0 mt-0.5">{tx.account}</p>
                  )}
                </td>
                <td className="py-4 px-6 text-text-secondary">{tx.category}</td>
                <td className="py-4 px-6 text-text-secondary">{tx.date}</td>
                <td className="py-4 px-6">
                  <Badge variant={statusVariant(tx.status ?? "")}>{tx.status}</Badge>
                </td>
                <td className={`py-4 px-6 text-right font-bold ${amountClass(tx.type)}`}>
                  {tx.type === "income" ? "+" : "-"}
                  {tx.amount.toFixed(2)}
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={() => onEdit(tx)}
                      className="p-1.5 rounded-md text-text-muted hover:text-primary hover:bg-primary-light transition-colors"
                      title="Edit"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(tx)}
                      disabled={deletingId === tx.localId}
                      className="p-1.5 rounded-md text-text-muted hover:text-danger hover:bg-danger-light transition-colors disabled:opacity-40"
                      title="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Mobile stacked cards (< md) ──────────────────────────── */}
      <div className="md:hidden divide-y divide-border">
        {transactions.map((tx, index) => (
          <div
            key={tx.id ?? tx.localId ?? index}
            className="flex items-center justify-between px-4 py-3.5 gap-3"
          >
            {/* Left: name + category */}
            <div className="min-w-0 flex-1">
              <p className="font-bold text-text-primary text-sm m-0 truncate">{tx.name}</p>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="text-xs text-text-muted">{tx.category}</span>
                <span className="text-text-muted/40">·</span>
                <span className="text-xs text-text-muted">{tx.date}</span>
              </div>
            </div>
            {/* Right: amount + status + actions */}
            <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
              <span className={`font-bold text-sm ${amountClass(tx.type)}`}>
                {tx.type === "income" ? "+" : "-"}
                {tx.amount.toFixed(2)}
              </span>
              <Badge variant={statusVariant(tx.status ?? "")} size="sm">{tx.status}</Badge>
              <div className="flex gap-1 mt-0.5">
                <button
                  onClick={() => onEdit(tx)}
                  className="p-1 rounded text-text-muted hover:text-primary transition-colors"
                >
                  <Pencil size={13} />
                </button>
                <button
                  onClick={() => handleDelete(tx)}
                  disabled={deletingId === tx.localId}
                  className="p-1 rounded text-text-muted hover:text-danger transition-colors disabled:opacity-40"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default TransactionTable;
