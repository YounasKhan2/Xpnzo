import React from "react";
import Card from "../../components/Card";
import Badge from "../../components/Badge";
import type { Transaction } from "../../../types/global-types";

interface TransactionTableProps {
  transactions: Transaction[];
}

const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
}) => {
  return (
    <Card padding="none" className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-bg/50 border-b border-border">
              <th className="py-4 px-6 font-semibold text-sm text-text-secondary">
                Transaction Name
              </th>
              <th className="py-4 px-6 font-semibold text-sm text-text-secondary">
                Category
              </th>
              <th className="py-4 px-6 font-semibold text-sm text-text-secondary">
                Date
              </th>
              <th className="py-4 px-6 font-semibold text-sm text-text-secondary">
                Status
              </th>
              <th className="py-4 px-6 font-semibold text-sm text-text-secondary text-right">
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {transactions.map((tx, index) => (
              <tr key={tx.id || tx.localId || index} className="hover:bg-bg/30 transition-colors">
                <td className="py-4 px-6">
                  <p className="font-bold text-text-primary m-0">{tx.name}</p>
                  <p className="text-sm text-text-muted m-0 mt-0.5">
                    {tx.account}
                  </p>
                </td>
                <td className="py-4 px-6 text-text-secondary">{tx.category}</td>
                <td className="py-4 px-6 text-text-secondary">{tx.date}</td>
                <td className="py-4 px-6">
                  <Badge
                    variant={
                      tx.status === "completed"
                        ? "success"
                        : tx.status === "pending"
                          ? "warning"
                          : "danger"
                    }
                  >
                    {tx.status}
                  </Badge>
                </td>
                <td
                  className={`py-4 px-6 text-right font-bold ${tx.type === 'income' ? 'text-success' : 'text-text-primary'}`}
                >
                  {tx.type === "income" ? "+" : "-"}
                  {tx.amount.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default TransactionTable;
