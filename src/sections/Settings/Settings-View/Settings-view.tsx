import React from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../../db/db";
import ProfileSettings from "../ProfileSettings";
import PreferencesSettings from "../PreferencesSettings";

const SettingsView: React.FC = () => {
  // Single-row settings store — always localId = 1
  const settings = useLiveQuery(async () => {
    const all = await db.userSettings.toArray();
    return all[0] ?? null;
  });

  return (
    <div className="flex flex-col gap-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-text-primary m-0">Account Settings</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex flex-col gap-6">
          <ProfileSettings key={settings?.localId ?? 'new'} settings={settings ?? null} />
        </div>
        <div className="flex flex-col gap-6">
          <PreferencesSettings settings={settings ?? null} />
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
