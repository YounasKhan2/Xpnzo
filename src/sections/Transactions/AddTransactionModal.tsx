import React, { useState, useRef } from "react";
import Modal from "../../components/Modal";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { db, type LocalTransaction } from "../../db/db";
import { syncEngine } from "../../db/syncEngine";
import { storage, BUCKET_IDS, Permission, Role } from "../../lib/appwrite";
import { authService } from "../../services/auth";
import { ID } from "appwrite";
import { Paperclip, X, FileImage } from "lucide-react";

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingTransaction?: LocalTransaction | null;
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

const defaultForm = () => ({
  name: "",
  amount: "",
  date: new Date().toISOString().split("T")[0],
  category: "",
  type: "expense" as "expense" | "income",
  account: "",
  note: "",
  receiptFileId: "",
});

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
  editingTransaction,
}) => {
  const isEditing = !!editingTransaction;
  const [formData, setFormData] = useState(defaultForm());
  const [isLoading, setIsLoading] = useState(false);
  const [receiptPreview, setReceiptPreview] = useState<string>("");
  const [isUploadingReceipt, setIsUploadingReceipt] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [prevEditingTx, setPrevEditingTx] = useState(editingTransaction);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  // Pre-fill form when editing (derived state pattern instead of useEffect)
  if (editingTransaction !== prevEditingTx || isOpen !== prevIsOpen) {
    setPrevEditingTx(editingTransaction);
    setPrevIsOpen(isOpen);

    if (editingTransaction) {
      setFormData({
        name: editingTransaction.name,
        amount: String(editingTransaction.amount),
        date: editingTransaction.date,
        category: editingTransaction.category,
        type: editingTransaction.type,
        account: editingTransaction.account ?? "",
        note: editingTransaction.note ?? "",
        receiptFileId: editingTransaction.receiptFileId ?? "",
      });
      setReceiptPreview("");
    } else {
      setFormData(defaultForm());
      setReceiptPreview("");
    }
  }

  const handleReceiptUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("File is too large. Max size is 5MB.");
      return;
    }

    // Local preview
    const reader = new FileReader();
    reader.onloadend = () => setReceiptPreview(reader.result as string);
    reader.readAsDataURL(file);

    setIsUploadingReceipt(true);
    try {
      const user = await authService.getCurrentUser();
      const permissions = user
        ? [
            Permission.read(Role.user(user.$id)),
            Permission.delete(Role.user(user.$id)),
          ]
        : [];
      const response = await storage.createFile(
        BUCKET_IDS.receipts,
        ID.unique(),
        file,
        permissions,
      );
      setFormData((prev) => ({ ...prev, receiptFileId: response.$id }));
    } catch (err) {
      console.error("Failed to upload receipt:", err);
      alert("Receipt upload failed. The transaction will be saved without it.");
      setReceiptPreview("");
    } finally {
      setIsUploadingReceipt(false);
    }
  };

  const handleRemoveReceipt = () => {
    setReceiptPreview("");
    setFormData((prev) => ({ ...prev, receiptFileId: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.amount || !formData.category) return;

    setIsLoading(true);
    try {
      const now = Date.now();
      const txPayload = {
        name: formData.name,
        amount: parseFloat(formData.amount),
        category: formData.category,
        date: formData.date,
        type: formData.type,
        status: "completed" as const,
        account: formData.account || undefined,
        note: formData.note || undefined,
        receiptFileId: formData.receiptFileId || undefined,
        isSynced: false,
        isDeleted: false,
        updatedAt: now,
      };

      if (isEditing && editingTransaction?.localId) {
        // Update existing
        await db.transactions.update(editingTransaction.localId, txPayload);
        if (editingTransaction.id) {
          await db.syncQueue.add({
            action: "update",
            collection: "transactions",
            payload: {
              ...txPayload,
              id: editingTransaction.id,
              localId: editingTransaction.localId,
            },
            retryCount: 0,
            timestamp: now,
          });
        }
      } else {
        // Create new
        const newLocalId = await db.transactions.add(txPayload);
        await db.syncQueue.add({
          action: "create",
          collection: "transactions",
          payload: { ...txPayload, localId: newLocalId as number },
          retryCount: 0,
          timestamp: now,
        });
      }

      syncEngine.startSync();
      setFormData(defaultForm());
      setReceiptPreview("");
      onClose();
    } catch (error) {
      console.error("Failed to save transaction:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    "w-full py-2.5 px-3.5 border-[1.5px] border-border rounded-md bg-bg text-text-primary text-base font-body outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/10";
  const labelClass = "text-sm font-semibold text-text-primary font-body";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Transaction" : "Add Transaction"}
      size="md"
    >
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
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.value })
            }
            required
          />
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
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
              onChange={(e) =>
                setFormData({
                  ...formData,
                  type: e.target.value as "expense" | "income",
                })
              }
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
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Account (Optional)</label>
          <input
            type="text"
            value={formData.account}
            onChange={(e) =>
              setFormData({ ...formData, account: e.target.value })
            }
            className={inputClass}
            placeholder="e.g. Chase Checking, Amex Gold"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Notes (Optional)</label>
          <textarea
            rows={2}
            value={formData.note}
            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
            className={`${inputClass} resize-none`}
            placeholder="Add any additional details here..."
          />
        </div>

        {/* ── Receipt Upload ──────────────────────────────────────── */}
        <div className="flex flex-col gap-2">
          <label className={labelClass}>Receipt (Optional)</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,application/pdf"
            className="hidden"
            onChange={handleReceiptUpload}
          />

          {receiptPreview || formData.receiptFileId ? (
            <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-bg">
              {receiptPreview ? (
                <img
                  src={receiptPreview}
                  alt="Receipt"
                  className="w-12 h-12 object-cover rounded-md border border-border"
                />
              ) : (
                <div className="w-12 h-12 rounded-md bg-primary-light flex items-center justify-center">
                  <FileImage size={20} className="text-primary" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary m-0 truncate">
                  {receiptPreview
                    ? "Receipt uploaded"
                    : `File: ${formData.receiptFileId.slice(0, 12)}…`}
                </p>
                <p className="text-xs text-text-muted">Receipt attached</p>
              </div>
              <button
                type="button"
                onClick={handleRemoveReceipt}
                className="p-1.5 rounded-md hover:bg-danger-light text-text-muted hover:text-danger transition-colors"
              >
                <X size={15} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingReceipt}
              className="flex items-center gap-3 w-full p-3 border-2 border-dashed border-border rounded-lg text-text-muted hover:border-primary hover:text-primary hover:bg-primary-light/30 transition-all disabled:opacity-50"
            >
              <Paperclip size={18} />
              <span className="text-sm font-medium">
                {isUploadingReceipt
                  ? "Uploading…"
                  : "Attach receipt (PNG, JPG, PDF · max 5MB)"}
              </span>
            </button>
          )}
        </div>

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
            {isEditing ? "Save Changes" : "Save Transaction"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddTransactionModal;
