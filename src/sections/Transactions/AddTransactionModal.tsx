import React, { useState } from "react";
import Modal from "../../components/Modal";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { db } from "../../db/db";
import { syncEngine } from "../../db/syncEngine";

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

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
] as const;

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    category: "",
    type: "expense" as "expense" | "income",
    account: "",
    note: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.amount || !formData.category) return;

    setIsLoading(true);
    try {
      const now = Date.now();
      const newLocalId = await db.transactions.add({
        name: formData.name,
        amount: parseFloat(formData.amount),
        category: formData.category,
        date: formData.date,
        type: formData.type,
        status: "completed",
        account: formData.account || undefined,
        note: formData.note || undefined,
        isSynced: false,
        isDeleted: false,
        updatedAt: now,
      });

      // Queue for cloud sync
      await db.syncQueue.add({
        action: "create",
        collection: "transactions",
        payload: {
          localId: newLocalId as number,
          name: formData.name,
          amount: parseFloat(formData.amount),
          category: formData.category,
          date: formData.date,
          type: formData.type,
          status: "completed",
          account: formData.account || undefined,
          note: formData.note || undefined,
          isSynced: false,
          isDeleted: false,
          updatedAt: now,
        },
        retryCount: 0,
        timestamp: now,
      });

      // Attempt immediate sync if online
      syncEngine.startSync();

      // Reset and close
      setFormData({
        name: "",
        amount: "",
        date: new Date().toISOString().split("T")[0],
        category: "",
        type: "expense",
        account: "",
        note: "",
      });
      onClose();
    } catch (error) {
      console.error("Failed to add transaction:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    "w-full py-2.5 px-3.5 border-[1.5px] border-border rounded-md bg-white text-base font-body outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/10";
  const labelClass = "text-sm font-semibold text-text-primary font-body";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Transaction" size="md">
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <Input
          label="Transaction Name"
          placeholder="e.g. Spotify Premium"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Amount"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            icon={<span className="text-text-muted font-bold">$</span>}
            iconPosition="left"
            required
          />
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className={inputClass}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as "expense" | "income" })}
              className={inputClass}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className={inputClass}
              required
            >
              <option value="">Select Category</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Account (Optional)</label>
          <input
            type="text"
            value={formData.account}
            onChange={(e) => setFormData({ ...formData, account: e.target.value })}
            className={inputClass}
            placeholder="e.g. Chase Checking, Amex Gold"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Notes (Optional)</label>
          <textarea
            rows={3}
            value={formData.note}
            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
            className={`${inputClass} resize-none`}
            placeholder="Add any additional details here..."
          />
        </div>

        <div className="flex justify-end gap-3 mt-2 pt-5 border-t border-border">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={isLoading}>
            Save Transaction
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddTransactionModal;
