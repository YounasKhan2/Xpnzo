import React, { useState } from "react";
import Modal from "../../components/Modal";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { db } from "../../db/db";

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    category: "",
    account: "Chase Checking",
    notes: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.amount || !formData.category) return;

    setIsLoading(true);
    try {
      const newTxId = await db.transactions.add({
        name: formData.name,
        amount: parseFloat(formData.amount),
        category: formData.category,
        date: formData.date,
        type: "expense",
        status: "completed",
        account: formData.account,
        note: formData.notes,
        isSynced: false,
        isDeleted: false,
        updatedAt: Date.now(),
      });

      // Add to sync queue
      await db.syncQueue.add({
        action: 'create',
        collection: 'transactions',
        payload: {
          localId: newTxId,
          name: formData.name,
          amount: parseFloat(formData.amount),
          category: formData.category,
          date: formData.date,
          type: "expense",
          status: "completed",
          account: formData.account,
          note: formData.notes,
        },
        timestamp: Date.now(),
      });

      // Trigger sync
      import('../../db/syncEngine').then(({ syncEngine }) => syncEngine.startSync());
      
      // Reset form and close
      setFormData({
        name: "",
        amount: "",
        date: new Date().toISOString().split("T")[0],
        category: "",
        account: "Chase Checking",
        notes: "",
      });
      onClose();
    } catch (error: unknown) {
      console.error("Failed to add transaction:", error);
    } finally {
      setIsLoading(false);
    }
  };

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

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Amount"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            icon={<span className="text-text-muted font-bold">$</span>}
            iconPosition="left"
            required
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-text-primary font-body">
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full py-2.5 px-3.5 border-[1.5px] border-border rounded-md bg-white text-base font-body outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/10"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-text-primary font-body">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full py-2.5 px-3.5 border-[1.5px] border-border rounded-md bg-white text-base font-body outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/10"
              required
            >
              <option value="">Select Category</option>
              <option value="Food & Dining">Food & Dining</option>
              <option value="Shopping">Shopping</option>
              <option value="Transportation">Transportation</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Housing">Housing</option>
              <option value="Groceries">Groceries</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-text-primary font-body">
              Account
            </label>
            <select
              value={formData.account}
              onChange={(e) => setFormData({ ...formData, account: e.target.value })}
              className="w-full py-2.5 px-3.5 border-[1.5px] border-border rounded-md bg-white text-base font-body outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/10"
            >
              <option value="Chase Checking">Chase Checking</option>
              <option value="Amex Gold">Amex Gold</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-text-primary font-body">
            Notes (Optional)
          </label>
          <textarea
            rows={3}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full py-2.5 px-3.5 border-[1.5px] border-border rounded-md bg-white text-base font-body outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/10 resize-none"
            placeholder="Add any additional details here..."
          ></textarea>
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
