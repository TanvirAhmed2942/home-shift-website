import React, { useState, useEffect } from "react";
import { Bell, X, Check, Eye, Trash2, CheckCheck } from "lucide-react";
import {
  inAppNotificationManager,
  InAppNotification,
  notificationManager,
} from "../../utils/notificationManager";
import { formatTimeAgo } from "../../utils/performance";

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<InAppNotification[]>([]);
  const [showPermissionPrompt, setShowPermissionPrompt] = useState(false);

  // Subscribe to notifications
  useEffect(() => {
    const unsubscribe = inAppNotificationManager.subscribe((notifs) => {
      setNotifications(notifs);
    });

    // Check if notifications are supported but not enabled
    if (
      notificationManager.isSupported() &&
      !notificationManager.hasPermission()
    ) {
      setShowPermissionPrompt(true);
    }

    return unsubscribe;
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAsRead = (id: string) => {
    inAppNotificationManager.markAsRead(id);
  };

  const handleMarkAllAsRead = () => {
    inAppNotificationManager.markAllAsRead();
  };

  const handleDelete = (id: string) => {
    inAppNotificationManager.delete(id);
  };

  const handleClearAll = () => {
    if (confirm("Clear all notifications?")) {
      inAppNotificationManager.clearAll();
    }
  };

  const handleEnableNotifications = async () => {
    const granted = await notificationManager.requestPermission();
    if (granted) {
      setShowPermissionPrompt(false);
      // Notifications are now enabled using Web Notification API
      console.log("[NotificationCenter] Browser notifications enabled");
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "job-assigned":
        return "🚚";
      case "job-started":
        return "📦";
      case "job-completed":
        return "✅";
      case "driver-approaching":
        return "🚗";
      case "driver-arrived":
        return "📍";
      case "payment-received":
        return "💰";
      case "new-message":
        return "💬";
      case "review-request":
        return "⭐";
      case "booking-confirmed":
        return "✨";
      default:
        return "🔔";
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-white/10 rounded-xl transition-all cursor-pointer flex items-center justify-center"
        aria-label="Notifications"
      >
        <Bell className="w-6 h-6 text-white" />
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          </div>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown Panel */}
          <div className="absolute right-0 top-full mt-2 w-96 max-w-[calc(100vw-2rem)] backdrop-blur-xl bg-slate-800/95 border border-white/20 rounded-2xl shadow-2xl z-50 max-h-[600px] flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-white flex items-center justify-center gap-2">
                  <Bell className="w-5 h-5 text-blue-400" />
                  Notifications
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white/10 rounded-lg transition-all flex items-center justify-center"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-white/70" />
                </button>
              </div>

              {/* Actions */}
              {notifications.length > 0 && (
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllAsRead}
                      className="px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-sm rounded-lg transition-all flex items-center gap-1"
                    >
                      <CheckCheck className="w-4 h-4" />
                      Mark all read
                    </button>
                  )}
                  <button
                    onClick={handleClearAll}
                    className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 text-sm rounded-lg transition-all flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear all
                  </button>
                </div>
              )}
            </div>

            {/* Permission Prompt */}
            {showPermissionPrompt && (
              <div className="p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-b border-white/10">
                <div className="flex items-start gap-3">
                  <Bell className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-white font-medium text-sm mb-2">
                      Enable push notifications to get real-time updates!
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleEnableNotifications}
                        className="px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-sm rounded-lg transition-all"
                      >
                        Enable
                      </button>
                      <button
                        onClick={() => setShowPermissionPrompt(false)}
                        className="px-3 py-1.5 text-white/70 hover:text-white text-sm transition-all"
                      >
                        Maybe later
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="w-12 h-12 text-white/30 mx-auto mb-3" />
                  <p className="text-white/70">No notifications yet</p>
                  <p className="text-white/50 text-sm mt-1">
                    You'll see updates here
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-white/10">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 transition-all hover:bg-white/5 ${
                        !notification.read ? "bg-blue-500/10" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div className="flex-shrink-0 text-2xl">
                          {getNotificationIcon(notification.type)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4
                              className={`font-medium ${
                                !notification.read
                                  ? "text-white"
                                  : "text-white/80"
                              }`}
                            >
                              {notification.title}
                            </h4>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0 mt-1.5" />
                            )}
                          </div>
                          <p className="text-white/70 text-sm mb-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-white/50 text-xs">
                              {formatTimeAgo(notification.timestamp)}
                            </span>
                            <div className="flex items-center gap-1">
                              {!notification.read && (
                                <button
                                  onClick={() =>
                                    handleMarkAsRead(notification.id)
                                  }
                                  className="p-1 hover:bg-white/10 rounded transition-all"
                                  title="Mark as read"
                                >
                                  <Check className="w-4 h-4 text-white/70" />
                                </button>
                              )}
                              <button
                                onClick={() => handleDelete(notification.id)}
                                className="p-1 hover:bg-white/10 rounded transition-all"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4 text-white/70" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
