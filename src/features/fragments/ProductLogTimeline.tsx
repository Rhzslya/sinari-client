import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductLogAction } from "@/enum/product-enum";
import { useProductLogQueries } from "@/hooks/product-log-queries";
import type { GetLogRequest } from "@/model/product-logs-model";
import { format } from "date-fns";
import { Ban, History, Loader2, User } from "lucide-react";
import { useState } from "react";

const VALID_VOID_ACTIONS = [
  ProductLogAction.ADJUST_DAMAGE,
  ProductLogAction.ADJUST_LOST,
  ProductLogAction.RESTOCK,
  ProductLogAction.SALE_OFFLINE,
];

export const ProductLogTimeline = ({ productId }: { productId: number }) => {
  const { useLogList, voidLogMutation } = useProductLogQueries();

  const { data: logs, isLoading, isError } = useLogList({ id: productId });
  const { mutateAsync: voidLog, isPending } = voidLogMutation;

  const [voidingId, setVoidingId] = useState<number | null>(null);

  if (isLoading) return <div>Loading logs...</div>;
  if (isError) return <div>Failed to load logs.</div>;
  if (!logs || logs.length === 0) return <div>No activity yet.</div>;

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return "-";
    return format(new Date(date), "dd MMM yyyy, HH:mm");
  };

  const handleVoid = async (request: GetLogRequest) => {
    if (
      window.confirm(
        "Are you sure you want to VOID this transaction?\n\nThis will reverse the stock changes and cannot be undone.",
      )
    ) {
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
    <Card className="mt-6 border shadow-sm">
      <CardHeader className="bg-muted/5 py-4 border-b">
        <CardTitle className="text-base flex items-center gap-2">
          <History className="w-4 h-4 text-primary" /> Activity Log
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div
          className="flex flex-col gap-3 max-h-80 overflow-y-auto pr-2 
                        [&::-webkit-scrollbar]:w-1
                        [&::-webkit-scrollbar-track]:bg-transparent
                        [&::-webkit-scrollbar-thumb]:bg-primary/20 
                        [&::-webkit-scrollbar-thumb]:rounded-full
                        hover:[&::-webkit-scrollbar-thumb]:bg-primary"
        >
          {logs.map((log) => {
            const canBeVoided =
              VALID_VOID_ACTIONS.includes(log.action) && !log.is_voided;

            return (
              <div
                key={log.id}
                className={`p-3 border rounded-md transition-colors ${
                  log.is_voided
                    ? "bg-red-50/50 border-red-100 dark:bg-red-950/20 dark:border-red-900/50 opacity-70"
                    : "bg-muted/20 hover:bg-muted/30"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5 font-semibold text-foreground">
                      <User className="w-3.5 h-3.5" />
                      <span>{log.user.username}</span>
                    </div>
                    <Badge
                      variant="outline"
                      className="text-[9px] uppercase px-1.5 h-4 tracking-wider"
                    >
                      {log.user.role}
                    </Badge>
                  </div>
                  <span className="font-mono text-xs text-muted-foreground">
                    {formatDate(log.created_at)}
                  </span>
                </div>

                <div className="flex items-end justify-between gap-4 mt-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-foreground/80">
                        {log.action.replace(/_/g, " ")}
                      </span>

                      {/* LABEL JIKA SUDAH DI-VOID */}
                      {log.is_voided && (
                        <Badge
                          variant="destructive"
                          className="h-4 text-[9px] px-1"
                        >
                          VOIDED
                        </Badge>
                      )}
                    </div>

                    <p
                      className={`text-sm leading-relaxed ${log.is_voided ? "line-through text-muted-foreground" : "text-muted-foreground"}`}
                    >
                      {log.description}
                    </p>
                  </div>

                  {/* TOMBOL VOID */}
                  {canBeVoided && (
                    <Button
                      variant="destructive"
                      size="sm"
                      className="h-7 text-xs px-2 shrink-0"
                      disabled={isPending}
                      onClick={() => handleVoid({ id: log.id })}
                    >
                      {voidingId === log.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <>
                          <Ban className="w-3.5 h-3.5 mr-1" />
                          Void
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
