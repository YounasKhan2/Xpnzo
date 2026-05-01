import React, { useState } from "react";
import Button from "../../../components/Button";
import TransactionTable from "../TransactionTable";
import AddTransactionModal from "../AddTransactionModal";
import { mockTransactions } from "../../../data/mockData";
import { Plus, Filter, Download } from "lucide-react";

const TransactionsView: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          <div className="relative">
            <select className="appearance-none py-2 pl-4 pr-10 border border-border rounded-lg bg-card text-sm font-medium text-text-primary outline-none focus:border-primary cursor-pointer">
              <option>All Categories</option>
              <option>Food & Dining</option>
              <option>Shopping</option>
              <option>Housing</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </div>
          </div>
          <div className="relative">
            <select className="appearance-none py-2 pl-4 pr-10 border border-border rounded-lg bg-card text-sm font-medium text-text-primary outline-none focus:border-primary cursor-pointer">
              <option>Last 30 Days</option>
              <option>This Month</option>
              <option>Last Month</option>
              <option>This Year</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </div>
          </div>
          <Button variant="outline" size="sm" icon={<Filter size={16} />}>
            More Filters
          </Button>
        </div>

        <div className="flex gap-3">
          <Button variant="ghost" size="sm" icon={<Download size={16} />}>
            Export
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={<Plus size={16} />}
            onClick={() => setIsModalOpen(true)}
          >
            Add Transaction
          </Button>
        </div>
      </div>

      <TransactionTable transactions={mockTransactions} />

      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default TransactionsView;
