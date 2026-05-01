import React from "react";
import Card from "../../components/Card";
import Toggle from "../../components/Toggle";
import type { LocalUserSettings } from "../../db/db";
import { db } from "../../db/db";
import { useTheme } from "../../lib/useTheme";

interface PreferencesSettingsProps {
  settings: LocalUserSettings | null;
}

type BooleanSettingsKey = keyof Pick<
  LocalUserSettings,
  "emailDigest" | "budgetAlerts" | "marketingEmails"
>;

const PreferencesSettings: React.FC<PreferencesSettingsProps> = ({ settings }) => {
  const [isDark, setIsDark] = useTheme();

  const patch = async (key: BooleanSettingsKey, value: boolean) => {
    if (!settings?.localId) return;
    await db.userSettings.update(settings.localId, { [key]: value, updatedAt: Date.now() });
  };

  const val = (key: BooleanSettingsKey, fallback: boolean) =>
    settings ? settings[key] : fallback;

  return (
    <Card padding="lg" className="h-full">
      <h3 className="text-lg font-bold text-text-primary m-0 mb-6">App Preferences</h3>

      <div className="flex flex-col gap-6">
        {/* Display */}
        <div>
          <h4 className="text-base font-semibold text-text-primary mb-3">Display</h4>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-text-primary m-0">Dark Mode</p>
                <p className="text-sm text-text-muted mt-0.5">Toggle dark theme for the application</p>
              </div>
              {/* Dark mode is handled by useTheme hook */}
              <Toggle checked={isDark} onChange={setIsDark} />
            </div>

            <div className="flex flex-col gap-1.5 mt-2">
              <label className="text-sm font-semibold text-text-primary font-body">Base Currency</label>
              <select
                value={settings?.currency ?? "USD"}
                onChange={async (e) => {
                  if (!settings?.localId) return;
                  await db.userSettings.update(settings.localId, {
                    currency: e.target.value,
                    updatedAt: Date.now(),
                  });
                }}
                className="w-full py-2.5 px-3.5 border-[1.5px] border-border rounded-md bg-bg text-text-primary text-base font-body outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/10"
              >
                <option value="USD">USD ($) - US Dollar</option>
                <option value="EUR">EUR (€) - Euro</option>
                <option value="GBP">GBP (£) - British Pound</option>
                <option value="PKR">PKR (₨) - Pakistani Rupee</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="pt-6 border-t border-border">
          <h4 className="text-base font-semibold text-text-primary mb-3">Notifications</h4>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-text-primary m-0">Email Digest</p>
                <p className="text-sm text-text-muted mt-0.5">Receive weekly summary of your expenses</p>
              </div>
              <Toggle
                checked={val("emailDigest", true)}
                onChange={(v) => patch("emailDigest", v)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-text-primary m-0">Budget Alerts</p>
                <p className="text-sm text-text-muted mt-0.5">Notify when you approach budget limits</p>
              </div>
              <Toggle
                checked={val("budgetAlerts", true)}
                onChange={(v) => patch("budgetAlerts", v)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-text-primary m-0">Marketing Emails</p>
                <p className="text-sm text-text-muted mt-0.5">Receive product updates and offers</p>
              </div>
              <Toggle
                checked={val("marketingEmails", false)}
                onChange={(v) => patch("marketingEmails", v)}
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PreferencesSettings;
