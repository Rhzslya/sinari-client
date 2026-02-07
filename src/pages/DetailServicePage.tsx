import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { formatRupiah } from "@/components/utils/formatRupiah";
import { ServiceStatus } from "@/enum/product-enum";
import { handleApiError } from "@/lib/utils";
import type { ServiceResponse } from "@/model/repair-model";
import { RepairServices } from "@/services/repair-services";
import {
  ArrowLeft,
  Calendar,
  ClipboardList,
  Copy,
  Edit,
  ExternalLink,
  MessageCircle,
  Phone,
  Receipt,
  Smartphone,
  Tag,
  Timer,
  Trash2,
  User,
  Wrench,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import NotFoundPage from "./NotFoundPage";
import { isAxiosError } from "axios";

const DetailServicePage = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();

  const [service, setService] = useState<ServiceResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!serviceId) return;
      setIsLoading(true);
      try {
        const response = await RepairServices.getById(Number(serviceId));
        setService(response);
      } catch (error) {
        if (isAxiosError(error) && error.response?.status === 404) {
          setIsNotFound(true);
          return;
        }
        if (isAxiosError(error) && error.response?.status === 403) {
          toast.error("Access Denied", {
            description: "Forbidden: Insufficient permissions.",
          });
          navigate("/dashboard");
          return;
        }
        handleApiError(error, "Failed to load service");
        navigate("/dashboard/services");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetail();
  }, [serviceId, navigate]);

  const handleCopyToken = (token: string) => {
    navigator.clipboard.writeText(token);
    toast.success("Tracking token copied!");
  };

  const handleWhatsApp = (phone: string) => {
    let cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.startsWith("0")) {
      cleanPhone = "62" + cleanPhone.slice(1);
    }
    const url = `https://wa.me/${cleanPhone}`;
    window.open(url, "_blank");
  };

  const getStatusColor = (status: ServiceStatus) => {
    switch (status) {
      case ServiceStatus.PENDING:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case ServiceStatus.PROCESS:
        return "bg-blue-100 text-blue-800 border-blue-200";
      case ServiceStatus.FINISHED:
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case ServiceStatus.CANCELLED:
        return "bg-red-100 text-red-800 border-red-200";
      case ServiceStatus.TAKEN:
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-secondary text-foreground";
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-md" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-40 w-full rounded-xl" />
            <Skeleton className="h-96 w-full rounded-xl" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-64 w-full rounded-xl" />
            <Skeleton className="h-40 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (isNotFound) {
    return (
      <NotFoundPage
        isDashboard={true}
        id={serviceId}
        entityName="Service"
        backUrl="/dashboard/services"
      />
    );
  }

  if (!service) return null;

  return (
    <div className="min-h-screen bg-muted/10 pb-8 animate-in fade-in">
      <div className="bg-background border-b sticky top-0 z-20 px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/dashboard/services")}
            className="gap-2 text-muted-foreground"
          >
            <ArrowLeft className="size-4" /> Back
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <div className="flex items-baseline gap-3">
            <h1 className="text-lg font-bold font-mono tracking-tight">
              {service.service_id}
            </h1>
            <Badge
              variant="outline"
              className={`text-xs font-semibold px-2.5 py-0.5 ${getStatusColor(
                service.status,
              )}`}
            >
              {service.status}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Edit className="size-3.5" /> Edit
          </Button>
          <Button variant="destructive" size="icon" className="h-8 w-8">
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="bg-muted/10 pb-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <Smartphone className="size-4 text-primary" />
                  Device Information
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Brand & Model
                  </span>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                      <Tag className="size-5" />
                    </div>
                    <div>
                      <p className="font-bold text-lg leading-none">
                        {service.brand}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {service.model}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="md:border-l md:pl-6">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Problem Description
                  </span>
                  <p className="mt-2 text-sm text-foreground bg-muted/30 p-3 rounded-md border min-h-15">
                    {service.description || (
                      <span className="text-muted-foreground italic">
                        No description provided.
                      </span>
                    )}
                  </p>
                </div>

                <div className="md:col-span-2 border-t pt-4 mt-2">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    <Wrench className="size-3.5" /> Technician Note (Internal)
                  </span>
                  <p className="mt-2 text-sm text-foreground">
                    {service.technician_note || "-"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardHeader className="bg-muted/10 pb-4 flex flex-row items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Receipt className="size-4 text-primary" />
                  Service & Parts Details
                </CardTitle>
                <Badge variant="secondary" className="font-normal">
                  {service.total_items} Items
                </Badge>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-muted/30 text-muted-foreground font-medium border-b">
                      <tr>
                        <th className="px-6 py-3 w-12">#</th>
                        <th className="px-6 py-3">Service Name</th>
                        <th className="px-6 py-3 text-right">Cost</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {service.service_list.map((item, index) => (
                        <tr key={item.id} className="hover:bg-muted/5">
                          <td className="px-6 py-3 text-muted-foreground">
                            {index + 1}
                          </td>
                          <td className="px-6 py-3 font-medium">{item.name}</td>
                          <td className="px-6 py-3 text-right font-mono">
                            {formatRupiah(item.price)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-muted/5 font-medium">
                      <tr>
                        <td colSpan={2} className="px-6 py-3 text-right">
                          Subtotal
                        </td>
                        <td className="px-6 py-3 text-right font-mono">
                          {formatRupiah(
                            service.total_price + (service.discount || 0),
                          )}
                        </td>
                      </tr>
                      {service.discount !== undefined &&
                        service.discount > 0 && (
                          <tr className="text-emerald-600">
                            <td
                              colSpan={2}
                              className="px-6 py-1 text-right text-xs"
                            >
                              Discount
                            </td>
                            <td className="px-6 py-1 text-right font-mono text-xs">
                              - {formatRupiah(service.discount)}
                            </td>
                          </tr>
                        )}
                      <tr className="border-t-2 border-primary/10">
                        <td
                          colSpan={2}
                          className="px-6 py-4 text-right text-base font-bold"
                        >
                          Grand Total
                        </td>
                        <td className="px-6 py-4 text-right text-lg font-bold font-mono text-primary">
                          {formatRupiah(service.total_price)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader className="bg-muted/10 pb-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <User className="size-4 text-primary" />
                  Customer Details
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-lg">
                    {service.customer_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-bold truncate">
                      {service.customer_name}
                    </p>
                    <div className="flex items-center gap-1 text-muted-foreground text-sm">
                      <Phone className="size-3" />
                      {service.phone_number}
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={() => handleWhatsApp(service.phone_number)}
                >
                  <MessageCircle className="size-4" /> Chat on WhatsApp
                </Button>
              </CardContent>
            </Card>

            <Card className="border-blue-100 dark:border-blue-900 bg-blue-50/20 dark:bg-blue-900/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2 text-blue-700 dark:text-blue-400">
                  <ClipboardList className="size-4" /> Live Tracking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-xs mb-3">
                  Share this token with the customer so they can check repair
                  progress.
                </CardDescription>

                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-background border px-2 py-1.5 rounded text-xs font-mono truncate">
                    {service.tracking_token}
                  </code>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 shrink-0"
                    onClick={() => handleCopyToken(service.tracking_token)}
                  >
                    <Copy className="size-3.5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 shrink-0"
                    onClick={() =>
                      window.open(
                        `/track?token=${service.tracking_token}`,
                        "_blank",
                      )
                    }
                  >
                    <ExternalLink className="size-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                  <Timer className="size-4" /> Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-3 pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Calendar className="size-3.5" /> Created At
                  </span>
                  <span className="font-medium">
                    {new Date(service.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Time</span>
                  <span>
                    {new Date(service.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                <Separator />

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Last Updated</span>
                  <span>
                    {service.updated_at
                      ? new Date(service.updated_at).toLocaleDateString()
                      : "-"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailServicePage;
