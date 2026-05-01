import React from "react";
import Card from "../../components/Card";
import { categorySpendingData } from "../../data/mockData";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

const CategoryBreakdown: React.FC = () => {
  const total = categorySpendingData.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card padding="none" className="h-full flex flex-col overflow-hidden">
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-bold text-text-primary m-0">
          Category Breakdown
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto">
        <ul className="divide-y divide-border">
          {categorySpendingData.map((item, index) => {
            const percentage = ((item.value / total) * 100).toFixed(1);
            // Mocking trend data for UI purposes
            const trend =
              index % 3 === 0 ? "up" : index % 3 === 1 ? "down" : "flat";

            return (
              <li
                key={index}
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
                    className={`flex items-center gap-0.5 text-xs font-semibold {
                    trend === 'up' ? 'text-danger' : trend === 'down' ? 'text-success' : 'text-text-muted'
                  }`}
                  >
                    {trend === "up" && <ArrowUpRight size={12} />}
                    {trend === "down" && <ArrowDownRight size={12} />}
                    {trend === "flat" && <Minus size={12} />}
                    <span>
                      {trend === "flat" ? "No change" : "vs last month"}
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
