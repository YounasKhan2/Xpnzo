import React from "react";
import Card from "../../components/Card";
import type { Merchant } from "../../../types/Analytics-types";
import { Store } from "lucide-react";

interface TopMerchantsProps {
  merchants: Merchant[];
}

const TopMerchants: React.FC<TopMerchantsProps> = ({ merchants }) => {
  return (
    <Card padding="none" className="h-full flex flex-col overflow-hidden">
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-bold text-text-primary m-0">
          Top Merchants
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto">
        <ul className="divide-y divide-border">
          {merchants.map((merchant, index) => (
            <li
              key={index}
              className="p-4 px-6 flex items-center gap-4 hover:bg-bg/50 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-primary-light text-primary flex items-center justify-center flex-shrink-0">
                <Store size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-bold text-text-primary truncate m-0">
                  {merchant.name}
                </p>
                <p className="text-sm text-text-muted m-0 mt-0.5">
                  {merchant.transactions} transactions
                </p>
              </div>
              <div className="text-right">
                <p className="text-base font-bold text-text-primary m-0">
                  {merchant.amount.toLocaleString()}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
};

export default TopMerchants;
