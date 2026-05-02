import React, { useState } from "react";
import Modal from "../../components/Modal";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { db } from "../../db/db";
import { syncEngine } from "../../db/syncEngine";

interface AddBudgetModalProps {
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
  "Other",
] as const;

const PRESET_COLORS = [
  "#5B67CA",
  "#F59E0B",
  "#10B981",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
  "#3B82F6",
  "#14B8A6",
];

const PRESET_ICONS = [
  "🛒",
  "🍽️",
  "🚗",
  "🎬",
  "🏠",
  "💪",
  "⚡",
  "✈️",
  "📚",
  "💼",
  "💳",
];

const inputClass =
  "w-full py-2.5 px-3.5 border-[1.5px] border-border rounded-md bg-bg text-text-primary text-base font-body outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/10";
const labelClass = "text-sm font-semibold text-text-primary font-body";

const AddBudgetModal: React.FC<AddBudgetModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    category: "",
    limit: "",
    icon: "💳",
    color: "#5B67CA",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category || !formData.limit) return;

    setIsLoading(true);
    try {
      const now = Date.now();
      const newLocalId = await db.budgets.add({
        category: formData.category,
        limit: parseFloat(formData.limit),
        spent: 0,
        color: formData.color,
        icon: formData.icon,
        status: "on-track",
        isSynced: false,
        isDeleted: false,
        updatedAt: now,
      });

      await db.syncQueue.add({
        action: "create",
        collection: "budgets",
        payload: {
          localId: newLocalId as number,
          category: formData.category,
          limit: parseFloat(formData.limit),
          spent: 0,
          color: formData.color,
          icon: formData.icon,
          status: "on-track",
          isSynced: false,
          isDeleted: false,
          updatedAt: now,
        },
        retryCount: 0,
        timestamp: now,
      });

      syncEngine.startSync();

      setFormData({ category: "", limit: "", icon: "💳", color: "#5B67CA" });
      onClose();
    } catch (error) {
      console.error("Failed to add budget:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Budget" size="md">
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        {/* Category */}
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

        {/* Limit */}
        <Input
          label="Monthly Limit"
          type="number"
          step="0.01"
          min="1"
          placeholder="0.00"
          value={formData.limit}
          onChange={(e) => setFormData({ ...formData, limit: e.target.value })}
          icon={<span className="text-text-muted font-bold"></span>}
          iconPosition="left"
          required
        />

        {/* Color Picker */}
        <div className="flex flex-col gap-2">
          <label className={labelClass}>Color</label>
          <div className="flex gap-2 flex-wrap">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setFormData({ ...formData, color: c })}
                className={`w-8 h-8 rounded-full border-2 transition-all {
                  formData.color === c ? "border-text-primary scale-110" : "border-transparent"
                }`}
                style={{ backgroundColor: c }}
                aria-label={`Color {c}`}
              />
            ))}
          </div>
        </div>

        {/* Icon Picker */}
        <div className="flex flex-col gap-2">
          <label className={labelClass}>Icon</label>
          <div className="flex gap-2 flex-wrap">
            {PRESET_ICONS.map((icon) => (
              <button
                key={icon}
                type="button"
                onClick={() => setFormData({ ...formData, icon })}
                className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center border-2 transition-all {
                  formData.icon === icon
                    ? "border-primary bg-primary-light"
                    : "border-border bg-bg hover:border-primary/50"
                }`}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        {/* Preview */}
        {formData.category && formData.limit && (
          <div className="p-3 rounded-lg bg-bg border border-border flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
              style={{ backgroundColor: `{formData.color}20` }}
            >
              {formData.icon}
            </div>
            <div>
              <p className="font-bold text-text-primary m-0">
                {formData.category}
              </p>
              <p className="text-sm text-text-muted m-0">
                Limit: {parseFloat(formData.limit || "0").toFixed(2)}/month
              </p>
            </div>
            <div
              className="ml-auto w-3 h-3 rounded-full"
              style={{ backgroundColor: formData.color }}
            />
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
            Create Budget
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddBudgetModal;
