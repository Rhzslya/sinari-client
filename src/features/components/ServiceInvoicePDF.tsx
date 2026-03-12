import { formatRupiah } from "@/components/utils/formatRupiah";
import { ServiceStatus } from "@/enum/enum";
import type { ServiceResponse } from "@/model/repair-model";
import type { UpdateStoreSettingRequest } from "@/model/store-setting-model";
import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";

const COLORS = {
  primary: "#ef473a",
  dark: "#1e293b",
  muted: "#64748b",
  gray50: "#f9fafb",
  gray100: "#f3f4f6",
  gray200: "#e5e7eb",
  white: "#ffffff",
  red50: "#fef2f2",
  red300: "#fca5a5",
  red500: "#ef4444",
  red800: "#991b1b",
  green600: "#16a34a",
};

const styles = StyleSheet.create({
  page: {
    padding: 0,
    fontSize: 7,
    fontFamily: "Helvetica",
    color: COLORS.dark,
    backgroundColor: COLORS.white,
    flexDirection: "column",
  },
  contentWrapper: {
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 10,
    flex: 1,
  },

  // HEADER & STATUS BADGE
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  logoSection: { flexDirection: "column" },
  logoText: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: COLORS.dark,
    marginBottom: 1,
    textTransform: "uppercase",
  },
  logoSub: {
    fontSize: 5,
    color: COLORS.muted,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  statusBadgeWrapper: {
    alignItems: "flex-end",
  },
  statusBadge: {
    borderWidth: 1.5,
    borderColor: COLORS.dark,
    paddingVertical: 1.5,
    paddingHorizontal: 5,
    transform: "rotate(-6deg)",
    opacity: 0.8,
  },
  statusText: {
    fontSize: 6,
    fontFamily: "Helvetica-Bold",
    color: COLORS.dark,
    textTransform: "uppercase",
  },

  // ACCENT BAR
  accentBar: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  primaryStrip: {
    backgroundColor: COLORS.primary,
    height: 10,
    flex: 1,
    marginRight: 8,
  },
  invoiceTitleLarge: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: COLORS.dark,
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  primarySquare: {
    backgroundColor: COLORS.primary,
    height: 10,
    width: 10,
    marginLeft: 8,
  },

  // INFO CONTAINER
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  infoColLeft: { width: "55%" },
  infoColRight: { width: "40%" },

  labelBold: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    marginBottom: 1,
    color: COLORS.dark,
  },
  textNormal: {
    fontSize: 7,
    marginBottom: 1,
    color: COLORS.muted,
    lineHeight: 1.2,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.gray100,
    paddingBottom: 1.5,
    marginBottom: 2,
  },
  metaLabel: { fontFamily: "Helvetica-Bold", color: COLORS.dark },
  metaValue: { color: COLORS.muted, fontFamily: "Helvetica" },

  // TABLE
  tableContainer: { marginBottom: 6 },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: COLORS.dark,
    paddingVertical: 2.8,
    paddingHorizontal: 4,
    alignItems: "center",
  },
  tableHeaderText: {
    color: COLORS.white,
    fontFamily: "Helvetica-Bold",
    fontSize: 6,
    textTransform: "uppercase",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 3,
    paddingHorizontal: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.gray200,
    alignItems: "center",
  },
  tableRowAlt: { backgroundColor: COLORS.gray50 },

  colSL: { width: "10%", textAlign: "center", color: COLORS.muted },
  colDesc: { width: "50%", color: COLORS.dark, fontFamily: "Helvetica-Bold" },
  colPrice: { width: "20%", textAlign: "right", color: COLORS.muted },
  colTotal: {
    width: "20%",
    textAlign: "right",
    color: COLORS.dark,
    fontFamily: "Helvetica-Bold",
  },

  strikethrough: {
    textDecoration: "line-through",
    color: COLORS.muted,
    fontFamily: "Helvetica",
  },

  // BOTTOM SECTION
  bottomContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 2,
  },
  bottomLeft: { width: "50%" },
  bottomRight: { width: "45%" },

  sectionTitle: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
    color: COLORS.dark,
  },
  smallText: {
    fontSize: 5.5,
    color: COLORS.muted,
    lineHeight: 1.3,
  },

  // TOTALS
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2.5,
  },
  grandTotalBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: COLORS.primary,
    paddingVertical: 4,
    paddingHorizontal: 5,
    marginTop: 2,
    alignItems: "center",
  },
  grandTotalLabel: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: COLORS.white,
    textTransform: "uppercase",
  },
  grandTotalValue: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: COLORS.white,
  },

  // REFUND
  refundBox: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: COLORS.red300,
    borderStyle: "dashed",
    backgroundColor: COLORS.red50,
    padding: 4,
  },
  refundTitle: {
    fontSize: 5,
    fontFamily: "Helvetica-Bold",
    color: COLORS.red800,
    marginBottom: 1,
    textTransform: "uppercase",
  },
  refundText: {
    fontSize: 5,
    color: COLORS.red800,
    lineHeight: 1.2,
  },

  // FOOTER & SIGN
  signArea: {
    marginTop: 8,
    width: "80%",
    alignSelf: "center",
    alignItems: "center",
  },
  signatureImage: {
    height: 18,
    width: "80%",
    objectFit: "contain",
    marginBottom: 1,
  },
  signLine: {
    width: "100%",
    borderTopWidth: 0.5,
    borderTopColor: COLORS.dark,
    marginBottom: 1.5,
  },
  technicianName: {
    fontSize: 6,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    color: COLORS.dark,
    textTransform: "uppercase",
  },

  footerStrip: {
    marginTop: "auto",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderTopWidth: 0.5,
    borderTopColor: COLORS.dark,
    backgroundColor: COLORS.gray50,
    paddingTop: 5,
    paddingBottom: 10,
    paddingHorizontal: 10,
    flexWrap: "wrap",
  },
  footerText: {
    fontSize: 5.5,
    color: COLORS.muted,
    marginHorizontal: 3,
  },
});

