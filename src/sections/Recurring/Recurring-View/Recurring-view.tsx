import React, { useState } from "react";
import RecurringTable from "../RecurringTable";
import Button from "../../../components/Button";
import Card from "../../../components/Card";
import { mockRecurring } from "../../../data/mockData";
import { Plus, Wallet, RefreshCw } from "lucide-react";

const RecurringView: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState(mockRecurring);

  const handleToggleStatus = (id: string, isActive: boolean) => {
    setSubscriptions((subs) =>
      subs.map((sub) => (sub.id === id ? { ...sub, isActive } : sub)),
    );
  };

  const activeMonthlyTotal = subscriptions
    .filter((s) => s.isActive && s.frequency === "monthly")
    .reduce((sum, s) => sum + s.amount, 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-text-primary m-0">
          Recurring Expenses
        </h2>
        <Button variant="primary" icon={<Plus size={16} />}>
          Add Subscription
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card padding="md" className="flex items-center gap-6">
          <div className="w-14 h-14 rounded-full bg-primary-light text-primary flex items-center justify-center flex-shrink-0">
            <RefreshCw size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-text-muted mb-1">
              Total Monthly Recurring
            </p>
            <h3 className="text-3xl font-bold text-text-primary m-0">
              {activeMonthlyTotal.toFixed(2)}
            </h3>
            <p className="text-sm text-text-muted mt-1">
              Based on active subscriptions
            </p>
          </div>
        </Card>

        <Card padding="md" className="flex items-center gap-6">
          <div className="w-14 h-14 rounded-full bg-success-light text-success flex items-center justify-center flex-shrink-0">
            <Wallet size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-text-muted mb-1">
              Projected Yearly
            </p>
            <h3 className="text-3xl font-bold text-text-primary m-0">
              {(activeMonthlyTotal * 12).toFixed(2)}
            </h3>
            <p className="text-sm text-text-muted mt-1">
              If all active subs continue
            </p>
          </div>
        </Card>
      </div>

      <RecurringTable
        subscriptions={subscriptions}
        onToggleStatus={handleToggleStatus}
      />
    </div>
  );
};

export default RecurringView;
