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
import RateLimitFallback from "@/features/fragments/RateLimitFallback";
import { RecentActivity } from "@/features/fragments/RecentActivity";
import { useDashboardQueries } from "@/hooks/dashboard-queries";
import { isAxiosError } from "axios";
import {
  Activity,
  DollarSign,
  Download,
  Users,
  Wrench,
  Wallet,
  ShoppingBag,
  Loader2,
} from "lucide-react";
import { useTranslation } from "react-i18next";

const DashboardPage = () => {
  const { t } = useTranslation();
  const { useStats } = useDashboardQueries();
  const { data: stats, isLoading, isError, error, refetch } = useStats();

  const revenueGrowth = stats?.cards.revenue_growth || 0;
  const isRevenuePositive = revenueGrowth >= 0;

  const profitGrowth = stats?.cards.profit_growth || 0;
  const isProfitPositive = profitGrowth >= 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">
          {t("dashboard.loading")}
        </span>
      </div>
    );
  }

  if (isError && !stats) {
    if (isAxiosError(error) && error.response?.status === 429) {
      const message = error.response?.data?.errors || "";
      const match = message.match(/(\d+)(?:s| seconds)/);
      const seconds = match ? parseInt(match[1]) : 60;

      return <RateLimitFallback seconds={seconds} onRetry={() => refetch()} />;
    }

    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
        <p className="text-destructive font-medium">
          {t("dashboard.error.title")}
        </p>
        <p className="text-sm text-muted-foreground">
          {isAxiosError(error) ? error.message : "Unknown error occurred"}
        </p>
        <Button variant="outline" onClick={() => refetch()}>
          {t("dashboard.error.btn")}
        </Button>
      </div>
    );
  }

  const safeStats = stats || {
    cards: {
      total_revenue: 0,
      profit: 0,
      active_services: 0,
      pending_queue: 0,
      finished_jobs: 0,
      products_sold: 0,
    },
    chart_data: [],
    recent_activity: [],
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <DashboardHeader title={t("dashboard.header.title")}>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          {t("dashboard.header.export_btn")}
        </Button>
      </DashboardHeader>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("dashboard.cards.revenue.title")}
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatRupiah(safeStats.cards.total_revenue)}
            </div>
            <p
              className={`text-xs mt-1 ${isRevenuePositive ? "text-emerald-600" : "text-red-600"}`}
            >
              {isRevenuePositive
                ? t("dashboard.cards.revenue.desc_positive", {
                    value: revenueGrowth.toFixed(1),
                  })
                : t("dashboard.cards.revenue.desc_negative", {
                    value: revenueGrowth.toFixed(1),
                  })}
            </p>
          </CardContent>
        </Card>

        {/* CARD 2: NET PROFIT */}
        <Card className="border-emerald-500/20 bg-emerald-50/10 dark:bg-emerald-950/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
              {t("dashboard.cards.profit.title")}
            </CardTitle>
            <Wallet className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {formatRupiah(safeStats.cards.profit)}
            </div>
            <p
              className={`text-xs mt-1 ${isProfitPositive ? "text-emerald-600" : "text-red-600"}`}
            >
              {isProfitPositive
                ? t("dashboard.cards.profit.desc_positive", {
                    value: profitGrowth.toFixed(1),
                  })
                : t("dashboard.cards.profit.desc_negative", {
                    value: profitGrowth.toFixed(1),
                  })}
            </p>
          </CardContent>
        </Card>

        {/* CARD 3: PRODUCTS SOLD  */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("dashboard.cards.products.title")}
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              +{safeStats.cards.products_sold}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("dashboard.cards.products.desc")}
            </p>
          </CardContent>
        </Card>

        {/* CARD 4: ACTIVE REPAIRS */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("dashboard.cards.active_repairs.title")}
            </CardTitle>
            <Activity className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {safeStats.cards.active_services}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("dashboard.cards.active_repairs.desc")}
            </p>
          </CardContent>
        </Card>

        {/* CARD 5: PENDING QUEUE */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("dashboard.cards.pending_queue.title")}
            </CardTitle>
            <Wrench className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {safeStats.cards.pending_queue}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("dashboard.cards.pending_queue.desc")}
            </p>
          </CardContent>
        </Card>

        {/* CARD 6: FINISHED JOBS */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("dashboard.cards.finished_jobs.title")}
            </CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              +{safeStats.cards.finished_jobs}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("dashboard.cards.finished_jobs.desc")}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>{t("dashboard.chart.title")}</CardTitle>
            <CardDescription>{t("dashboard.chart.desc")}</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <OverviewChart data={safeStats.chart_data} />
          </CardContent>
        </Card>

        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>{t("dashboard.activity.title")}</CardTitle>
            <CardDescription>{t("dashboard.activity.desc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentActivity data={safeStats.recent_activity} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
