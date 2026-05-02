import React from "react";
import Card from "../../components/Card";
import Toggle from "../../components/Toggle";
import Badge from "../../components/Badge";
import type { LocalRecurring } from "../../db/db";
import { Calendar, CreditCard } from "lucide-react";

interface RecurringTableProps {
  subscriptions: LocalRecurring[];
  onToggleStatus: (localId: number, isActive: boolean) => void;
}

const RecurringTable: React.FC<RecurringTableProps> = ({
  subscriptions,
  onToggleStatus,
}) => {
  if (subscriptions.length === 0) {
    return (
      <Card padding="md" className="text-center py-12">
        <p className="text-text-muted">
          No recurring items yet. Add one to get started.
        </p>
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
              <th className="py-4 px-6 font-semibold text-sm text-text-secondary">
                Subscription
              </th>
              <th className="py-4 px-6 font-semibold text-sm text-text-secondary">
                Category
              </th>
              <th className="py-4 px-6 font-semibold text-sm text-text-secondary">
                Frequency
              </th>
              <th className="py-4 px-6 font-semibold text-sm text-text-secondary">
                Next Payment
              </th>
              <th className="py-4 px-6 font-semibold text-sm text-text-secondary">
                Amount
              </th>
              <th className="py-4 px-6 font-semibold text-sm text-text-secondary text-right">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {subscriptions.map((sub) => (
              <tr
                key={sub.localId}
                className={`hover:bg-bg/30 transition-colors {!sub.isActive ? "opacity-60" : ""}`}
              >
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary-light text-primary flex items-center justify-center flex-shrink-0">
                      <CreditCard size={16} />
                    </div>
                    <p className="font-bold text-text-primary m-0">
                      {sub.name}
                    </p>
                  </div>
                </td>
                <td className="py-4 px-6 text-text-secondary">
                  {sub.category}
                </td>
                <td className="py-4 px-6 text-text-secondary capitalize">
                  {sub.frequency}
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2 text-text-secondary">
                    <Calendar size={14} />
                    <span>{sub.nextDate}</span>
                  </div>
                </td>
                <td className="py-4 px-6 font-bold text-text-primary">
                  {sub.amount.toFixed(2)}
                </td>
                <td className="py-4 px-6 text-right">
                  <div className="flex justify-end">
                    <Toggle
                      checked={sub.isActive}
                      onChange={(checked) =>
                        onToggleStatus(sub.localId!, checked)
                      }
                      size="sm"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Mobile stacked cards (< md) ──────────────────────────── */}
      <div className="md:hidden divide-y divide-border">
        {subscriptions.map((sub) => (
          <div
            key={sub.localId}
            className={`px-4 py-3.5 {!sub.isActive ? "opacity-60" : ""}`}
          >
            <div className="flex items-center justify-between gap-3">
              {/* Icon + name */}
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-9 h-9 rounded-full bg-primary-light text-primary flex items-center justify-center flex-shrink-0">
                  <CreditCard size={16} />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-text-primary text-sm m-0 truncate">
                    {sub.name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <span className="text-xs text-text-muted capitalize">
                      {sub.frequency}
                    </span>
                    <span className="text-text-muted/40">·</span>
                    <span className="text-xs text-text-muted">
                      {sub.category}
                    </span>
                  </div>
                </div>
              </div>
              {/* Amount + toggle */}
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <span className="font-bold text-sm text-text-primary">
                  {sub.amount.toFixed(2)}
                </span>
                <Toggle
                  checked={sub.isActive}
                  onChange={(checked) => onToggleStatus(sub.localId!, checked)}
                  size="sm"
                />
              </div>
            </div>
            {/* Next payment row */}
            <div className="flex items-center gap-1.5 mt-2 ml-12">
              <Calendar size={12} className="text-text-muted" />
              <span className="text-xs text-text-muted">
                Next: {sub.nextDate}
              </span>
              <Badge variant={sub.isActive ? "success" : "neutral"} size="sm">
                {sub.isActive ? "Active" : "Paused"}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default RecurringTable;
