import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useServiceLogQueries } from "@/hooks/repair-log-queries";
import { format } from "date-fns";
import { History, User } from "lucide-react";
import { useTranslation } from "react-i18next";

export const ServiceLogTimeline = ({ serviceId }: { serviceId: number }) => {
  const { t } = useTranslation();
  const { useLogList } = useServiceLogQueries();

  const { data: logs, isLoading, isError } = useLogList({ id: serviceId });

  if (isLoading)
    return (
      <div className="p-4 text-sm text-muted-foreground">
        {t("activity_log.loading")}
      </div>
    );
  if (isError)
    return (
      <div className="p-4 text-sm text-destructive">
        {t("activity_log.error_load")}
      </div>
    );
  if (!logs || logs.length === 0)
    return (
      <div className="p-4 text-sm text-muted-foreground">
        {t("activity_log.empty")}
      </div>
    );

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return "-";
    return format(new Date(date), "dd MMM yyyy, HH:mm");
  };

  return (
    <Card className="mt-6 border shadow-sm">
      <CardHeader className="bg-muted/5 py-4 border-b">
        <CardTitle className="text-base flex items-center gap-2">
          <History className="w-4 h-4 text-primary" /> {t("activity_log.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-16 w-full rounded-md" />
            <Skeleton className="h-16 w-full rounded-md" />
          </div>
        ) : !logs || logs.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <History className="w-8 h-8 mx-auto mb-2 opacity-20" />
            <p className="text-sm">{t("activity_log.empty_desc")}</p>
          </div>
        ) : (
          <div
            className="flex flex-col gap-3 max-h-80 overflow-y-auto pr-2 
                        [&::-webkit-scrollbar]:w-1
                        [&::-webkit-scrollbar-track]:bg-transparent
                        [&::-webkit-scrollbar-thumb]:bg-primary/20 
                        [&::-webkit-scrollbar-thumb]:rounded-full
                        hover:[&::-webkit-scrollbar-thumb]:bg-primary"
          >
            {logs.map((log) => (
              <div
                key={log.id}
                className="p-3 border rounded-md bg-muted/20 hover:bg-muted/30 transition-colors"
              >
                <div className="flex justify-between items-center text-xs text-muted-foreground mb-2">
                  <div className="flex items-center gap-1.5 font-semibold text-foreground">
                    <User className="w-3.5 h-3.5" />
                    <span>{log.user.username}</span>
                    <Badge
                      variant="outline"
                      className="text-[9px] uppercase px-1.5 h-4 tracking-wider"
                    >
                      {log.user.role}
                    </Badge>
                  </div>
                  <span className="font-mono">
                    {formatDate(log.created_at)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {log.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
