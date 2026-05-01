import React, { useState } from "react";
import Card from "../../../components/Card";
import Toggle from "../../../components/Toggle";
import PasswordChange from "../PasswordChange";
import DeviceSession from "../DeviceSession";
import { mockLoginActivity } from "../../../data/mockData";

const SecurityView: React.FC = () => {
  const [settings, setSettings] = useState({
    twoFactorAuth: true,
    biometricLogin: false,
    loginAlerts: true,
  });

  const handleToggle = (key: keyof typeof settings, value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleRevokeSession = (id: string) => {
    console.log("Revoking session:", id);
    // In a real app, make API call to revoke session
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      <h2 className="text-xl font-bold text-text-primary m-0">
        Security & Privacy
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex flex-col gap-6">
          <PasswordChange />
        </div>

        <div className="flex flex-col gap-6">
          <Card padding="md">
            <h3 className="text-lg font-bold text-text-primary m-0 mb-4">
              Security Preferences
            </h3>
            <div className="flex flex-col gap-4 divide-y divide-border">
              <div className="flex items-center justify-between py-2">
                <div>
                  <h4 className="text-base font-semibold text-text-primary m-0">
                    Two-Factor Authentication
                  </h4>
                  <p className="text-sm text-text-muted mt-1">
                    Add an extra layer of security to your account.
                  </p>
                </div>
                <Toggle
                  checked={settings.twoFactorAuth}
                  onChange={(v) => handleToggle("twoFactorAuth", v)}
                />
              </div>
              <div className="flex items-center justify-between py-4">
                <div>
                  <h4 className="text-base font-semibold text-text-primary m-0">
                    Biometric Login
                  </h4>
                  <p className="text-sm text-text-muted mt-1">
                    Use FaceID or Fingerprint on supported devices.
                  </p>
                </div>
                <Toggle
                  checked={settings.biometricLogin}
                  onChange={(v) => handleToggle("biometricLogin", v)}
                />
              </div>
              <div className="flex items-center justify-between py-4">
                <div>
                  <h4 className="text-base font-semibold text-text-primary m-0">
                    Login Alerts
                  </h4>
                  <p className="text-sm text-text-muted mt-1">
                    Get notified when someone logs into your account.
                  </p>
                </div>
                <Toggle
                  checked={settings.loginAlerts}
                  onChange={(v) => handleToggle("loginAlerts", v)}
                />
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-2">
        <h3 className="text-lg font-bold text-text-primary m-0">
          Active Sessions
        </h3>
        <p className="text-sm text-text-muted -mt-2 mb-2">
          These devices are currently logged into your account.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockLoginActivity.map((session) => (
            <DeviceSession
              key={session.id}
              session={session}
              onRevoke={handleRevokeSession}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SecurityView;
