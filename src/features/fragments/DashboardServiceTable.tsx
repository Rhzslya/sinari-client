import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TooltipProvider } from "@/components/ui/tooltip";
import { formatRupiah } from "@/components/utils/formatRupiah";
import { TruncatedTooltip } from "@/components/utils/truncatedTooltip";
import { ServiceStatus } from "@/enum/product-enum";
import type { ServiceResponse } from "@/model/repair-model";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { ServiceSkeletonTable } from "./Skeleton";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ServiceActionMenu } from "./ServiceActionMenu";
import DeleteServiceForm from "./DeleteServiceForm";
import { EditServiceForm } from "../components/EditServiceForm";
import type { DashboardServiceTableProps } from "@/types/type";
import { UpdateStatusDialog } from "./UpdateStatusForm";
import RestoreServiceForm from "./RestoreServiceForm";

const DashboardServiceTable = ({
  services,
  isLoading,
  onSuccess,
  isTrashView,
}: DashboardServiceTableProps) => {
  const navigate = useNavigate();

  const [selectedService, setSelectedService] =
    useState<ServiceResponse | null>(null);
  const [isEditServiceOpen, setIsEditServiceOpen] = useState(false);
  const [isDeleteServiceOpen, setIsDeleteServiceOpen] = useState(false);
  const [isUpdateStatusOpen, setIsUpdateStatusOpen] = useState(false);
  const [isRestoreServiceOpen, setIsRestoreServiceOpen] = useState(false);

  const handleViewDetail = (service: ServiceResponse) => {
    navigate(`/dashboard/services/detail/${service.id}`);
  };

  const handleEditServiceOpen = (service: ServiceResponse) => {
    setSelectedService(service);
    setIsEditServiceOpen(true);
  };

  const handleUpdateStatusOpen = (service: ServiceResponse) => {
    setSelectedService(service);
    setIsUpdateStatusOpen(true);
  };

  const handleDeleteServiceOpen = (service: ServiceResponse) => {
    setSelectedService(service);
    setIsDeleteServiceOpen(true);
  };

  const handleRestoreServiceOpen = (service: ServiceResponse) => {
    setSelectedService(service);
    setIsRestoreServiceOpen(true);
  };

  const getStatusBadge = (status: ServiceStatus) => {
    const styles = {
      [ServiceStatus.PENDING]:
        "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200",
      [ServiceStatus.PROCESS]:
        "bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200",
      [ServiceStatus.FINISHED]:
        "bg-green-100 text-green-800 hover:bg-green-100 border-green-200",
      [ServiceStatus.TAKEN]:
        "bg-gray-100 text-gray-800 hover:bg-gray-100 border-gray-200",
      [ServiceStatus.CANCELLED]:
        "bg-red-100 text-red-800 hover:bg-red-100 border-red-200",
    };

    return (
      <Badge
        variant="outline"
        className={`font-medium border px-2.5 py-0.5 text-xs ${styles[status] || ""}`}
      >
        {status}
      </Badge>
    );
  };

  if (isLoading) {
    return <ServiceSkeletonTable />;
  }

  if (services.length === 0) {
    return (
      <div className="rounded-md border bg-card p-12 text-center flex flex-col items-center justify-center gap-2 text-muted-foreground">
        <span className="text-lg font-medium text-foreground">
          No services found
        </span>
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
                <TableHead className="w-32 font-bold border-r border-border/60 text-center">
                  Service ID
                </TableHead>
                <TableHead className="w-54 font-bold">Customer Info</TableHead>
                <TableHead className="w-37.5 font-bold">Brand</TableHead>
                <TableHead className="w-37.5 font-bold">Device Name</TableHead>
                <TableHead className="w-32 font-bold text-center">
                  Status
                </TableHead>
                <TableHead className="w-37.5 font-bold text-center">
                  Total Price
                </TableHead>
                <TableHead className="w-37.5 font-bold">Technician</TableHead>
                <TableHead className="w-37.5 font-bold">Date</TableHead>
                <TableHead className="w-12.5 text-right font-bold">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((service) => (
                <TableRow key={service.id}>
                  <TableCell className="border-r border-border/60 text-center">
                    <span className="font-mono text-xs font-semibold px-2 py-1 rounded-sm tracking-wide">
                      {service.service_id}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <TruncatedTooltip
                        text={service.customer_name}
                        className="font-medium text-sm max-w-50"
                      />
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium truncate max-w-45">
                        {service.brand}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium truncate max-w-45">
                        {service.model}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {getStatusBadge(service.status)}
                  </TableCell>
                  <TableCell className="font-medium text-sm">
                    {/* WRAPPER UTAMA: Ini yang membuat kontennya rata tengah */}
                    <div className="flex w-full justify-center">
                      {service.status === ServiceStatus.CANCELLED ? (
                        // KONDISI 1: CANCELLED (Gunakan warna abu-abu/muted agar beda dengan Lunas)
                        <Badge
                          variant="outline"
                          className="bg-slate-100 text-slate-500 border-slate-200 flex items-center gap-1 whitespace-nowrap"
                        >
                          VOID / CANCEL
                        </Badge>
                      ) : service.total_price <= 0 ? (
                        // KONDISI 2: LUNAS (Warna Hijau)
                        <Badge
                          variant="outline"
                          className="bg-emerald-50 text-emerald-700 border-emerald-200 flex items-center gap-1 whitespace-nowrap"
                        >
                          PAID OFF
                        </Badge>
                      ) : (
                        // KONDISI 3: BELUM LUNAS (Text Orange)
                        <span className="text-orange-600 font-mono">
                          {formatRupiah(service.total_price)}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {/* Status Dot */}
                      <div className="relative flex h-2.5 w-2.5 shrink-0">
                        <span
                          className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${service.technician.is_active ? "bg-emerald-400" : "hidden"}`}
                        ></span>
                        <span
                          className={`relative inline-flex rounded-full h-2.5 w-2.5 ${service.technician.is_active ? "bg-emerald-500" : "bg-gray-300"}`}
                        ></span>
                      </div>

                      <TruncatedTooltip
                        text={service.technician.name}
                        className={`font-medium text-sm max-w-35 ${!service.technician.is_active ? "text-muted-foreground" : ""}`}
                      />
                    </div>
                  </TableCell>

                  <TableCell className="text-xs text-muted-foreground">
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">
                        {format(new Date(service.created_at), "dd MMM yyyy")}
                      </span>
                      <span>
                        {format(new Date(service.created_at), "HH:mm")} WIB
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="text-right">
                    <ServiceActionMenu
                      service={service}
                      onViewDetails={() => handleViewDetail(service)}
                      onEditService={() => handleEditServiceOpen(service)}
                      onUpdateStatus={() => handleUpdateStatusOpen(service)}
                      onDeleteService={() => handleDeleteServiceOpen(service)}
                      onRestoreService={() => handleRestoreServiceOpen(service)}
                      isTrashView={isTrashView ?? false}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </TooltipProvider>

      <Sheet open={isEditServiceOpen} onOpenChange={setIsEditServiceOpen}>
        <SheetContent
          className="w-100 sm:max-w-xl flex flex-col h-full p-0 gap-0"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <SheetHeader className="px-6 py-4 border-b">
            <SheetTitle className="text-xl text-primary">
              Edit Service
            </SheetTitle>
          </SheetHeader>
          <SheetDescription className="sr-only">
            Form to add a new service
          </SheetDescription>

          <div className="flex-1 overflow-hidden">
            {selectedService && (
              <EditServiceForm
                service={selectedService}
                onSuccess={() => {
                  setIsEditServiceOpen(false);
                  if (onSuccess) onSuccess();
                }}
                onCancel={() => setIsEditServiceOpen(false)}
              />
            )}
          </div>
        </SheetContent>
      </Sheet>

      <UpdateStatusDialog
        service={selectedService}
        open={isUpdateStatusOpen}
        onOpenChange={setIsUpdateStatusOpen}
        onSuccess={() => {
          setIsUpdateStatusOpen(false);
          if (onSuccess) {
            onSuccess();
          }
        }}
      />

      <DeleteServiceForm
        open={isDeleteServiceOpen}
        onOpenChange={setIsDeleteServiceOpen}
        service={selectedService}
        onSuccess={() => {
          setIsDeleteServiceOpen(false);
          if (onSuccess) {
            onSuccess();
          }
        }}
      />

      <RestoreServiceForm
        open={isRestoreServiceOpen}
        onOpenChange={setIsRestoreServiceOpen}
        service={selectedService}
        onSuccess={() => {
          setIsRestoreServiceOpen(false);
          if (onSuccess) {
            onSuccess();
          }
        }}
      />
    </>
  );
};

export default DashboardServiceTable;
