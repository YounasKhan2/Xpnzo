import React from "react";
import StatCard from "../StatCard";
import CashFlowChart from "../CashFlowChart";
import RecentTransactions from "../RecentTransactions";
import { Wallet, ArrowDownRight, ArrowUpRight, PiggyBank } from "lucide-react";
import {
  cashFlowData,
  dashboardStats,
  mockTransactions,
} from "../../../data/mockData";

const DashboardView: React.FC = () => {
  return (
    <div className="flex flex-col gap-8">
      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Balance"
          amount={dashboardStats.totalBalance}
          change={dashboardStats.balanceChange}
          icon={<Wallet size={24} />}
          iconColorClass="text-primary"
          iconBgClass="bg-primary-light"
        />
        <StatCard
          title="Monthly Income"
          amount={dashboardStats.monthlyIncome}
          change={dashboardStats.incomeChange}
          icon={<ArrowDownRight size={24} />}
          iconColorClass="text-success"
          iconBgClass="bg-success-light"
        />
        <StatCard
          title="Monthly Expense"
          amount={dashboardStats.monthlyExpense}
          change={dashboardStats.expenseChange}
          icon={<ArrowUpRight size={24} />}
          iconColorClass="text-danger"
          iconBgClass="bg-danger-light"
        />
        <StatCard
          title="Total Savings"
          amount={dashboardStats.monthlySavings}
          change={dashboardStats.savingsChange}
          icon={<PiggyBank size={24} />}
          iconColorClass="text-info"
          iconBgClass="bg-info-light"
        />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CashFlowChart data={cashFlowData} />
        </div>
        <div className="lg:col-span-1">
          <RecentTransactions transactions={mockTransactions} />
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
