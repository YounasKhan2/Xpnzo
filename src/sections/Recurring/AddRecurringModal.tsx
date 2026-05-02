import React, { useState } from "react";
import Modal from "../../components/Modal";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { db } from "../../db/db";
import { syncEngine } from "../../db/syncEngine";
import type { RecurringFrequency } from "../../../types/global-types";
import type { LocalRecurring } from "../../db/db";

interface AddRecurringModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingRecurring?: LocalRecurring | null;
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
  "Other",
] as const;

const FREQUENCIES: { value: RecurringFrequency; label: string }[] = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
];

const inputClass =
  "w-full py-2.5 px-3.5 border-[1.5px] border-border rounded-md bg-bg text-text-primary text-base font-body outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/10";
const labelClass = "text-sm font-semibold text-text-primary font-body";

const AddRecurringModal: React.FC<AddRecurringModalProps> = ({
  isOpen,
  onClose,
  editingRecurring,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    category: "",
    frequency: "monthly" as RecurringFrequency,
    nextDate: new Date().toISOString().split("T")[0],
    isActive: true,
  });
  const [isLoading, setIsLoading] = useState(false);

  const [prevEditingRecurring, setPrevEditingRecurring] = useState(editingRecurring);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  if (editingRecurring !== prevEditingRecurring || isOpen !== prevIsOpen) {
    setPrevEditingRecurring(editingRecurring);
    setPrevIsOpen(isOpen);
    if (editingRecurring && isOpen) {
      setFormData({
        name: editingRecurring.name,
        amount: editingRecurring.amount.toString(),
        category: editingRecurring.category,
        frequency: editingRecurring.frequency,
        nextDate: editingRecurring.nextDate,
        isActive: editingRecurring.isActive,
      });
    } else if (isOpen) {
      setFormData({
        name: "",
        amount: "",
        category: "",
        frequency: "monthly",
        nextDate: new Date().toISOString().split("T")[0],
        isActive: true,
      });
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.amount || !formData.category) return;

    setIsLoading(true);
    try {
      const now = Date.now();

      if (editingRecurring && editingRecurring.localId) {
        const updatedFields = {
          name: formData.name,
          amount: parseFloat(formData.amount),
          frequency: formData.frequency,
          nextDate: formData.nextDate,
          category: formData.category,
          isActive: formData.isActive,
          isSynced: false,
          updatedAt: now,
        };
        await db.recurring.update(editingRecurring.localId, updatedFields);
        await db.syncQueue.add({
          action: "update",
          collection: "recurring",
          payload: { localId: editingRecurring.localId, ...updatedFields },
          retryCount: 0,
          timestamp: now,
        });
      } else {
        const newLocalId = await db.recurring.add({
          name: formData.name,
          amount: parseFloat(formData.amount),
          frequency: formData.frequency,
          nextDate: formData.nextDate,
          category: formData.category,
          isActive: formData.isActive,
          isSynced: false,
          isDeleted: false,
          updatedAt: now,
        });

        await db.syncQueue.add({
          action: "create",
          collection: "recurring",
          payload: {
            localId: newLocalId as number,
            name: formData.name,
            amount: parseFloat(formData.amount),
            frequency: formData.frequency,
            nextDate: formData.nextDate,
            category: formData.category,
            isActive: formData.isActive,
            isSynced: false,
            isDeleted: false,
            updatedAt: now,
          },
          retryCount: 0,
          timestamp: now,
        });
      }

      syncEngine.startSync();

      onClose();
    } catch (error) {
      console.error("Failed to add recurring:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editingRecurring ? "Edit Subscription" : "Add Subscription"} size="md">
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <Input
          label="Subscription Name"
          placeholder="e.g. Netflix, Gym Membership"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Amount"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0.00"
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.value })
            }
            icon={<span className="text-text-muted font-bold"></span>}
            iconPosition="left"
            required
          />
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Frequency</label>
            <select
              value={formData.frequency}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  frequency: e.target.value as RecurringFrequency,
                })
              }
              className={inputClass}
            >
              {FREQUENCIES.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Category</label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className={inputClass}
              required
            >
              <option value="">Select Category</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Next Payment Date</label>
            <input
              type="date"
              value={formData.nextDate}
              onChange={(e) =>
                setFormData({ ...formData, nextDate: e.target.value })
              }
              className={inputClass}
              required
            />
          </div>
        </div>

        {/* Active toggle */}
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <div className="relative">
            <input
              type="checkbox"
              className="sr-only"
              checked={formData.isActive}
              onChange={(e) =>
                setFormData({ ...formData, isActive: e.target.checked })
              }
            />
            <div
              className={`w-11 h-6 rounded-full transition-colors duration-200 {
                formData.isActive ? "bg-primary" : "bg-border"
              }`}
            />
            <div
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 {
                formData.isActive ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </div>
          <span className="text-sm font-semibold text-text-primary font-body">
            Active — start tracking immediately
          </span>
        </label>

        {/* Preview */}
        {formData.name && formData.amount && (
          <div className="p-3 rounded-lg bg-bg border border-border flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-light text-primary flex items-center justify-center text-lg font-bold">
              {formData.name[0]?.toUpperCase() ?? "?"}
            </div>
            <div>
              <p className="font-bold text-text-primary m-0">{formData.name}</p>
              <p className="text-sm text-text-muted m-0 capitalize">
                {parseFloat(formData.amount || "0").toFixed(2)} ·{" "}
                {formData.frequency}
              </p>
            </div>
            <span
              className={`ml-auto text-xs font-bold px-2 py-1 rounded-full {
              formData.isActive ? "bg-success-light text-success" : "bg-border text-text-muted"
            }`}
            >
              {formData.isActive ? "Active" : "Paused"}
            </span>
          </div>
        )}

        <div className="flex justify-end gap-3 mt-2 pt-5 border-t border-border">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={isLoading}>
            {editingRecurring ? "Save Changes" : "Add Subscription"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddRecurringModal;
