import React from "react";
import Card from "../../components/Card";
import Toggle from "../../components/Toggle";

const PreferencesSettings: React.FC = () => {
  return (
    <Card padding="lg" className="h-full">
      <h3 className="text-lg font-bold text-text-primary m-0 mb-6">
        App Preferences
      </h3>

      <div className="flex flex-col gap-6">
        <div>
          <h4 className="text-base font-semibold text-text-primary mb-3">
            Display
          </h4>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-text-primary m-0">Dark Mode</p>
                <p className="text-sm text-text-muted mt-0.5">
                  Toggle dark theme for the application
                </p>
              </div>
              <Toggle checked={false} onChange={() => {}} />
            </div>

            <div className="flex flex-col gap-1.5 mt-2">
              <label className="text-sm font-semibold text-text-primary font-body">
                Base Currency
              </label>
              <select className="w-full py-2.5 px-3.5 border-[1.5px] border-border rounded-md bg-white text-base font-body outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/10">
                <option value="USD">USD () - US Dollar</option>
                <option value="EUR">EUR (€) - Euro</option>
                <option value="GBP">GBP (£) - British Pound</option>
              </select>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-border">
          <h4 className="text-base font-semibold text-text-primary mb-3">
            Notifications
          </h4>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-text-primary m-0">
                  Email Digest
                </p>
                <p className="text-sm text-text-muted mt-0.5">
                  Receive weekly summary of your expenses
                </p>
              </div>
              <Toggle checked={true} onChange={() => {}} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-text-primary m-0">
                  Budget Alerts
                </p>
                <p className="text-sm text-text-muted mt-0.5">
                  Notify when you approach budget limits
                </p>
              </div>
              <Toggle checked={true} onChange={() => {}} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-text-primary m-0">
                  Marketing Emails
                </p>
                <p className="text-sm text-text-muted mt-0.5">
                  Receive product updates and offers
                </p>
              </div>
              <Toggle checked={false} onChange={() => {}} />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PreferencesSettings;
