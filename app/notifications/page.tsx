import Sidebar from "@/components/dashboard/Sidebar";
import TopNavbar from "@/components/dashboard/TopNavbar";

import NotificationHeader from "@/components/notifications/NotificationHeader";
import NotificationList from "@/components/notifications/NotificationList";

export default function NotificationsPage() {
  return (
    <div className="flex min-h-screen bg-[#070B14]">

      <Sidebar />

      <div className="flex-1">

        <TopNavbar />

        <main className="p-8">

          <NotificationHeader />

          <NotificationList />

        </main>

      </div>

    </div>
  );
}