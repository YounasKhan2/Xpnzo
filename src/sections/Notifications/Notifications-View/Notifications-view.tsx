import React, { useState } from "react";
import NotificationCard from "../NotificationCard";
import Button from "../../../components/Button";
import { mockNotifications } from "../../../data/mockData";
import { CheckCheck } from "lucide-react";
import type { NotificationFilter } from "../../../../types/Notifications-types";

const NotificationsView: React.FC = () => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState<NotificationFilter["type"]>("all");

  const handleMarkRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.isRead;
    if (filter === "alerts") return n.type === "alert";
    if (filter === "system") return n.type === "system";
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-text-primary m-0">
            Notifications
          </h2>
          {unreadCount > 0 && (
            <span className="bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {unreadCount} New
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          icon={<CheckCheck size={16} />}
          onClick={handleMarkAllRead}
          disabled={unreadCount === 0}
        >
          Mark all as read
        </Button>
      </div>

      <div className="flex gap-2 p-1 bg-card border border-border rounded-lg w-fit">
        {(["all", "unread", "alerts", "system"] as const).map((f) => (
          <button
            key={f}
            className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors capitalize {
              filter === f 
                ? 'bg-primary-light text-primary' 
                : 'text-text-secondary hover:text-text-primary hover:bg-bg'
            }`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onMarkRead={handleMarkRead}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-text-muted">No notifications found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsView;
