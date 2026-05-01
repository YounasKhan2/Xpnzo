import React, { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../../db/db";
import Button from "../../../components/Button";
import TransactionTable from "../TransactionTable";
import AddTransactionModal from "../AddTransactionModal";
import { Plus, Filter, Download } from "lucide-react";

const TransactionsView: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const transactions = useLiveQuery(() =>
    db.transactions.orderBy("date").reverse().toArray()
  );

  if (!transactions) {
    return (
      <div className="flex flex-col gap-4 opacity-50 animate-pulse">
        <div className="h-12 bg-gray-200 rounded-lg w-full" />
        <div className="h-64 bg-gray-200 rounded-xl w-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      {/* ── Toolbar ──────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Filters — wrap on mobile */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <select className="appearance-none py-2 pl-3 pr-8 border border-border rounded-lg bg-card text-sm font-medium text-text-primary outline-none focus:border-primary cursor-pointer">
              <option>All Categories</option>
              <option>Food &amp; Dining</option>
              <option>Shopping</option>
              <option>Housing</option>
            </select>
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </div>
          </div>
          <div className="relative">
            <select className="appearance-none py-2 pl-3 pr-8 border border-border rounded-lg bg-card text-sm font-medium text-text-primary outline-none focus:border-primary cursor-pointer">
              <option>Last 30 Days</option>
              <option>This Month</option>
              <option>Last Month</option>
              <option>This Year</option>
            </select>
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </div>
          </div>
          <Button variant="outline" size="sm" icon={<Filter size={15} />}>
            <span className="hidden sm:inline">Filters</span>
          </Button>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
          <Button variant="ghost" size="sm" icon={<Download size={15} />}>
            <span className="hidden sm:inline">Export</span>
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={<Plus size={15} />}
            onClick={() => setIsModalOpen(true)}
          >
            <span className="hidden xs:inline">Add </span>Transaction
          </Button>
        </div>
      </div>

      <TransactionTable transactions={transactions} />

      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default TransactionsView;
