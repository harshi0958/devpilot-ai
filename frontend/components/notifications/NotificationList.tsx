"use client";

import { useState } from "react";
import NotificationCard from "./NotificationCard";
import EmptyNotification from "./EmptyNotification";

interface Notification {
  id: number;
  title: string;
  description: string;
  time: string;
  isRead: boolean;
}

const initialNotifications: Notification[] = [
  {
    id: 1,
    title: "Frontend AI completed Navbar.tsx",
    description: "Navbar implementation has been completed successfully.",
    time: "2 min ago",
    isRead: false,
  },
  {
    id: 2,
    title: "Backend AI generated Authentication API",
    description: "Authentication endpoints are ready for testing.",
    time: "7 min ago",
    isRead: false,
  },
  {
    id: 3,
    title: "Testing AI executed 128 test cases",
    description: "All automated tests finished successfully.",
    time: "24 min ago",
    isRead: true,
  },
  {
    id: 4,
    title: "Deployment queued",
    description: "Production deployment is waiting in queue.",
    time: "1 hour ago",
    isRead: true,
  },
];

export default function NotificationList() {
  const [notifications, setNotifications] =
    useState(initialNotifications);

  const deleteNotification = (id: number) => {
    setNotifications((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, isRead: true }
          : item
      )
    );
  };

  if (notifications.length === 0) {
    return <EmptyNotification />;
  }

  return (
    <div className="space-y-4">

      {notifications.map((item) => (
        <NotificationCard
          key={item.id}
          title={item.title}
          description={item.description}
          time={item.time}
          isRead={item.isRead}
          onDelete={() =>
            deleteNotification(item.id)
          }
          onMarkRead={() =>
            markAsRead(item.id)
          }
        />
      ))}

    </div>
  );
}