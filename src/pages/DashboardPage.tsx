import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatRupiah } from "@/components/utils/formatRupiah";
import { DashboardHeader } from "@/features/fragments/DashboardHeader";
import { OverviewChart } from "@/features/fragments/OverviewChart";
import { RecentActivity } from "@/features/fragments/RecentActivity";
import { useDashboardQueries } from "@/hooks/dashboard-queries";
import { Activity, DollarSign, Download, Users, Wrench } from "lucide-react";

const DashboardPage = () => {
  const { useStats } = useDashboardQueries();

  const { data: stats, isLoading, isError } = useStats();

  const growth = stats?.cards.revenue_growth || 0;

  const isPositive = growth >= 0;

  if (isLoading) return <div>Loading Dashboard...</div>;
  if (isError) return <div>Failed to load stats.</div>;

  const safeStats = stats || {
    cards: {
      total_revenue: 0,
      active_services: 0,
      pending_queue: 0,
      finished_jobs: 0,
    },
    chart_data: [],
    recent_activity: [],
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <DashboardHeader title="Dashboard Overview">
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </DashboardHeader>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Revenue (Month)
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatRupiah(stats?.cards.total_revenue || 0)}
            </div>

            <p
              className={`text-xs mt-1 ${isPositive ? "text-emerald-600" : "text-red-600"}`}
            >
              {isPositive ? "+" : ""}
              {growth.toFixed(1)}% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Repairs
            </CardTitle>
            <Activity className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {safeStats.cards.active_services}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently in progress
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Queue</CardTitle>
            <Wrench className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {safeStats.cards.pending_queue}
            </div>
            <p className="text-xs text-muted-foreground">
              Waiting for technician
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Finished Jobs</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              +{safeStats.cards.finished_jobs}
            </div>
            <p className="text-xs text-muted-foreground">
              Jobs completed this period
            </p>
          </CardContent>
        </Card>
      </div>

      {/* --- 2. CHART & RECENT ACTIVITY --- */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Grafik (Lebar: 4 kolom) */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>
              Total income from finished services per month.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <OverviewChart data={safeStats.chart_data} />{" "}
          </CardContent>
        </Card>

        {/* Recent Activity (Lebar: 3 kolom) */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest updates from technicians and admins.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecentActivity data={safeStats.recent_activity} />{" "}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
