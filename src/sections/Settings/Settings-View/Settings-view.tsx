import React from "react";
import ProfileSettings from "../ProfileSettings";
import PreferencesSettings from "../PreferencesSettings";
import { mockUser } from "../../../data/mockData";

const SettingsView: React.FC = () => {
  return (
    <div className="flex flex-col gap-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-text-primary m-0">
          Account Settings
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex flex-col gap-6">
          <ProfileSettings user={mockUser} />
        </div>
        <div className="flex flex-col gap-6">
          <PreferencesSettings />
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
