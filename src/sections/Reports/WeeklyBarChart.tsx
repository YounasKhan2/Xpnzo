import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Card from "../../components/Card";

interface WeeklyDataPoint {
  week: string;
  expense: number;
}

interface WeeklyBarChartProps {
  data: WeeklyDataPoint[];
}

const WeeklyBarChart: React.FC<WeeklyBarChartProps> = ({ data }) => {
  return (
    <Card padding="md" className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-text-primary m-0">
            Weekly Expenses
          </h3>
          <p className="text-sm text-text-muted mt-1">
            This month's spending by week
          </p>
        </div>
      </div>

      <div className="flex-1 min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#E5E7EB"
            />
            <XAxis
              dataKey="week"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#9CA3AF" }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#9CA3AF" }}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip
              cursor={{ fill: "rgba(91, 103, 202, 0.05)" }}
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
              }}
              formatter={(value: unknown) => [
                `${Number(value || 0).toLocaleString()}`,
                "Expense",
              ]}
            />
            <Bar
              dataKey="expense"
              fill="#5B67CA"
              radius={[4, 4, 0, 0]}
              barSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default WeeklyBarChart;
