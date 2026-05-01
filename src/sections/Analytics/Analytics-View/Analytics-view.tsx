import React from "react";
import CategoryDonutChart from "../CategoryDonutChart";
import TopMerchants from "../TopMerchants";
import CashFlowChart from "../../Dashboard/CashFlowChart";
import { Download, Calendar } from "lucide-react";
import Button from "../../../components/Button";
import { cashFlowData, categorySpendingData } from "../../../data/mockData";

const topMerchantsData = [
  { name: "Whole Foods Market", amount: 845.2, transactions: 12 },
  { name: "Amazon", amount: 620.5, transactions: 18 },
  { name: "Uber", amount: 340.0, transactions: 24 },
  { name: "Target", amount: 290.75, transactions: 5 },
  { name: "Starbucks", amount: 125.0, transactions: 22 },
];

const AnalyticsView: React.FC = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          <Button variant="outline" size="sm" icon={<Calendar size={16} />}>
            Last 30 Days
          </Button>
        </div>
        <Button variant="ghost" size="sm" icon={<Download size={16} />}>
          Export Report
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <CategoryDonutChart data={categorySpendingData} />
        </div>
        <div className="lg:col-span-2">
          <CashFlowChart data={cashFlowData} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <TopMerchants merchants={topMerchantsData} />
        </div>
        {/* Additional analytics widgets could go here in a real app */}
      </div>
    </div>
  );
};

export default AnalyticsView;
