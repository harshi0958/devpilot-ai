import Sidebar from "@/components/dashboard/Sidebar";
import TopNavbar from "@/components/dashboard/TopNavbar";
import WelcomeBanner from "@/components/dashboard/WelcomeBanner";
import StatsCards from "@/components/dashboard/StatsCards";
import RecentProjects from "@/components/dashboard/RecentProjects";
import AgentStatus from "@/components/dashboard/AgentStatus";
import ActivityTimeline from "@/components/dashboard/ActivityTimeline";
import QuickActions from "@/components/dashboard/QuickActions";
import AnalyticsSection from "@/components/dashboard/AnalyticsSection";
import RecentFiles from "@/components/dashboard/RecentFiles";
import WorkspaceHealth from "@/components/dashboard/WorkspaceHealth";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-[#070B14]">
      <Sidebar />

      <div className="flex-1">
        <TopNavbar />
        

        <main className="p-8">
          <WelcomeBanner />
          <StatsCards />
          <AnalyticsSection />
          <RecentProjects />
          <RecentFiles />
          <WorkspaceHealth />
          <AgentStatus />
          <div className="mt-12 grid gap-8 lg:grid-cols-3">

  <div className="lg:col-span-2">
    <ActivityTimeline />
  </div>

  <div>
    <QuickActions />
  </div>

</div>
          
        </main>
      </div>
    </div>
  );
}