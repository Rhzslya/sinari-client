import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";

interface RecentActivityProps {
  data: {
    id: number;
    username: string;
    action: string;
    description: string;
    time: string;
    service_id: string;
    service_pk: number;
    customer_name: string;
  }[];
}

export function RecentActivity({ data }: RecentActivityProps) {
  const getInitials = (name: string) =>
    name ? name.substring(0, 2).toUpperCase() : "??";

  return (
    <div className="space-y-8">
      {data.length === 0 && (
        <div className="text-center text-muted-foreground text-sm py-8">
          No recent activity found.
        </div>
      )}

      {data.map((item) => (
        <div key={item.id} className="flex items-start">
          <Avatar className="h-9 w-9 mt-0.5 hidden sm:block">
            <AvatarImage
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${item.username}`}
              alt={item.username}
            />
            <AvatarFallback>{getInitials(item.username)}</AvatarFallback>
          </Avatar>

          <div className="ml-4 space-y-1 w-full min-w-0 ">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <p className="text-sm font-medium truncate">{item.username}</p>

                <Link
                  to={`/dashboard/services/detail/${item.service_pk}`}
                  className="hover:opacity-80 transition-opacity flex items-center -translate-y-px"
                >
                  <Badge variant="link">{item.service_id}</Badge>
                </Link>
              </div>

              <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">
                {formatDistanceToNow(new Date(item.time), { addSuffix: true })}
              </span>
            </div>

            <p className="text-xs text-muted-foreground line-clamp-2 leading-snug wrap-break-word">
              <span className="font-semibold text-foreground/80 mr-1">
                {item.action.replace(/_/g, " ")}:
              </span>
              {item.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
