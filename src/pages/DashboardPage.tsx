import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/features/components/fragments/DashboardHeader";
import { Download } from "lucide-react";

const DashboardPage = () => {
  return (
    <div>
      <DashboardHeader title="Dashboard Overview">
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </DashboardHeader>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="p-4 border rounded bg-card">Total Sales</div>
        <div className="p-4 border rounded bg-card">Total Revenue</div>
      </div>
    </div>
  );
};

export default DashboardPage;
