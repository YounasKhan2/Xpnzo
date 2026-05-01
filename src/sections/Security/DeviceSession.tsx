import React from "react";
import Card from "../../components/Card";
import Badge from "../../components/Badge";
import type { LoginActivity } from "../../../types/global-types";
import { Monitor, Smartphone } from "lucide-react";

interface DeviceSessionProps {
  session: LoginActivity;
  onRevoke: (id: string) => void;
}

const DeviceSession: React.FC<DeviceSessionProps> = ({ session, onRevoke }) => {
  const isMobile =
    session.device.toLowerCase().includes("iphone") ||
    session.device.toLowerCase().includes("android");

  return (
    <Card padding="md" className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-bg flex items-center justify-center text-text-secondary flex-shrink-0">
          {isMobile ? <Smartphone size={20} /> : <Monitor size={20} />}
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-base font-bold text-text-primary m-0">
              {session.device}
            </h4>
            {session.isCurrent && (
              <Badge variant="success" size="sm">
                Current Session
              </Badge>
            )}
          </div>
          <p className="text-sm text-text-muted m-0">
            {session.location} • {session.ip}
          </p>
          <p className="text-xs text-text-muted mt-1 m-0">
            Last active: {session.date}
          </p>
        </div>
      </div>

      {!session.isCurrent && (
        <button
          onClick={() => onRevoke(session.id)}
          className="text-sm font-semibold text-danger hover:text-red-700 bg-transparent border-none cursor-pointer transition-colors"
        >
          Revoke
        </button>
      )}
    </Card>
  );
};

export default DeviceSession;
