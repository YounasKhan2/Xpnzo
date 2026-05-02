import React, { useState } from "react";
import Card from "../../../components/Card";
import Toggle from "../../../components/Toggle";
import PasswordChange from "../PasswordChange";
import DeviceSession from "../DeviceSession";
import { authService } from "../../../services/auth";
import type { LoginActivity } from "../../../../types/global-types";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../../db/db";
import { syncEngine } from "../../../db/syncEngine";

const SecurityView: React.FC = () => {
  // Single-row settings store — always localId = 1
  const settings = useLiveQuery(async () => {
    const all = await db.userSettings.toArray();
    return all[0] ?? null;
  });

  const [sessions, setSessions] = useState<LoginActivity[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);

  React.useEffect(() => {
    const loadSessions = async () => {
      try {
        const response = await authService.getSessions();
        const mappedSessions: LoginActivity[] = response.sessions.map(
          (s: {
            $id: string;
            osName: string;
            clientName: string;
            countryName: string;
            ip: string;
            $createdAt: string;
            current: boolean;
          }) => ({
            id: s.$id,
            device: `${s.osName || "Unknown OS"} - ${s.clientName || "Unknown Browser"}`,
            location: s.countryName || "Unknown Location",
            ip: s.ip,
            date: new Date(s.$createdAt).toLocaleString(),
            isCurrent: s.current,
          }),
        );
        // Sort current session to top
        mappedSessions.sort((a, b) => (b.isCurrent ? 1 : 0) - (a.isCurrent ? 1 : 0));
        setSessions(mappedSessions);
      } catch (err) {
        console.error("Failed to load sessions:", err);
      } finally {
        setLoadingSessions(false);
      }
    };
    loadSessions();
  }, []);

  const handleToggle = async (key: keyof Pick<typeof settings, "twoFactorAuth" | "biometricLogin" | "loginAlerts">, value: boolean) => {
    if (!settings?.localId) return;
    await db.userSettings.update(settings.localId, {
      [key]: value,
      updatedAt: Date.now(),
    });
    await db.syncQueue.add({
      action: "update",
      collection: "userSettings",
      payload: { ...settings, [key]: value, localId: settings.localId },
      retryCount: 0,
      timestamp: Date.now(),
    });
    syncEngine.startSync();
  };

  const handleRevokeSession = async (id: string) => {
    try {
      await authService.deleteSession(id);
      setSessions((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Failed to revoke session:", err);
      alert("Failed to revoke session. Please try again.");
    }
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
                  checked={settings?.twoFactorAuth ?? false}
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
                  checked={settings?.biometricLogin ?? false}
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
                  checked={settings?.loginAlerts ?? true}
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
          {loadingSessions ? (
            <p className="text-sm text-text-muted">Loading sessions...</p>
          ) : (
            sessions.map((session) => (
              <DeviceSession
                key={session.id}
                session={session}
                onRevoke={handleRevokeSession}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SecurityView;
