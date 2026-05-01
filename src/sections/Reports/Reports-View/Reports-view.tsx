import React from "react";
import WeeklyBarChart from "../WeeklyBarChart";
import CategoryBreakdown from "../CategoryBreakdown";
import Card from "../../../components/Card";
import Button from "../../../components/Button";
import { weeklySpendingData } from "../../../data/mockData";
import {
  Download,
  Share2,
  TrendingDown,
  TrendingUp,
  PiggyBank,
} from "lucide-react";

const ReportsView: React.FC = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-text-primary m-0">
          April 2025 Report
        </h2>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" icon={<Share2 size={16} />}>
            Share
          </Button>
          <Button variant="primary" size="sm" icon={<Download size={16} />}>
            Download PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card padding="md" className="flex flex-col gap-4">
          <div className="flex items-center gap-3 text-text-muted font-medium text-sm">
            <TrendingDown size={18} className="text-danger" />
            Total Expenses
          </div>
          <h3 className="text-3xl font-bold text-text-primary m-0">3,620.45</h3>
          <p className="text-sm text-success font-medium">
            -3.1% from last month
          </p>
        </Card>

        <Card padding="md" className="flex flex-col gap-4">
          <div className="flex items-center gap-3 text-text-muted font-medium text-sm">
            <TrendingUp size={18} className="text-success" />
            Net Savings
          </div>
          <h3 className="text-3xl font-bold text-text-primary m-0">2,429.55</h3>
          <p className="text-sm text-success font-medium">
            +8.7% from last month
          </p>
        </Card>

        <Card padding="md" className="flex flex-col gap-4">
          <div className="flex items-center gap-3 text-text-muted font-medium text-sm">
            <PiggyBank size={18} className="text-primary" />
            Savings Rate
          </div>
          <h3 className="text-3xl font-bold text-text-primary m-0">40.1%</h3>
          <p className="text-sm text-success font-medium">
            +2.4% from last month
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="lg:col-span-1">
          <WeeklyBarChart data={weeklySpendingData} />
        </div>
        <div className="lg:col-span-1">
          <CategoryBreakdown />
        </div>
      </div>
    </div>
  );
};

export default ReportsView;
