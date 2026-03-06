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
import RestoreTechnicianForm from "./RestoreTechnicianForm";
import NotFoundPage from "@/pages/NotFoundPage";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, type Variants } from "framer-motion";

// 👇 Animasi Fade & Scale yang konsisten (Aman dari scrollbar glitch)
const tableRowVariants: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

const DashboardTechnicianTable = ({
  technicians,
  isLoading,
  onSuccess,
  isTrashView,
}: DashboardTechnicianTableProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [selectedTechnician, setSelectedTechnician] =
    useState<TechnicianResponse | null>(null);
  const [isEditTechnicianOpen, setIsEditTechnicianOpen] = useState(false);
  const [isDeleteTechnicianOpen, setIsDeleteTechnicianOpen] = useState(false);
  const [isRestoreTechnicianOpen, setIsRestoreTechnicianOpen] = useState(false);

  const handleEditTechnicianOpen = (technician: TechnicianResponse) => {
    setSelectedTechnician(technician);
    setIsEditTechnicianOpen(true);
  };

  const handleDeleteTechnicianOpen = (technician: TechnicianResponse) => {
    setSelectedTechnician(technician);
    setIsDeleteTechnicianOpen(true);
  };

  const handleTechnicianRestoreOpen = (technician: TechnicianResponse) => {
    setSelectedTechnician(technician);
    setIsRestoreTechnicianOpen(true);
  };

  if (isLoading) {
    return <TechnicianSkeletonTable />;
  }

  if (technicians.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <NotFoundPage
          variant="glass"
          isDashboard={true}
          entityName={t("technicians_management.table.not_found_entity")}
          onGoBack={() => navigate("/dashboard/technicians", { replace: true })}
        />
      </motion.div>
    );
  }

  return (
    <>
      <TooltipProvider>
        <div className="rounded-md border bg-card overflow-x-auto w-full shadow-sm custom-scrollbar">
          <Table className="min-w-200 w-full text-sm table-fixed">
            <TableHeader>
              <TableRow className="hover:bg-transparent bg-muted/30">
                <TableHead className="w-14 font-bold border-r border-border/60 text-center">
                  {t("technicians_management.table.headers.id")}
                </TableHead>
                <TableHead className="w-64 font-bold">
                  {t("technicians_management.table.headers.name")}
                </TableHead>
                <TableHead className="w-32 font-bold text-center">
                  {t("technicians_management.table.headers.status")}
                </TableHead>
                <TableHead className="w-40 font-bold">
                  {t("technicians_management.table.headers.created_at")}
                </TableHead>
                <TableHead className="w-40 font-bold">
                  {t("technicians_management.table.headers.updated_at")}
                </TableHead>
                <TableHead className="w-20 text-right pr-6 font-bold">
                  {t("technicians_management.table.headers.actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {technicians.map((technician, index) => (
                <motion.tr
                  key={technician.id}
                  className="border-b border-border transition-colors hover:bg-muted/50"
                  variants={tableRowVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.04 }}
                >
                  <TableCell className="border-r border-border/60 text-center font-medium">
                    <span className="text-xs text-muted-foreground">
                      {technician.id}
                    </span>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col gap-0.5 truncate">
                      <TruncatedTooltip
                        text={technician.name}
                        className="font-medium text-xs sm:text-sm max-w-75"
                      />
                      <span className="text-[10px] sm:text-xs text-muted-foreground truncate max-w-75">
                        {technician.signature_url
                          ? t(
                              "technicians_management.table.signature_available",
                            )
                          : t("technicians_management.table.no_signature")}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex justify-center">
                      <div
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-medium border shadow-sm ${
                          technician.is_active
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-destructive/5 text-destructive border-destructive/20"
                        }`}
                      >
                        {technician.is_active
                          ? t("technicians_management.table.status_active")
                          : t("technicians_management.table.status_inactive")}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <span className="text-[10px] sm:text-xs text-muted-foreground font-mono">
                      {format(new Date(technician.created_at), "dd MMM yyyy")}
                    </span>
                  </TableCell>

                  <TableCell>
                    <span className="text-[10px] sm:text-xs text-muted-foreground font-mono">
                      {format(new Date(technician.updated_at), "dd MMM yyyy")}
                    </span>
                  </TableCell>

                  <TableCell className="text-right pr-6">
                    <div className="flex justify-end">
                      <TechnicianActionMenu
                        technician={technician}
                        onEditTechnician={() =>
                          handleEditTechnicianOpen(technician)
                        }
                        onDeleteTechnician={() =>
                          handleDeleteTechnicianOpen(technician)
                        }
                        onRestoreTechnician={() =>
                          handleTechnicianRestoreOpen(technician)
                        }
                        isTrashView={isTrashView ?? false}
                      />
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </div>
      </TooltipProvider>

      {/* EDIT TECHNICIAN SHEET */}
      <Sheet open={isEditTechnicianOpen} onOpenChange={setIsEditTechnicianOpen}>
        <SheetContent
          className="w-[90vw] sm:max-w-xl flex flex-col h-full p-0 gap-0"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <SheetHeader className="px-5 sm:px-6 py-4 border-b">
            <SheetTitle className="text-lg sm:text-xl text-primary">
              {t("technicians_management.sheet.edit_title")}
            </SheetTitle>
          </SheetHeader>
          <SheetDescription className="sr-only">
            {t("technicians_management.sheet.edit_desc")}
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

      {/* DELETE & RESTORE FORMS */}
      <DeleteTechnicianForm
        open={isDeleteTechnicianOpen}
        onOpenChange={setIsDeleteTechnicianOpen}
        technician={selectedTechnician}
        onSuccess={() => {
          setIsDeleteTechnicianOpen(false);
          if (onSuccess) onSuccess();
        }}
      />

      <RestoreTechnicianForm
        open={isRestoreTechnicianOpen}
        onOpenChange={setIsRestoreTechnicianOpen}
        technician={selectedTechnician}
        onSuccess={() => {
          setIsRestoreTechnicianOpen(false);
          if (onSuccess) onSuccess();
        }}
      />
    </>
  );
};

export default DashboardTechnicianTable;
