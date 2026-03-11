import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductLogAction } from "@/enum/enum";
import { useProductLogQueries } from "@/hooks/product-log-queries";
import type { GetLogRequest } from "@/model/product-logs-model";
import { format } from "date-fns";
import { AlertCircle, Ban, History, Loader2, User } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, type Variants } from "framer-motion";

const VALID_VOID_ACTIONS = [
  ProductLogAction.ADJUST_DAMAGE,
  ProductLogAction.ADJUST_LOST,
  ProductLogAction.RESTOCK,
  ProductLogAction.SALE_OFFLINE,
];

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

export const ProductLogTimeline = ({ productId }: { productId: number }) => {
  const { t } = useTranslation();
  const { useLogList, voidLogMutation } = useProductLogQueries();

  const { data: logs, isLoading, isError } = useLogList({ id: productId });
  const { mutateAsync: voidLog, isPending } = voidLogMutation;

  const [voidingId, setVoidingId] = useState<number | null>(null);

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return "-";
    return format(new Date(date), "dd MMM yyyy, HH:mm");
  };

  const handleVoid = async (request: GetLogRequest) => {
    if (window.confirm(t("activity_log.confirm_void"))) {
      setVoidingId(request.id);
      try {
        await voidLog(request);
      } catch {
        //Handle by Hook
      } finally {
        setVoidingId(null);
      }
    }
  };

  return (
    <Card className="mt-4 sm:mt-6 border shadow-sm">
      <CardHeader className=" py-3 sm:py-4 border-b">
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
            {logs.map((log) => {
              const canBeVoided =
                VALID_VOID_ACTIONS.includes(log.action) && !log.is_voided;

              return (
                <motion.div
                  variants={itemVariants}
                  key={log.id}
                  className={`p-3 sm:p-4 border rounded-lg transition-colors duration-300 ${
                    log.is_voided
                      ? "bg-red-50/50 border-red-100 dark:bg-red-950/20 dark:border-red-900/50 opacity-70"
                      : "bg-muted/10 border-border/60 hover:bg-muted/30"
                  }`}
                >
                  {/* Header Log: User & Time */}
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1.5 sm:gap-2 mb-2 sm:mb-2.5">
                    <div className="flex items-center gap-1.5 sm:gap-2 text-foreground font-semibold min-w-0">
                      <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground shrink-0" />
                      <span className="text-xs sm:text-sm truncate max-w-37.5 sm:max-w-50">
                        {log.user.username}
                      </span>
                      {/* Optical Adjustment Badge */}
                      <Badge
                        variant="outline"
                        className="text-[9px] sm:text-[10px] uppercase px-1.5 pt-0.75 pb-px sm:pt-1 sm:pb-0.5 leading-none tracking-wider bg-background shrink-0"
                      >
                        {log.user.role}
                      </Badge>
                    </div>
                    <span className="font-mono text-[9px] sm:text-[10px] text-muted-foreground pl-5 sm:pl-0">
                      {formatDate(log.created_at)}
                    </span>
                  </div>

                  {/* Body Log: Action, Desc & Void Button */}
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 pl-5 sm:pl-6">
                    <div className="space-y-1 sm:space-y-1.5 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-foreground/80">
                          {log.action.replace(/_/g, " ")}
                        </span>

                        {log.is_voided && (
                          <Badge
                            variant="destructive"
                            className="text-[8px] sm:text-[9px] px-1.5 pt-0.75 pb-px sm:pt-1 sm:pb-0.5 leading-none uppercase tracking-wider shrink-0"
                          >
                            {t("activity_log.voided_badge")}
                          </Badge>
                        )}
                      </div>

                      <p
                        className={`text-[10px] sm:text-xs leading-relaxed wrap-break-word whitespace-pre-wrap ${
                          log.is_voided
                            ? "line-through text-muted-foreground/60"
                            : "text-muted-foreground"
                        }`}
                      >
                        {log.description}
                      </p>
                    </div>

                    {canBeVoided && (
                      <Button
                        variant="destructive"
                        size="sm"
                        className="h-7 sm:h-8 text-[10px] sm:text-xs px-2.5 sm:px-3 self-end sm:self-auto shrink-0 cursor-pointer shadow-sm"
                        disabled={isPending}
                        onClick={() => handleVoid({ id: log.id })}
                      >
                        {voidingId === log.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <>
                            <Ban className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5" />
                            {t("activity_log.btn_void")}
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};
