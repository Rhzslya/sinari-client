import { formatRupiah } from "@/components/utils/formatRupiah";
import { TruncatedTooltip } from "@/components/utils/truncatedTooltip";
import { ServiceStatus } from "@/enum/product-enum";
import type { PublicServiceResponse } from "@/model/repair-model";
import { RepairServices } from "@/services/repair-services";
import { format } from "date-fns";
import { Loader2, MapPin, Phone, Printer, RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NotFoundPage from "./NotFoundPage";

const PDF_COLORS = {
  primary: "#ef473a",
  dark: "#1e293b",
  muted: "#64748b",
  warning: "#f59e0b",
};

export default function TrackServicePage() {
  const { identifier } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [service, setService] = useState<PublicServiceResponse | null>(null);
  const [isNotFound, setIsNotFound] = useState(false);

  useEffect(() => {
    const fetchService = async () => {
      if (!identifier) return;
      setIsLoading(true);
      setIsNotFound(false);
      try {
        const data = await RepairServices.trackService(identifier);
        if (data) {
          setService(data);
        } else {
          setIsNotFound(true);
        }
      } catch (error) {
        console.error("Tracking Error:", error);
        setIsNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchService();
  }, [identifier]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-slate-400" />
        <p className="text-sm text-slate-500 font-medium">
          Tracking Service...
        </p>
      </div>
    );
  }

  if (isNotFound || !service) {
    return (
      <NotFoundPage
        entityName="Service Tracking"
        id={identifier}
        backUrl="/"
        variant="glass"
      />
    );
  }

  const isCancelled = service.status === ServiceStatus.CANCELLED;

  const subTotal = service.service_list.reduce(
    (acc, item) => acc + item.price,
    0,
  );
  const discountAmount = (subTotal * (service.discount || 0)) / 100;
  const downPayment = service.down_payment || 0;
  const grandTotal = isCancelled ? 0 : subTotal - discountAmount - downPayment;

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex justify-center items-start py-10 font-sans">
      <div className="w-full max-w-lg bg-white shadow-2xl min-h-150 flex flex-col">
        <div className="p-6 pb-2">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1
                className="text-2xl font-bold tracking-tight"
                style={{ color: PDF_COLORS.dark }}
              >
                SINARI CELL
              </h1>
              <p
                className="text-[10px] uppercase tracking-widest"
                style={{ color: PDF_COLORS.muted }}
              >
                Professional Repair Service
              </p>
            </div>
            <div className="text-right">
              <div
                className="border-2 px-3 py-1 inline-block transform -rotate-6 opacity-80"
                style={{ borderColor: PDF_COLORS.dark }}
              >
                <span
                  className="text-xs font-bold uppercase"
                  style={{ color: PDF_COLORS.dark }}
                >
                  {service.status.replace("_", " ")}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div
              className="h-4 flex-1"
              style={{ backgroundColor: PDF_COLORS.primary }}
            ></div>
            <h2
              className="text-xl font-bold tracking-widest uppercase"
              style={{ color: PDF_COLORS.dark }}
            >
              INVOICE TRACKER
            </h2>
            <div
              className="h-4 w-4"
              style={{ backgroundColor: PDF_COLORS.primary }}
            ></div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 text-sm mb-2">
            <div className="flex-1 space-y-1 min-w-0">
              <p
                className="font-bold text-xs mb-1"
                style={{ color: PDF_COLORS.dark }}
              >
                Invoice to:
              </p>
              <TruncatedTooltip
                text={service.customer_name}
                className="font-bold uppercase truncate text-[#1e293b] text-sm"
              />
              <p className="text-xs" style={{ color: PDF_COLORS.muted }}>
                {service.phone_number}
              </p>
              <div
                className="flex items-center text-xs w-full"
                style={{ color: PDF_COLORS.muted }}
              >
                <span className="whitespace-nowrap shrink-0 mr-1">
                  {service.brand} -
                </span>
                <div className="min-w-0">
                  <TruncatedTooltip
                    text={service.model}
                    className="truncate text-[#64748b] text-xs block"
                  />
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex justify-between border-b border-gray-100 pb-1">
                <span
                  className="font-bold text-xs"
                  style={{ color: PDF_COLORS.dark }}
                >
                  Inv#
                </span>
                <span
                  className="text-xs font-mono"
                  style={{ color: PDF_COLORS.muted }}
                >
                  {service.service_id}
                </span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-1">
                <span
                  className="font-bold text-xs"
                  style={{ color: PDF_COLORS.dark }}
                >
                  Date
                </span>
                <span className="text-xs" style={{ color: PDF_COLORS.muted }}>
                  {format(new Date(service.created_at), "dd/MM/yy")}
                </span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-1">
                <span
                  className="font-bold text-xs"
                  style={{ color: PDF_COLORS.dark }}
                >
                  Technician
                </span>
                <span
                  className="text-xs font-medium"
                  style={{ color: PDF_COLORS.muted }}
                >
                  {service.technician?.name || "-"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 mb-6">
          <div className="w-full">
            <div
              className="flex text-[10px] font-bold py-2 px-2 uppercase text-white"
              style={{ backgroundColor: PDF_COLORS.dark }}
            >
              <div className="w-10 text-center">No.</div>
              <div className="flex-1">Description</div>
              <div className="w-24 text-right">Price</div>
              <div className="w-24 text-right hidden sm:block">Total</div>
            </div>

            <div className="text-xs">
              {service.service_list.map((item, index) => (
                <div
                  key={index}
                  className={`flex py-1.5 px-1.5 border-b border-gray-200 ${
                    index % 2 !== 0 ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <div
                    className="w-10 text-center"
                    style={{ color: PDF_COLORS.muted }}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0 px-1">
                    <TruncatedTooltip
                      text={item.name}
                      className={`font-medium truncate block ${
                        isCancelled
                          ? "line-through text-gray-400"
                          : "text-[#1e293b]"
                      }`}
                    />
                  </div>
                  <div
                    className="w-24 text-right"
                    style={{ color: PDF_COLORS.muted }}
                  >
                    {formatRupiah(item.price)}
                  </div>
                  <div
                    className="w-24 text-right font-bold hidden sm:block"
                    style={{ color: PDF_COLORS.dark }}
                  >
                    {formatRupiah(item.price)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 flex flex-col md:flex-row gap-8 mb-auto">
          <div
            className="flex-1 text-[10px] space-y-2"
            style={{ color: PDF_COLORS.muted }}
          >
            <p className="font-bold" style={{ color: PDF_COLORS.dark }}>
              Terms & Conditions:
            </p>
            <ol className="list-decimal list-inside space-y-0.5 leading-relaxed">
              <li>Garansi 7 hari untuk kerusakan yang sama.</li>
              <li>Wajib menunjukan invoice ini saat klaim.</li>
              <li>Unit {">"} 30 hari tidak diambil diluar tanggung jawab.</li>
              <li>Garansi hangus jika segel rusak/kena air.</li>
            </ol>

            <p className="font-bold mt-3" style={{ color: PDF_COLORS.dark }}>
              Payment Info:
            </p>
            <p>BCA: 1234 5678 90 (Sinari)</p>
          </div>

          <div className="w-full md:w-56 text-xs space-y-2">
            <div className="flex justify-between">
              <span className="font-bold" style={{ color: PDF_COLORS.dark }}>
                Sub Total
              </span>
              <span
                style={{ color: PDF_COLORS.muted }}
                className={isCancelled ? "line-through" : ""}
              >
                {formatRupiah(subTotal)}
              </span>
            </div>

            {!isCancelled && discountAmount > 0 && (
              <div className="flex justify-between text-red-500">
                <span className="font-bold">Disc ({service.discount}%)</span>
                <span>- {formatRupiah(discountAmount)}</span>
              </div>
            )}

            {downPayment > 0 && (
              <div className="flex justify-between text-green-600">
                <span className="font-bold">Down Payment</span>
                <span>- {formatRupiah(downPayment)}</span>
              </div>
            )}

            <div
              className="text-white p-2 flex justify-between items-center mt-2 shadow-sm"
              style={{
                backgroundColor: isCancelled
                  ? PDF_COLORS.muted
                  : PDF_COLORS.primary,
              }}
            >
              <span className="font-bold uppercase text-[10px]">
                {isCancelled ? "Amount Due" : "Total Due"}
              </span>
              <span className="font-bold text-sm">
                {formatRupiah(Math.max(0, grandTotal))}
              </span>
            </div>

            {isCancelled && downPayment > 0 && (
              <div className="mt-3 border-2 border-dashed border-red-300 bg-red-50 p-2 rounded-sm text-[10px] leading-tight text-red-800">
                <div className="flex items-center gap-1 mb-1 font-bold">
                  <RefreshCcw className="w-3 h-3" />
                  <span>REFUND NOTICE</span>
                </div>
                <p>
                  Layanan dibatalkan. Silakan tunjukkan invoice ini ke kasir
                  untuk pengembalian dana DP sebesar{" "}
                  <span className="font-bold">{formatRupiah(downPayment)}</span>
                  .
                </p>
              </div>
            )}

            <div className="pt-2 text-center mt-4">
              <div className="h-12 flex items-end justify-center mb-1">
                {service.technician?.signature_url ? (
                  <img
                    src={service.technician.signature_url}
                    alt="Signature"
                    className="max-h-full max-w-[80%] object-contain"
                    crossOrigin="anonymous"
                  />
                ) : (
                  <div className="h-full w-full"></div>
                )}
              </div>

              <div
                className="border-b w-3/4 mx-auto mb-1"
                style={{ borderColor: PDF_COLORS.dark }}
              ></div>

              <p
                className="text-[10px] font-bold uppercase"
                style={{ color: PDF_COLORS.dark }}
              >
                {service.technician?.name || "Authorized Sign"}
              </p>

              {service.technician?.name && (
                <p className="text-[8px] text-gray-400 uppercase">Technician</p>
              )}
            </div>
          </div>
        </div>
        <div
          className="mt-8 border-t py-3 bg-gray-50 flex flex-wrap justify-center gap-4 text-[10px] text-center px-4"
          style={{ borderColor: PDF_COLORS.dark, color: PDF_COLORS.muted }}
        >
          <span className="flex items-center gap-1">
            <Phone className="w-3 h-3" /> 0812-3456-7890
          </span>
          <span className="hidden sm:inline">|</span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" /> Tangerang Selatan
          </span>
          <span className="hidden sm:inline">|</span>
          <span>www.sinaricell.com</span>
        </div>
      </div>

      <button
        onClick={() => window.print()}
        className="fixed bottom-6 right-6 text-white p-4 rounded-full shadow-xl hover:opacity-90 transition-all print:hidden"
        style={{ backgroundColor: PDF_COLORS.dark }}
      >
        <Printer className="w-6 h-6" />
      </button>
    </div>
  );
}
