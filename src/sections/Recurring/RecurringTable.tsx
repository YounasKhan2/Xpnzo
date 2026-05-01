import React from "react";
import Card from "../../components/Card";
import Toggle from "../../components/Toggle";
import type { RecurringTransaction } from "../../../types/global-types";
import { Calendar, CreditCard } from "lucide-react";

interface RecurringTableProps {
  subscriptions: RecurringTransaction[];
  onToggleStatus: (id: string, isActive: boolean) => void;
}

const RecurringTable: React.FC<RecurringTableProps> = ({
  subscriptions,
  onToggleStatus,
}) => {
  return (
    <Card padding="none" className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-bg/50 border-b border-border">
              <th className="py-4 px-6 font-semibold text-sm text-text-secondary">
                Subscription Name
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
                key={sub.id}
                className={`hover:bg-bg/30 transition-colors ${
                  !sub.isActive ? "opacity-60" : ""
                }`}
              >
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-light text-primary flex items-center justify-center flex-shrink-0">
                      <CreditCard size={18} />
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
                      onChange={(checked) => onToggleStatus(sub.id, checked)}
                      size="sm"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default RecurringTable;
