import React, { useMemo } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../../db/db";
import CategoryDonutChart from "../CategoryDonutChart";
import TopMerchants from "../TopMerchants";
import CashFlowChart from "../../Dashboard/CashFlowChart";
import { Download, Calendar } from "lucide-react";
import Button from "../../../components/Button";

const AnalyticsView: React.FC = () => {
  const transactions = useLiveQuery(() => db.transactions.toArray());

  const categorySpendingData = useMemo(() => {
    if (!transactions) return [];
    
    const categories: Record<string, { value: number, color: string }> = {};
    const colors = ["#5B67CA", "#F59E0B", "#10B981", "#8B5CF6", "#EC4899", "#9CA3AF"];
    let colorIndex = 0;

    transactions.filter(t => t.type === 'expense').forEach(t => {
      if (!categories[t.category]) {
        categories[t.category] = { 
          value: 0, 
          color: colors[colorIndex % colors.length] 
        };
        colorIndex++;
      }
      categories[t.category].value += t.amount;
    });

    return Object.entries(categories).map(([name, data]) => ({
      name,
      value: data.value,
      color: data.color
    }));
  }, [transactions]);

  const cashFlowData = useMemo(() => {
    if (!transactions) return [];
    
    const months: Record<string, { month: string, income: number, expense: number, order: number }> = {};
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    transactions.forEach(t => {
      const d = new Date(t.date);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (!months[key]) {
        months[key] = { 
          month: monthNames[d.getMonth()], 
          income: 0, 
          expense: 0,
          order: d.getFullYear() * 12 + d.getMonth()
        };
      }
      if (t.type === 'income') months[key].income += t.amount;
      else months[key].expense += t.amount;
    });

    return Object.values(months)
      .sort((a, b) => a.order - b.order)
      .slice(-6); // Last 6 months
  }, [transactions]);

  const topMerchantsData = useMemo(() => {
    if (!transactions) return [];

    const merchants: Record<string, { amount: number, transactions: number }> = {};
    
    transactions.filter(t => t.type === 'expense' && t.name).forEach(t => {
      if (!merchants[t.name]) {
        merchants[t.name] = { amount: 0, transactions: 0 };
      }
      merchants[t.name].amount += t.amount;
      merchants[t.name].transactions += 1;
    });

    return Object.entries(merchants)
      .map(([name, data]) => ({
        name,
        amount: data.amount,
        transactions: data.transactions
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  }, [transactions]);

  if (!transactions) {
    return (
      <div className="flex flex-col gap-6 opacity-50 animate-pulse">
        <div className="h-64 bg-gray-200 rounded-xl w-full" />
        <div className="h-96 bg-gray-200 rounded-xl w-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          <Button variant="outline" size="sm" icon={<Calendar size={16} />}>
            Last 6 Months
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
      </div>
    </div>
  );
};

export default AnalyticsView;
