import React, { useState } from "react";
import Card from "../../components/Card";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    question: "How do I connect my bank account?",
    answer:
      'You can connect your bank account by navigating to the Settings page, selecting "Connected Accounts", and following the Plaid integration steps. We support over 10,000 financial institutions.',
  },
  {
    question: "Is my financial data secure?",
    answer:
      "Yes, your data is extremely secure. We use bank-level 256-bit encryption to protect your information. We never store your bank login credentials on our servers, and we only have read-only access to your transaction data.",
  },
  {
    question: "How do I export my reports?",
    answer:
      'Go to the Reports page and click the "Download PDF" button in the top right corner. You can also export your raw transaction data as a CSV file from the Transactions page.',
  },
  {
    question: "Can I share my account with my spouse?",
    answer:
      'Currently, Xpnzo is designed for individual use. However, you can connect joint bank accounts to track shared expenses. A proper multi-user "Family Plan" feature is on our roadmap for late 2025.',
  },
  {
    question: "How do budgets work?",
    answer:
      "Budgets allow you to set spending limits for specific categories (e.g., Groceries, Entertainment). When you categorize a transaction, it automatically counts towards that budget. We will notify you when you reach 80% and 100% of your limit.",
  },
];

const FAQAccordion: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <Card padding="lg" className="h-full">
      <h3 className="text-lg font-bold text-text-primary m-0 mb-6">
        Frequently Asked Questions
      </h3>

      <div className="flex flex-col gap-3">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className={`border rounded-lg overflow-hidden transition-colors duration-200 {
              openIndex === index ? 'border-primary bg-primary-light/20' : 'border-border bg-card hover:bg-bg/50'
            }`}
          >
            <button
              className="w-full flex items-center justify-between p-4 text-left bg-transparent border-none cursor-pointer"
              onClick={() => toggleAccordion(index)}
            >
              <span
                className={`font-semibold text-base {openIndex === index ? 'text-primary' : 'text-text-primary'}`}
              >
                {faq.question}
              </span>
              <div
                className={`flex-shrink-0 ml-4 transition-transform duration-200 {openIndex === index ? 'text-primary' : 'text-text-muted'}`}
              >
                {openIndex === index ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </div>
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out {
                openIndex === index ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="p-4 pt-0 text-sm text-text-secondary leading-relaxed">
                {faq.answer}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default FAQAccordion;
