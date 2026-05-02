import React, { useState, useMemo } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../../db/db";
import Button from "../../../components/Button";
import TransactionTable from "../TransactionTable";
import AddTransactionModal from "../AddTransactionModal";
import { Plus, Filter, Download } from "lucide-react";
import type { LocalTransaction } from "../../../db/db";

// ─── Date range helpers ───────────────────────────────────────────────────────
const getDateRange = (
  range: string,
): { from: Date | null; to: Date | null } => {
  const now = new Date();
  const startOfDay = (d: Date) => {
    d.setHours(0, 0, 0, 0);
    return d;
  };

  if (range === "last30") {
    const from = new Date(now);
    from.setDate(from.getDate() - 30);
    return { from: startOfDay(from), to: now };
  }
  if (range === "thisMonth") {
    return { from: new Date(now.getFullYear(), now.getMonth(), 1), to: now };
  }
  if (range === "lastMonth") {
    const from = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const to = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
    return { from, to };
  }
  if (range === "thisYear") {
    return { from: new Date(now.getFullYear(), 0, 1), to: now };
  }
  return { from: null, to: null };
};

// ─── CSV Export ───────────────────────────────────────────────────────────────
const exportToCSV = (transactions: LocalTransaction[]) => {
  const header = [
    "Name",
    "Category",
    "Type",
    "Amount",
    "Date",
    "Status",
    "Account",
    "Note",
  ];
  const rows = transactions.map((t) => [
    `"{t.name}"`,
    `"{t.category}"`,
    t.type,
    t.amount.toFixed(2),
    t.date,
    t.status,
    `"{t.account ?? ""}"`,
    `"{t.note ?? ""}"`,
  ]);
  const csv = [header.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `xpnzo-transactions-{new Date().toISOString().split("T")[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// ─── Categories list ──────────────────────────────────────────────────────────
const CATEGORIES = [
  "Food & Dining",
  "Shopping",
  "Transportation",
  "Entertainment",
  "Housing",
  "Groceries",
  "Health & Fitness",
  "Utilities",
  "Travel",
  "Education",
  "Income",
  "Other",
];

// ─── Component ────────────────────────────────────────────────────────────────
const TransactionsView: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [dateRange, setDateRange] = useState("last30");

  const transactions = useLiveQuery(() =>
    db.transactions.orderBy("date").reverse().toArray(),
  );

  // Apply filters in-memory (no need to re-query, data is small)
  const filtered = useMemo(() => {
    if (!transactions) return [];
    const { from, to } = getDateRange(dateRange);

    return transactions.filter((t) => {
      const matchCat =
        categoryFilter === "all" || t.category === categoryFilter;
      const d = new Date(t.date);
      const matchDate = (!from || d >= from) && (!to || d <= to);
      return matchCat && matchDate;
    });
  }, [transactions, categoryFilter, dateRange]);

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
        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Category filter */}
          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="appearance-none py-2 pl-3 pr-8 border border-border rounded-lg bg-card text-sm font-medium text-text-primary outline-none focus:border-primary cursor-pointer"
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
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

          {/* Date range filter */}
          <div className="relative">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="appearance-none py-2 pl-3 pr-8 border border-border rounded-lg bg-card text-sm font-medium text-text-primary outline-none focus:border-primary cursor-pointer"
            >
              <option value="last30">Last 30 Days</option>
              <option value="thisMonth">This Month</option>
              <option value="lastMonth">Last Month</option>
              <option value="thisYear">This Year</option>
              <option value="all">All Time</option>
            </select>
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
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

          <Button variant="outline" size="sm" icon={<Filter size={15} />}>
            <span className="hidden sm:inline">Filters</span>
          </Button>

          {/* Active filter count badge */}
          {(categoryFilter !== "all" || dateRange !== "last30") && (
            <span className="text-xs bg-primary text-white font-bold px-2 py-0.5 rounded-full">
              {(categoryFilter !== "all" ? 1 : 0) +
                (dateRange !== "last30" ? 1 : 0)}{" "}
              active
            </span>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            icon={<Download size={15} />}
            onClick={() => exportToCSV(filtered)}
            disabled={filtered.length === 0}
            title={`Export {filtered.length} transactions as CSV`}
          >
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

      {/* Result count */}
      <p className="text-sm text-text-muted -mt-2">
        Showing{" "}
        <span className="font-semibold text-text-primary">
          {filtered.length}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-text-primary">
          {transactions.length}
        </span>{" "}
        transactions
      </p>

      <TransactionTable transactions={filtered} />

      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default TransactionsView;
