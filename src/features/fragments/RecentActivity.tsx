import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, type Variants } from "framer-motion";

interface RecentActivityProps {
  data: {
    id: number;
    type: "SERVICE" | "PRODUCT";
    username: string;
    action: string;
    description: string;
    time: string;
    service_id?: string;
    service_pk?: number;
    customer_name?: string;
    is_deleted: boolean;
    product_pk?: number;
    product_name?: string;
  }[];
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Jeda antar item aktivitas
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

export function RecentActivity({ data }: RecentActivityProps) {
  const { t } = useTranslation();
  const getInitials = (name: string) =>
    name ? name.substring(0, 2).toUpperCase() : "??";

  return (
    <motion.div
      className="space-y-6 sm:space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {data.length === 0 && (
        <motion.div
          variants={itemVariants}
          className="text-center text-muted-foreground text-xs sm:text-sm py-8"
        >
          {t("recent_activity.empty", { defaultValue: "No recent activity" })}
        </motion.div>
      )}

      {data.map((item) => (
        <motion.div
          key={item.id}
          variants={itemVariants}
          className="flex items-start group"
        >
          <Avatar className="h-8 w-8 sm:h-9 sm:w-9 mt-0.5 hidden sm:block ring-1 ring-border/50 group-hover:ring-primary/50 transition-all duration-300">
            <AvatarImage
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${item.username}`}
              alt={item.username}
            />
            <AvatarFallback className="text-xs font-semibold">
              {getInitials(item.username)}
            </AvatarFallback>
          </Avatar>

          <div className="sm:ml-4 space-y-1 sm:space-y-1.5 w-full min-w-0">
            <div className="flex items-start sm:items-center justify-between gap-2 flex-col sm:flex-row">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 min-w-0 w-full sm:w-auto">
                <p className="text-xs sm:text-sm font-semibold truncate max-w-30 sm:max-w-50">
                  {item.username}
                </p>

                {item.type === "SERVICE" &&
                  (item.is_deleted ? (
                    <Badge
                      variant="outline"
                      className="line-through text-muted-foreground text-[9px] sm:text-[10px] px-1.5 py-0"
                    >
                      {item.service_id}
                    </Badge>
                  ) : (
                    <Link
                      to={`/dashboard/services/detail/${item.service_pk}`}
                      className="hover:opacity-80 transition-opacity"
                    >
                      <Badge
                        variant="link"
                        className="text-[9px] sm:text-[10px] px-1.5 py-0 h-5"
                      >
                        {item.service_id}
                      </Badge>
                    </Link>
                  ))}

                {item.type === "PRODUCT" &&
                  (item.is_deleted ? (
                    <Badge
                      variant="outline"
                      className="line-through text-muted-foreground text-[9px] sm:text-[10px] px-1.5 py-0"
                    >
                      {item.product_name}
                    </Badge>
                  ) : (
                    <Link
                      to={`/dashboard/products/detail/${item.product_pk}`}
                      className="hover:opacity-80 transition-opacity"
                    >
                      <Badge
                        variant="link"
                        className="text-[9px] sm:text-[10px] px-1.5 py-0 h-5 truncate max-w-25 sm:max-w-37.5"
                      >
                        {item.product_name}
                      </Badge>
                    </Link>
                  ))}
              </div>

              <span className="text-[10px] sm:text-xs text-muted-foreground whitespace-nowrap shrink-0">
                {formatDistanceToNow(new Date(item.time), { addSuffix: true })}
              </span>
            </div>

            <p className="text-[11px] sm:text-xs text-muted-foreground line-clamp-2 leading-relaxed wrap-break-word">
              <span className="font-semibold text-foreground/80 mr-1.5 capitalize">
                {item.action.replace(/_/g, " ")}:
              </span>
              {item.description}
            </p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
