import React from "react";
import Card from "../../components/Card";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

export interface CategorySpendingItem {
  name: string;
  value: number;
  color: string;
  /** Optional: spending in the previous period for trend calculation */
  prevValue?: number;
}

interface CategoryBreakdownProps {
  data: CategorySpendingItem[];
}

type Trend = "up" | "down" | "flat";

const getTrend = (
  current: number,
  prev?: number,
): { trend: Trend; pct: string } => {
  if (prev === undefined || prev === 0) return { trend: "flat", pct: "" };
  const diff = ((current - prev) / prev) * 100;
  if (Math.abs(diff) < 1) return { trend: "flat", pct: "" };
  return {
    trend: diff > 0 ? "up" : "down",
    pct: `${Math.abs(diff).toFixed(0)}%`,
  };
};

const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  if (data.length === 0) {
    return (
      <Card
        padding="none"
        className="h-full flex items-center justify-center p-8 min-h-[300px]"
      >
        <p className="text-text-muted text-center">
          No spending data for this period.
        </p>
      </Card>
    );
  }

  return (
    <Card padding="none" className="h-full flex flex-col overflow-hidden">
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-bold text-text-primary m-0">
          Category Breakdown
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto">
        <ul className="divide-y divide-border">
          {data.map((item) => {
            const percentage = ((item.value / total) * 100).toFixed(1);
            const { trend, pct } = getTrend(item.value, item.prevValue);

            return (
              <li
                key={item.name}
                className="p-4 px-6 flex items-center gap-4 hover:bg-bg/50 transition-colors"
              >
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-base font-bold text-text-primary truncate m-0">
                    {item.name}
                  </p>
                  <p className="text-sm text-text-muted m-0 mt-0.5">
                    {percentage}% of total
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className="text-base font-bold text-text-primary">
                    {item.value.toFixed(2)}
                  </span>
                  <div
                    className={`flex items-center gap-0.5 text-xs font-semibold ${
                      trend === "up"
                        ? "text-danger"
                        : trend === "down"
                          ? "text-success"
                          : "text-text-muted"
                    }`}
                  >
                    {trend === "up" && <ArrowUpRight size={12} />}
                    {trend === "down" && <ArrowDownRight size={12} />}
                    {trend === "flat" && <Minus size={12} />}
                    <span>
                      {trend === "flat"
                        ? item.prevValue !== undefined
                          ? "No change"
                          : "New"
                        : `${pct} vs last month`}
                    </span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </Card>
  );
};

export default CategoryBreakdown;
