import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TruncatedTooltip } from "@/components/utils/truncatedTooltip";
import type { TechnicianResponse } from "@/model/technician-model";
import type { DashboardTechnicianTableProps } from "@/types/type";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { format } from "date-fns";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { EditTechnicianForm } from "../components/EditTechnicianForm";
import { TechnicianActionMenu } from "./TechnicianActionMenu";
import DeleteTechnicianForm from "./DeleteTechnicianForm";
import { TechnicianSkeletonTable } from "./Skeleton";

const DashboardTechnicianTable = ({
  technicians,
  isLoading,
  onSuccess,
}: DashboardTechnicianTableProps) => {
  const [selectedTechnician, setSelectedTechnician] =
    useState<TechnicianResponse | null>(null);
  const [isEditTechnicianOpen, setIsEditTechnicianOpen] = useState(false);
  const [isDeleteTechnicianOpen, setIsDeleteTechnicianOpen] = useState(false);

  const handleEditTechnicianOpen = (technician: TechnicianResponse) => {
    setSelectedTechnician(technician);
    setIsEditTechnicianOpen(true);
  };

  const handleDeleteTechnicianOpen = (technician: TechnicianResponse) => {
    setSelectedTechnician(technician);
    setIsDeleteTechnicianOpen(true);
  };

  if (isLoading) {
    return <TechnicianSkeletonTable />;
  }

  if (technicians.length === 0) {
    return (
      <div className="rounded-md border bg-card p-8 text-center text-muted-foreground">
        No technicians found.
      </div>
    );
  }

  return (
    <>
      <TooltipProvider>
        <div className="rounded-md border bg-card">
          <Table className="min-w-200">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-14 font-bold border-r border-border/60 text-center">
                  ID
                </TableHead>
                <TableHead className="w-54 font-bold">
                  Technician Name
                </TableHead>
                <TableHead className="w-37.5 font-bold text-center">
                  Status
                </TableHead>
                <TableHead className="w-37.5 font-bold">Created At</TableHead>
                <TableHead className="w-37.5 font-bold">Updated At</TableHead>
                <TableHead className="w-12.5 text-right font-bold">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {technicians.map((technician) => (
                <TableRow key={technician.id}>
                  <TableCell className="border-r border-border/60 text-center font-medium">
                    <span className="text-xs text-muted-foreground">
                      {technician.id}
                    </span>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <TruncatedTooltip
                        text={technician.name}
                        className="font-medium text-md max-w-[320px]"
                      />
                      <span className="text-xs text-muted-foreground truncate max-w-[320px]">
                        {technician.signature_url
                          ? "Signature Available"
                          : "No Signature"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center">
                      <div
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          technician.is_active
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-destructive/10 text-destructive"
                        }`}
                      >
                        {technician.is_active ? "Active" : "Inactive"}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <span className="text-xs text-muted-foreground font-mono">
                      {format(new Date(technician.created_at), "dd MMM yyyy")}
                    </span>
                  </TableCell>

                  <TableCell>
                    <span className="text-xs text-muted-foreground font-mono">
                      {format(new Date(technician.updated_at), "dd MMM yyyy")}
                    </span>
                  </TableCell>

                  <TableCell className="text-right">
                    <TechnicianActionMenu
                      technician={technician}
                      onViewDetails={() => handleViewDetail(technician)}
                      onEditTechnician={() =>
                        handleEditTechnicianOpen(technician)
                      }
                      onDeleteTechnician={() =>
                        handleDeleteTechnicianOpen(technician)
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </TooltipProvider>

      <Sheet open={isEditTechnicianOpen} onOpenChange={setIsEditTechnicianOpen}>
        <SheetContent
          className="w-100 sm:max-w-xl flex flex-col h-full p-0 gap-0"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <SheetHeader className="px-6 py-4 border-b">
            <SheetTitle className="text-xl text-primary">
              Edit Technician
            </SheetTitle>
          </SheetHeader>
          <SheetDescription className="sr-only">
            Form to edit technician details
          </SheetDescription>

          <div className="flex-1 overflow-hidden">
            {selectedTechnician && (
              <EditTechnicianForm
                technician={selectedTechnician}
                onSuccess={() => {
                  setIsEditTechnicianOpen(false);
                  if (onSuccess) onSuccess();
                }}
                onCancel={() => setIsEditTechnicianOpen(false)}
              />
            )}
          </div>
        </SheetContent>
      </Sheet>

      <DeleteTechnicianForm
        open={isDeleteTechnicianOpen}
        onOpenChange={setIsDeleteTechnicianOpen}
        technician={selectedTechnician}
        onSuccess={() => {
          setIsDeleteTechnicianOpen(false);
          if (onSuccess) {
            onSuccess();
          }
        }}
      />
    </>
  );
};

export default DashboardTechnicianTable;
