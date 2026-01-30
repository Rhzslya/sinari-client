import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

interface DashboardHeaderProps {
  title: string;
  children?: React.ReactNode;
}

export function DashboardHeader({ title, children }: DashboardHeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4 mb-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-5" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>

      <div className="flex items-center gap-2">{children}</div>
    </header>
  );
}
