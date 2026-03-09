import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  FileText,
  FileSpreadsheet,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { pdf } from "@react-pdf/renderer";
import { DashboardReportPDF } from "@/features/components/DashboardReportPDF";
import { motion, type Variants } from "framer-motion";
import { DashboardSkeleton } from "@/features/fragments/Skeleton";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const DashboardPage = () => {
  const { t } = useTranslation();
  const { useStats } = useDashboardQueries();
  const { data: stats, isLoading, isError, error, refetch } = useStats();

  const revenueGrowth = stats?.cards.revenue_growth || 0;
  const isRevenuePositive = revenueGrowth >= 0;

  const profitGrowth = stats?.cards.profit_growth || 0;
  const isProfitPositive = profitGrowth >= 0;

  const handleExportCSV = () => {
    if (!stats?.chart_data || stats.chart_data.length === 0) {
      toast.error(t("dashboard.export.no_data"));
      return;
    }

    try {
      const headers = ["Date", "Total Revenue"];
      const rows = stats.chart_data.map((item) => [item.name, item.total]);

      const csvContent = [
        headers.join(","),
        ...rows.map((row) => row.join(",")),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `Dashboard_Chart_${new Date().getTime()}.csv`,
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(t("dashboard.export.csv_success"));
    } catch {
      toast.error(t("dashboard.export.csv_failed"));
    }
  };

  const handleExportPDF = async () => {
    if (!stats) {
      toast.error(t("dashboard.export.no_data"));
      return;
    }

    const toastId = toast.loading(t("dashboard.export.generating_pdf"));
    try {
      const pdfTranslations = {
        title: t("dashboard.report_pdf.title"),
        printed_on: t("dashboard.report_pdf.printed_on"),
        revenue: t("dashboard.report_pdf.revenue"),
        profit: t("dashboard.report_pdf.profit"),
        products_sold: t("dashboard.report_pdf.products_sold"),
        active_repairs: t("dashboard.report_pdf.active_repairs"),
        table_title: t("dashboard.report_pdf.table_title"),
        th_date: t("dashboard.report_pdf.th_date"),
        th_user: t("dashboard.report_pdf.th_user"),
        th_action: t("dashboard.report_pdf.th_action"),
        th_desc: t("dashboard.report_pdf.th_desc"),
      };

      const blob = await pdf(
        <DashboardReportPDF stats={stats} translations={pdfTranslations} />,
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Business_Report_${new Date().getTime()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(t("dashboard.export.pdf_success"), { id: toastId });
    } catch (error) {
      console.error("PDF Export Error:", error);
      toast.error(t("dashboard.export.pdf_failed"), { id: toastId });
    }
  };

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError && !stats) {
    if (isAxiosError(error) && error.response?.status === 429) {
      const message = error.response?.data?.errors || "";
      const match = message.match(/(\d+)(?:s| seconds)/);
      const seconds = match ? parseInt(match[1]) : 60;

      return <RateLimitFallback seconds={seconds} onRetry={() => refetch()} />;
    }

    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4 px-4 text-center">
        <p className="text-destructive font-bold text-lg">
          {t("dashboard.error.title")}
        </p>
        <p className="text-sm text-muted-foreground max-w-md">
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
    <motion.div
      className="space-y-6 sm:space-y-8 pb-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <DashboardHeader title={t("dashboard.header.title")}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="w-full sm:w-auto shrink-0 cursor-pointer text-foreground shadow-sm h-9 sm:h-10"
              >
                <Download className="mr-2 h-4 w-4" />
                {t("dashboard.export.btn")}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 sm:w-56">
              <DropdownMenuItem
                onClick={handleExportPDF}
                className="cursor-pointer py-2.5"
              >
                <FileText className="mr-3 h-4 w-4 text-red-500" />
                {t("dashboard.export.pdf")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleExportCSV}
                className="cursor-pointer py-2.5"
              >
                <FileSpreadsheet className="mr-3 h-4 w-4 text-emerald-600" />
                {t("dashboard.export.csv")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </DashboardHeader>
      </motion.div>

      {/* STATS CARDS GRID */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {/* CARD 1: REVENUE */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">
                {t("dashboard.cards.revenue.title")}
              </CardTitle>
              <div className="p-2 bg-primary/10 rounded-full">
                <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold tracking-tight">
                {formatRupiah(safeStats.cards.total_revenue)}
              </div>
              <p
                className={`text-[10px] sm:text-xs mt-1.5 font-medium ${isRevenuePositive ? "text-emerald-600" : "text-red-600"}`}
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
        </motion.div>

        {/* CARD 2: NET PROFIT */}
        <motion.div variants={itemVariants}>
          <Card className="border-emerald-500/30 bg-emerald-50/30 dark:border-emerald-900/40 dark:bg-emerald-950/20 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-emerald-800 dark:text-emerald-400">
                {t("dashboard.cards.profit.title")}
              </CardTitle>
              <div className="p-2 bg-emerald-500/20 rounded-full">
                <Wallet className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold tracking-tight text-emerald-700 dark:text-emerald-400">
                {formatRupiah(safeStats.cards.profit)}
              </div>
              <p
                className={`text-[10px] sm:text-xs mt-1.5 font-medium ${isProfitPositive ? "text-emerald-600" : "text-red-600"}`}
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
        </motion.div>

        {/* CARD 3: PRODUCTS SOLD  */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">
                {t("dashboard.cards.products.title")}
              </CardTitle>
              <div className="p-2 bg-purple-500/10 rounded-full">
                <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold tracking-tight">
                +{safeStats.cards.products_sold}
              </div>
              <p className="text-[10px] sm:text-xs text-muted-foreground mt-1.5 font-medium">
                {t("dashboard.cards.products.desc")}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* CARD 4: ACTIVE REPAIRS */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">
                {t("dashboard.cards.active_repairs.title")}
              </CardTitle>
              <div className="p-2 bg-blue-500/10 rounded-full">
                <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold tracking-tight">
                {safeStats.cards.active_services}
              </div>
              <p className="text-[10px] sm:text-xs text-muted-foreground mt-1.5 font-medium">
                {t("dashboard.cards.active_repairs.desc")}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* CARD 5: PENDING QUEUE */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">
                {t("dashboard.cards.pending_queue.title")}
              </CardTitle>
              <div className="p-2 bg-orange-500/10 rounded-full">
                <Wrench className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold tracking-tight">
                {safeStats.cards.pending_queue}
              </div>
              <p className="text-[10px] sm:text-xs text-muted-foreground mt-1.5 font-medium">
                {t("dashboard.cards.pending_queue.desc")}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* CARD 6: FINISHED JOBS */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">
                {t("dashboard.cards.finished_jobs.title")}
              </CardTitle>
              <div className="p-2 bg-green-500/10 rounded-full">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold tracking-tight">
                +{safeStats.cards.finished_jobs}
              </div>
              <p className="text-[10px] sm:text-xs text-muted-foreground mt-1.5 font-medium">
                {t("dashboard.cards.finished_jobs.desc")}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* BOTTOM GRID (CHART & ACTIVITY) */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-6">
        <motion.div
          variants={itemVariants}
          className="lg:col-span-4 flex flex-col"
        >
          <Card className="flex-1 shadow-sm border-border/60">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg sm:text-xl">
                {t("dashboard.chart.title")}
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                {t("dashboard.chart.desc")}
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-0 sm:pl-2">
              <OverviewChart data={safeStats.chart_data} />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="lg:col-span-2 flex flex-col"
        >
          <Card className="flex-1 shadow-sm border-border/60">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg sm:text-xl">
                {t("dashboard.activity.title")}
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                {t("dashboard.activity.desc")}
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <RecentActivity data={safeStats.recent_activity} />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DashboardPage;
