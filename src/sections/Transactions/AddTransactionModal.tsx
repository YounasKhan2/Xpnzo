import React from "react";
import Modal from "../../components/Modal";
import Input from "../../components/Input";
import Button from "../../components/Button";

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Transaction" size="md">
      <form className="flex flex-col gap-5">
        <Input label="Transaction Name" placeholder="e.g. Spotify Premium" />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Amount"
            type="number"
            placeholder="0.00"
            icon={<span className="text-text-muted font-bold"></span>}
            iconPosition="left"
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-text-primary font-body">
              Date
            </label>
            <input
              type="date"
              className="w-full py-2.5 px-3.5 border-[1.5px] border-border rounded-md bg-white text-base font-body outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/10"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-text-primary font-body">
              Category
            </label>
            <select className="w-full py-2.5 px-3.5 border-[1.5px] border-border rounded-md bg-white text-base font-body outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/10">
              <option value="">Select Category</option>
              <option value="Food & Dining">Food & Dining</option>
              <option value="Shopping">Shopping</option>
              <option value="Transportation">Transportation</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Housing">Housing</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-text-primary font-body">
              Account
            </label>
            <select className="w-full py-2.5 px-3.5 border-[1.5px] border-border rounded-md bg-white text-base font-body outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/10">
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
            className="w-full py-2.5 px-3.5 border-[1.5px] border-border rounded-md bg-white text-base font-body outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/10 resize-none"
            placeholder="Add any additional details here..."
          ></textarea>
        </div>

        <div className="flex justify-end gap-3 mt-2 pt-5 border-t border-border">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" variant="primary">
            Save Transaction
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddTransactionModal;
