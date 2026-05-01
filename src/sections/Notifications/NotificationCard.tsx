import React from "react";
import Card from "../../components/Card";
import type { Notification } from "../../../types/global-types";
import { AlertCircle, Info, Settings, CheckCircle2 } from "lucide-react";

interface NotificationCardProps {
  notification: Notification;
  onMarkRead?: (id: string) => void;
}

const getIconForType = (type: string) => {
  switch (type) {
    case "alert":
      return <AlertCircle size={20} className="text-danger" />;
    case "info":
      return <Info size={20} className="text-info" />;
    case "system":
      return <Settings size={20} className="text-text-secondary" />;
    case "success":
      return <CheckCircle2 size={20} className="text-success" />;
    default:
      return <Info size={20} />;
  }
};

const getBgForType = (type: string) => {
  switch (type) {
    case "alert":
      return "bg-danger-light";
    case "info":
      return "bg-info-light";
    case "system":
      return "bg-bg";
    case "success":
      return "bg-success-light";
    default:
      return "bg-bg";
  }
};

const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onMarkRead,
}) => {
  return (
    <Card
      padding="md"
      className={`relative transition-all duration-200 ${
        !notification.isRead
          ? "border-primary/30 bg-primary-light/10 shadow-md"
          : "opacity-80"
      }`}
    >
      {!notification.isRead && (
        <div className="absolute top-6 right-6 w-2.5 h-2.5 rounded-full bg-primary" />
      )}

      <div className="flex gap-4">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${getBgForType(
            notification.type
          )}`}
        >
          {getIconForType(notification.type)}
        </div>

        <div className="flex-1 min-w-0 pr-8">
          <div className="flex items-center justify-between mb-1">
            <h4
              className={`text-base font-bold m-0 ${
                !notification.isRead ? "text-text-primary" : "text-text-secondary"
              }`}
            >
              {notification.title}
            </h4>
          </div>
          <p className="text-sm text-text-muted mb-3 leading-relaxed">
            {notification.message}
          </p>
          <div className="flex items-center gap-2 text-xs font-medium text-text-muted">
            <span>{notification.time}</span>
            <span>•</span>
            <span>{notification.date}</span>
          </div>
        </div>
      </div>

      {!notification.isRead && onMarkRead && (
        <div className="mt-4 pl-16 flex justify-start">
          <button
            className="text-sm font-semibold text-primary hover:text-primary-hover transition-colors bg-transparent border-none cursor-pointer"
            onClick={() => onMarkRead(notification.id)}
          >
            Mark as read
          </button>
        </div>
      )}
    </Card>
  );
};

export default NotificationCard;
