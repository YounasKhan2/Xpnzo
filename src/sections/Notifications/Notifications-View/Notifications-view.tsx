import React, { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../../db/db";
import NotificationCard from "../NotificationCard";
import Button from "../../../components/Button";
import { CheckCheck, Bell } from "lucide-react";
import type { NotificationFilter } from "../../../../types/Notifications-types";

const NotificationsView: React.FC = () => {
  const notifications = useLiveQuery(() =>
    db.notifications.orderBy("updatedAt").reverse().toArray()
  );

  const [filter, setFilter] = useState<NotificationFilter["type"]>("all");

  const handleMarkRead = async (localId: number) => {
    await db.notifications.update(localId, { isRead: true, updatedAt: Date.now() });
  };

  const handleMarkAllRead = async () => {
    if (!notifications) return;
    const unread = notifications.filter((n) => !n.isRead);
    await Promise.all(
      unread.map((n) =>
        db.notifications.update(n.localId!, { isRead: true, updatedAt: Date.now() })
      )
    );
  };

  const filteredNotifications = (notifications ?? []).filter((n) => {
    if (filter === "unread")  return !n.isRead;
    if (filter === "alerts")  return n.type === "alert";
    if (filter === "system")  return n.type === "system";
    return true;
  });

  const unreadCount = (notifications ?? []).filter((n) => !n.isRead).length;

  // Loading skeleton
  if (!notifications) {
    return (
      <div className="flex flex-col gap-6 opacity-50 animate-pulse max-w-4xl mx-auto">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-28 bg-gray-200 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-text-primary m-0">Notifications</h2>
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

      {/* Filter tabs */}
      <div className="flex gap-2 p-1 bg-card border border-border rounded-lg w-fit">
        {(["all", "unread", "alerts", "system"] as const).map((f) => (
          <button
            key={f}
            className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors capitalize ${
              filter === f
                ? "bg-primary-light text-primary"
                : "text-text-secondary hover:text-text-primary hover:bg-bg"
            }`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="flex flex-col gap-4">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <NotificationCard
              key={notification.localId}
              notification={notification}
              onMarkRead={handleMarkRead}
            />
          ))
        ) : (
          <div className="text-center py-16 flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-bg flex items-center justify-center">
              <Bell size={28} className="text-text-muted" />
            </div>
            <div>
              <p className="font-semibold text-text-primary m-0">All caught up!</p>
              <p className="text-sm text-text-muted mt-1">
                {filter === "unread"
                  ? "No unread notifications."
                  : "No notifications here yet."}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsView;
