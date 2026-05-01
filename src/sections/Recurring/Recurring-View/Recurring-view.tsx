import React, { useMemo } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../../db/db";
import RecurringTable from "../RecurringTable";
import Button from "../../../components/Button";
import Card from "../../../components/Card";
import { Plus, Wallet, RefreshCw } from "lucide-react";

const RecurringView: React.FC = () => {
  const subscriptions = useLiveQuery(() =>
    db.recurring.filter((r) => !r.isDeleted).toArray()
  );

  // Toggle active status using localId (the Dexie auto-increment PK)
  const handleToggleStatus = async (localId: number, isActive: boolean) => {
    await db.recurring.update(localId, { isActive, updatedAt: Date.now() });
  };

  const stats = useMemo(() => {
    if (!subscriptions) return { monthly: 0, yearly: 0 };

    const monthlyTotal = subscriptions
      .filter((s) => s.isActive && s.frequency === "monthly")
      .reduce((sum, s) => sum + s.amount, 0);

    const weeklyTotal = subscriptions
      .filter((s) => s.isActive && s.frequency === "weekly")
      .reduce((sum, s) => sum + s.amount * 4.33, 0); // approx months per week

    return {
      monthly: monthlyTotal + weeklyTotal,
      yearly: (monthlyTotal + weeklyTotal) * 12,
    };
  }, [subscriptions]);

  if (!subscriptions) {
    return (
      <div className="flex flex-col gap-6 opacity-50 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-32 bg-gray-200 rounded-xl" />
          <div className="h-32 bg-gray-200 rounded-xl" />
        </div>
        <div className="h-64 bg-gray-200 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-text-primary m-0">Recurring Expenses</h2>
        <Button variant="primary" icon={<Plus size={16} />}>Add Subscription</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card padding="md" className="flex items-center gap-6">
          <div className="w-14 h-14 rounded-full bg-primary-light text-primary flex items-center justify-center flex-shrink-0">
            <RefreshCw size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-text-muted mb-1">Total Monthly Recurring</p>
            <h3 className="text-3xl font-bold text-text-primary m-0">{stats.monthly.toFixed(2)}</h3>
            <p className="text-sm text-text-muted mt-1">Based on active subscriptions</p>
          </div>
        </Card>

        <Card padding="md" className="flex items-center gap-6">
          <div className="w-14 h-14 rounded-full bg-success-light text-success flex items-center justify-center flex-shrink-0">
            <Wallet size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-text-muted mb-1">Projected Yearly</p>
            <h3 className="text-3xl font-bold text-text-primary m-0">{stats.yearly.toFixed(2)}</h3>
            <p className="text-sm text-text-muted mt-1">If all active subs continue</p>
          </div>
        </Card>
      </div>

      <RecurringTable subscriptions={subscriptions} onToggleStatus={handleToggleStatus} />
    </div>
  );
};

export default RecurringView;