interface InvoiceProps {
  service: ServiceResponse;
  settings: UpdateStoreSettingRequest;
}

export const ServiceInvoicePDF = ({ service, settings }: InvoiceProps) => {
  const { t } = useTranslation();
  const isCancelled = service.status === ServiceStatus.CANCELLED;

  const subTotal = service.service_list.reduce(
    (acc, item) => acc + item.price,
    0,
  );
  const discountPercent = service.discount || 0;
  const discountAmount = (subTotal * discountPercent) / 100;
  const downPayment = service.down_payment || 0;
  const grandTotal = isCancelled ? 0 : subTotal - discountAmount - downPayment;

  const truncate = (str: string, max: number) => {
    return str.length > max ? str.substring(0, max) + "..." : str;
  };

  const storeName = settings?.store_name || "SINARI CELL";
  const storeAddress = settings?.store_address || t("invoice.default_address");
  const storePhone = settings?.store_phone || "-";
  const storeWebsite = settings?.store_website || "";
  const warrantyText = settings?.warranty_text || "-";
  const paymentInfo = settings?.payment_info || "-";

  // Translate status text safely
  const rawStatus = service.status;
  const translatedStatus = t(`invoice.status.${rawStatus}`, {
    defaultValue: rawStatus.replace("_", " "),
  });

  return (
    <Document>
      <Page size="A6" style={styles.page}>
        <View style={styles.contentWrapper}>
          <View style={styles.headerTop}>
            <View style={styles.logoSection}>
              <Text style={styles.logoText}>{storeName}</Text>
              <Text style={styles.logoSub}>
                {t("invoice.professional_repair")}
              </Text>
            </View>
            <View style={styles.statusBadgeWrapper}>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>{translatedStatus}</Text>
              </View>
            </View>
          </View>

          {/* ACCENT BAR */}
          <View style={styles.accentBar}>
            <View style={styles.primaryStrip} />
            <Text style={styles.invoiceTitleLarge}>
              {t("invoice.invoice_title")}
            </Text>
            <View style={styles.primarySquare} />
          </View>

          <View style={styles.infoContainer}>
            <View style={styles.infoColLeft}>
              <Text style={styles.labelBold}>{t("invoice.invoice_to")}</Text>
              <Text
                style={[
                  styles.textNormal,
                  {
                    fontFamily: "Helvetica-Bold",
                    color: COLORS.dark,
                    textTransform: "uppercase",
                  },
                ]}
              >
                {truncate(service.customer_name, 25)}
              </Text>
              <Text style={styles.textNormal}>{service.phone_number}</Text>
              <Text style={styles.textNormal}>
                {service.brand} - {truncate(service.model, 25)}
              </Text>
            </View>

            <View style={styles.infoColRight}>
              <View style={styles.metaRow}>
                <Text style={[styles.metaLabel, { fontSize: 6 }]}>
                  {t("invoice.inv_no")}
                </Text>
                <Text style={[styles.metaValue, { fontSize: 6 }]}>
                  {service.service_id}
                </Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={[styles.metaLabel, { fontSize: 6 }]}>
                  {t("invoice.date")}
                </Text>
                <Text style={[styles.metaValue, { fontSize: 6 }]}>
                  {format(new Date(service.created_at), "dd/MM/yy")}
                </Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={[styles.metaLabel, { fontSize: 6 }]}>
                  {t("invoice.technician")}
                </Text>
                <Text style={[styles.metaValue, { fontSize: 6 }]}>
                  {truncate(service.technician?.name || "-", 15)}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, styles.colSL]}>
                {t("invoice.table_no")}
              </Text>
              <Text
                style={[
                  styles.tableHeaderText,
                  styles.colDesc,
                  { color: COLORS.white },
                ]}
              >
                {t("invoice.table_desc")}
              </Text>
              <Text
                style={[
                  styles.tableHeaderText,
                  styles.colPrice,
                  { color: COLORS.white },
                ]}
              >
                {t("invoice.table_price")}
              </Text>
              <Text
                style={[
                  styles.tableHeaderText,
                  styles.colTotal,
                  { color: COLORS.white },
                ]}
              >
                {t("invoice.table_total")}
              </Text>
            </View>

            {service.service_list.map((item, index) => (
              <View
                key={index}
                style={[
                  styles.tableRow,
                  index % 2 !== 0 ? styles.tableRowAlt : {},
                ]}
              >
                <Text style={[styles.colSL, { fontSize: 7 }]}>{index + 1}</Text>
                <Text
                  style={[
                    styles.colDesc,
                    { fontSize: 7 },
                    isCancelled ? styles.strikethrough : {},
                  ]}
                >
                  {truncate(item.name, 30)}
                </Text>
                <Text style={[styles.colPrice, { fontSize: 7 }]}>
                  {formatRupiah(item.price)}
                </Text>
                <Text style={[styles.colTotal, { fontSize: 7 }]}>
                  {formatRupiah(item.price)}
                </Text>
              </View>
            ))}
          </View>

          {/* BOTTOM (T&C DAN TOTALS) */}
          <View style={styles.bottomContainer}>
            <View style={styles.bottomLeft}>
              <Text style={styles.sectionTitle}>{t("invoice.tnc")}</Text>
              <Text style={styles.smallText}>{warrantyText}</Text>

              <Text style={[styles.sectionTitle, { marginTop: 6 }]}>
                {t("invoice.payment_info")}
              </Text>
              <Text style={styles.smallText}>{paymentInfo}</Text>
            </View>

            <View style={styles.bottomRight}>
              <View style={styles.totalRow}>
                <Text style={styles.labelBold}>{t("invoice.sub_total")}</Text>
                <Text
                  style={[
                    styles.textNormal,
                    isCancelled ? styles.strikethrough : {},
                  ]}
                >
                  {formatRupiah(subTotal)}
                </Text>
              </View>

              {!isCancelled && discountPercent > 0 && (
                <View style={styles.totalRow}>
                  <Text style={styles.labelBold}>
                    {t("invoice.disc")} ({discountPercent}%)
                  </Text>
                  <Text style={[styles.textNormal, { color: COLORS.red500 }]}>
                    - {formatRupiah(discountAmount)}
                  </Text>
                </View>
              )}

              {downPayment > 0 && (
                <View style={styles.totalRow}>
                  <Text style={styles.labelBold}>
                    {t("invoice.down_payment")}
                  </Text>
                  <Text style={[styles.textNormal, { color: COLORS.green600 }]}>
                    - {formatRupiah(downPayment)}
                  </Text>
                </View>
              )}

              <View
                style={[
                  styles.grandTotalBox,
                  isCancelled ? { backgroundColor: COLORS.muted } : {},
                ]}
              >
                <Text style={styles.grandTotalLabel}>
                  {isCancelled
                    ? t("invoice.amount_due")
                    : t("invoice.total_due")}
                </Text>
                <Text style={styles.grandTotalValue}>
                  {formatRupiah(Math.max(0, grandTotal))}
                </Text>
              </View>

              {isCancelled && downPayment > 0 && (
                <View style={styles.refundBox}>
                  <Text style={styles.refundTitle}>
                    {t("invoice.refund_notice")}
                  </Text>
                  <Text style={styles.refundText}>
                    {t("invoice.refund_desc", {
                      amount: formatRupiah(downPayment),
                    })}
                  </Text>
                </View>
              )}

              <View style={styles.signArea}>
                {service.technician?.signature_url ? (
                  <Image
                    src={service.technician.signature_url}
                    style={styles.signatureImage}
                  />
                ) : (
                  <View style={{ height: 25 }} />
                )}
                <View style={styles.signLine} />
                <Text style={styles.technicianName}>
                  {service.technician?.name || t("invoice.authorized_sign")}
                </Text>
                {service.technician?.name && (
                  <Text
                    style={[
                      styles.smallText,
                      { textAlign: "center", fontSize: 5 },
                    ]}
                  >
                    {t("invoice.technician")}
                  </Text>
                )}
              </View>
            </View>
          </View>
        </View>

        {/* FOOTER */}
        <View style={styles.footerStrip}>
          {storePhone && <Text style={styles.footerText}>{storePhone}</Text>}
          {storePhone && storeAddress && (
            <Text style={styles.footerText}>|</Text>
          )}

          {storeAddress && (
            <Text style={styles.footerText}>{truncate(storeAddress, 45)}</Text>
          )}
          {storeAddress && storeWebsite && (
            <Text style={styles.footerText}>|</Text>
          )}

          {storeWebsite && (
            <Text style={styles.footerText}>{storeWebsite}</Text>
          )}
        </View>
      </Page>
    </Document>
  );
};
