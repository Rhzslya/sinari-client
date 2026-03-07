import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useServiceLogQueries } from "@/hooks/repair-log-queries";
import { format } from "date-fns";
import { AlertCircle, History, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion, type Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

export const ServiceLogTimeline = ({ serviceId }: { serviceId: number }) => {
  const { t } = useTranslation();
  const { useLogList } = useServiceLogQueries();

  const { data: logs, isLoading, isError } = useLogList({ id: serviceId });

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return "-";
    return format(new Date(date), "dd MMM yyyy, HH:mm");
  };

  return (
    <Card className="mt-4 sm:mt-6 border shadow-sm">
      <CardHeader className="py-3 sm:py-4 border-b">
        <CardTitle className="text-sm sm:text-base flex items-center gap-2">
          <History className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />{" "}
          {t("activity_log.title")}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-4 sm:p-6">
        {isLoading ? (
          <div className="space-y-3 sm:space-y-4">
            <Skeleton className="h-16 sm:h-20 w-full rounded-md" />
            <Skeleton className="h-16 sm:h-20 w-full rounded-md" />
            <Skeleton className="h-16 sm:h-20 w-full rounded-md" />
          </div>
        ) : isError ? (
          <div className="text-center py-6 sm:py-8 text-destructive bg-destructive/5 rounded-lg border border-destructive/20 mt-2">
            <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 opacity-80" />
            <p className="text-xs sm:text-sm font-medium">
              {t("activity_log.error_load")}
            </p>
          </div>
        ) : !logs || logs.length === 0 ? (
          <div className="text-center py-6 sm:py-10 text-muted-foreground">
            <History className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 opacity-20" />
            <p className="text-xs sm:text-sm">{t("activity_log.empty_desc")}</p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-3 sm:gap-4 max-h-75 sm:max-h-100 overflow-y-auto pr-1 sm:pr-2 
                        [&::-webkit-scrollbar]:w-1
                        [&::-webkit-scrollbar]:h-1
                        [&::-webkit-scrollbar-track]:bg-transparent
                        [&::-webkit-scrollbar-thumb]:bg-primary/20 
                        [&::-webkit-scrollbar-thumb]:rounded-full
                        hover:[&::-webkit-scrollbar-thumb]:bg-primary"
          >
            {logs.map((log) => (
              <motion.div
                variants={itemVariants}
                key={log.id}
                className="p-3 sm:p-4 border border-border/60 rounded-lg bg-muted/10 hover:bg-muted/30 transition-colors duration-300"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1.5 sm:gap-2 mb-2 sm:mb-2.5">
                  <div className="flex items-center gap-1.5 sm:gap-2 font-semibold text-foreground">
                    <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground shrink-0" />
                    <span className="text-xs sm:text-sm truncate max-w-37.5 sm:max-w-50">
                      {log.user.username}
                    </span>
                    <Badge
                      variant="outline"
                      className="text-[9px] sm:text-[10px] uppercase px-1.5 py-0.5 sm:py-0.75 leading-none tracking-wider bg-background shrink-0"
                    >
                      {log.user.role}
                    </Badge>
                  </div>
                  <span className="font-mono text-[9px] sm:text-[10px] text-muted-foreground pl-5 sm:pl-0">
                    {formatDate(log.created_at)}
                  </span>
                </div>

                <p className="text-[10px] sm:text-xs text-muted-foreground leading-relaxed wrap-break-word whitespace-pre-wrap pl-5 sm:pl-6">
                  {log.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};
