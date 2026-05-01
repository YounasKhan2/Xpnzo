import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { CategoryDataPoint } from "../../../types/Analytics-types";
import Card from "../../components/Card";

interface CategoryDonutChartProps {
  data: CategoryDataPoint[];
}

const CategoryDonutChart: React.FC<CategoryDonutChartProps> = ({ data }) => {
  return (
    <Card padding="md" className="h-full flex flex-col">
      <h3 className="text-lg font-bold text-text-primary m-0 mb-6">
        Spending by Category
      </h3>

      <div className="flex-1 min-h-[300px] flex items-center justify-center relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={120}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: unknown) => [
                `${Number(value || 0).toFixed(2)}`,
                "Spent",
              ]}
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              formatter={(value: unknown) => (
                <span className="text-sm text-text-secondary font-medium ml-1">
                  {String(value)}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none -mt-8">
          <span className="text-sm text-text-muted font-medium">
            Total Spent
          </span>
          <span className="text-2xl font-bold text-text-primary m-0">
            {data.reduce((sum, item) => sum + item.value, 0).toLocaleString()}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default CategoryDonutChart;
