import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ServiceResponse } from "@/model/repair-model";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  RefreshCw,
  FileText,
  ArchiveRestore,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ServiceInvoicePDF } from "../components/ServiceInvoicePDF";
import { pdf } from "@react-pdf/renderer";
import { useUserQueries } from "@/hooks/user-queries";

interface ServiceActionMenuProps {
  service: ServiceResponse;
  onViewDetails: () => void;
  onEditService: () => void;
  onUpdateStatus: () => void;
  onDeleteService: () => void;
  onRestoreService: () => void;
  isTrashView: boolean;
}

export function ServiceActionMenu({
  service,
  onViewDetails,
  onEditService,
  onUpdateStatus,
  onDeleteService,
  onRestoreService,
  isTrashView,
}: ServiceActionMenuProps) {
  const userQueries = useUserQueries();

  const { data: currentUser } = userQueries.useProfile();
  const isOwner = currentUser?.role === "OWNER";

  const [isOpen, setIsOpen] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleDownloadPDF = async () => {
    setIsGeneratingPdf(true);
    const toastId = toast.loading("Generating Invoice PDF...");
    try {
      const blob = await pdf(<ServiceInvoicePDF service={service} />).toBlob();

      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `Invoice-${service.service_id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Invoice Downloaded!", { id: toastId });
    } catch (error) {
      console.error("PDF Error:", error);
      toast.error("Failed to generate PDF", { id: toastId });
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen} modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {!isTrashView ? (
          <>
            <DropdownMenuItem
              onClick={onViewDetails}
              className="cursor-pointer"
            >
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={handleDownloadPDF}
              disabled={isGeneratingPdf}
              className="cursor-pointer"
            >
              <FileText className="mr-2 h-4 w-4" />
              {isGeneratingPdf ? "Generating..." : "Download PDF"}
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={onEditService}
              className="cursor-pointer"
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit Service
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={onUpdateStatus}
              className="cursor-pointer"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Update Status
            </DropdownMenuItem>

            {isOwner && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={onDeleteService}
                  className="text-destructive focus:text-destructive cursor-pointer"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </>
            )}
          </>
        ) : (
          <DropdownMenuItem
            onClick={onRestoreService}
            className="text-emerald-600 focus:text-emerald-600 cursor-pointer"
            disabled={!isOwner}
          >
            <ArchiveRestore className="mr-2 h-4 w-4" />
            Restore Data
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
