import { formatRupiah } from "@/components/utils/formatRupiah";
import { ServiceStatus } from "@/enum/product-enum";
import type { ServiceResponse } from "@/model/repair-model";
import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { format } from "date-fns";

const COLORS = {
  primary: "#ef473acd",
  dark: "#1e293b",
  lightGray: "#f1f5f9",
  white: "#ffffff",
  textMain: "#0f172a",
  textMuted: "#64748b",
  danger: "#dc2626",
  warningBg: "#fef2f2",
  warningBorder: "#fecaca",
};

const styles = StyleSheet.create({
  page: {
    padding: 0,
    fontSize: 7,
    fontFamily: "Helvetica",
    color: COLORS.textMain,
    backgroundColor: COLORS.white,
    flexDirection: "column",
  },

  contentWrapper: {
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 10,
    flex: 1,
  },

  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 3,
  },
  logoSection: { flexDirection: "column" },
  logoText: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: COLORS.dark,
    marginBottom: 1,
  },
  logoSub: {
    fontSize: 5,
    color: COLORS.textMuted,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },

  accentBar: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  primaryStrip: {
    backgroundColor: COLORS.primary,
    height: 15,
    flex: 1,
    marginRight: 10,
  },
  invoiceTitleLarge: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: COLORS.dark,
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 3,
  },
  infoColLeft: { width: "60%" },
  infoColRight: { width: "35%" },

  labelBold: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    marginBottom: 2,
    color: COLORS.dark,
  },
  textNormal: {
    fontSize: 7,
    marginBottom: 1,
    color: COLORS.textMain,
    lineHeight: 1.2,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  metaLabel: { fontFamily: "Helvetica-Bold", width: "40%" },
  metaValue: { width: "60%", textAlign: "right" },

  tableContainer: { marginBottom: 5 },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: COLORS.dark,
    paddingVertical: 4,
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
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: "#cbd5e1",
    alignItems: "center",
  },
  tableRowAlt: { backgroundColor: COLORS.lightGray },

  colSL: { width: "10%", textAlign: "center" },
  colDesc: {
    width: "50%",
  },
  colPrice: { width: "20%", textAlign: "right" },
  colTotal: { width: "20%", textAlign: "right" },

  strikethrough: {
    textDecoration: "line-through",
    color: COLORS.textMuted,
  },

  bottomContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 1,
  },
  bottomLeft: { width: "50%" },
  bottomRight: { width: "45%" },

  sectionTitle: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    marginBottom: 2,
    marginTop: 8,
  },
  smallText: {
    fontSize: 5,
    color: COLORS.textMuted,
    lineHeight: 1.2,
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
    paddingHorizontal: 2,
  },
  grandTotalBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: COLORS.primary,
    paddingVertical: 4,
    paddingHorizontal: 4,
    marginTop: 4,
  },
  grandTotalText: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: COLORS.dark,
  },

  refundBox: {
    marginTop: 6,
    borderWidth: 1,
    borderColor: COLORS.danger,
    borderStyle: "dashed",
    backgroundColor: COLORS.warningBg,
    padding: 4,
  },
  refundTitle: {
    fontSize: 6,
    fontFamily: "Helvetica-Bold",
    color: COLORS.danger,
    marginBottom: 2,
    textTransform: "uppercase",
  },
  refundText: {
    fontSize: 5,
    color: COLORS.danger,
    lineHeight: 1.2,
  },

  footerStrip: {
    marginTop: "auto",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: COLORS.dark,
    paddingTop: 5,
    marginBottom: 5,
  },
  signArea: {
    marginTop: 6,
    borderBottomWidth: 0.5,
    borderTopColor: COLORS.dark,
    width: "80%",
    alignSelf: "flex-end",
    textAlign: "center",
    paddingBottom: 2,
    fontSize: 6,
    fontFamily: "Helvetica-Bold",
  },

  printMeta: {
    textAlign: "left",
    borderTopWidth: 0.5,
    borderTopColor: COLORS.dark,
    fontSize: 4.5,
    color: "#cbd5e1",
    marginTop: 3,
  },
});

interface InvoiceProps {
  service: ServiceResponse;
}

export const ServiceInvoicePDF = ({ service }: InvoiceProps) => {
  const isCancelled = service.status === ServiceStatus.CANCELLED;

  const subTotal = service.service_list.reduce(
    (acc, item) => acc + item.price,
    0,
  );
  const discountPercent = service.discount || 0;
  const discountAmount = (subTotal * discountPercent) / 100;
  const downPayment = service.down_payment || 0;
  const grandTotal = isCancelled ? 0 : subTotal - discountAmount - downPayment;
  const printedAt = format(new Date(), "dd/MM/yyyy HH:mm");

  const truncate = (str: string, max: number) => {
    return str.length > max ? str.substring(0, max) + "..." : str;
  };
  return (
    <Document>
      <Page size="A6" style={styles.page}>
        <View style={styles.contentWrapper}>
          <View style={styles.headerTop}>
            <View style={styles.logoSection}>
              <Text style={styles.logoText}>SINARI CELL</Text>
              <Text style={styles.logoSub}>Professional Repair Service</Text>
            </View>
          </View>

          <View style={styles.accentBar}>
            <View style={styles.primaryStrip} />
            <Text style={styles.invoiceTitleLarge}>INVOICE</Text>
            <View
              style={[
                styles.primaryStrip,
                { flex: 0, width: 10, marginLeft: 10 },
              ]}
            />
          </View>

          <View style={styles.infoContainer}>
            <View style={styles.infoColLeft}>
              <Text style={styles.labelBold}>Invoice to:</Text>
              <Text
                style={[styles.textNormal, { fontFamily: "Helvetica-Bold" }]}
              >
                {truncate(service.customer_name, 35)}
              </Text>
              <Text style={styles.textNormal}>{service.phone_number}</Text>
              <Text style={styles.textNormal}>
                {service.brand} - {service.model}
              </Text>
            </View>

            <View style={styles.infoColRight}>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Inv#</Text>
                <Text style={styles.metaValue}>{service.service_id}</Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Date</Text>
                <Text style={styles.metaValue}>
                  {format(new Date(service.created_at), "dd/MM/yy")}
                </Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Status</Text>
                <Text style={styles.metaValue}>{service.status}</Text>
              </View>
            </View>
          </View>

          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, styles.colSL]}>No.</Text>
              <Text style={[styles.tableHeaderText, styles.colDesc]}>
                DESCRIPTION
              </Text>
              <Text style={[styles.tableHeaderText, styles.colPrice]}>
                PRICE
              </Text>
              <Text style={[styles.tableHeaderText, styles.colTotal]}>
                TOTAL
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
                <Text
                  style={[styles.textNormal, styles.colSL, { marginBottom: 0 }]}
                >
                  {index + 1}
                </Text>
                <Text
                  style={[
                    styles.textNormal,
                    styles.colDesc,
                    { marginBottom: 0 },
                    isCancelled ? styles.strikethrough : {},
                  ]}
                >
                  {truncate(item.name, 35)}
                </Text>
                <Text
                  style={[
                    styles.textNormal,
                    styles.colPrice,
                    { marginBottom: 0 },
                  ]}
                >
                  {formatRupiah(item.price)}
                </Text>
                <Text
                  style={[
                    styles.textNormal,
                    styles.colTotal,
                    { marginBottom: 0, fontFamily: "Helvetica-Bold" },
                  ]}
                >
                  {formatRupiah(item.price)}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.bottomContainer}>
            <View style={styles.bottomLeft}>
              <Text style={styles.sectionTitle}>Terms & Conditions:</Text>
              <Text style={styles.smallText}>
                1. Garansi 7 hari berlaku untuk kerusakan/part yang sama.{"\n"}
                2. Wajib membawa nota ini saat klaim garansi.{"\n"}
                3. Unit yang tidak diambil &gt; 30 hari di luar tanggung jawab
                kami.{"\n"}
                4. Garansi hangus jika segel rusak, kena air, atau terjatuh.
              </Text>

              <Text style={[styles.sectionTitle, { marginTop: 6 }]}>
                Payment:
              </Text>
              <Text style={styles.smallText}>
                BCA: 1234 5678 90 (Sinari){"\n"}
                Mandiri: 0987 6543 21 (Sinari)
              </Text>

              <View style={styles.printMeta}>
                <Text
                  style={{
                    marginTop: 3,
                  }}
                >
                  Printed on {printedAt}
                </Text>
              </View>
            </View>

            <View style={styles.bottomRight}>
              <View style={styles.totalRow}>
                <Text style={styles.labelBold}>Sub Total</Text>
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
                    Disc. ({discountPercent}%)
                  </Text>
                  <Text style={[styles.textNormal, { color: COLORS.danger }]}>
                    -{formatRupiah(discountAmount)}
                  </Text>
                </View>
              )}

              <View style={styles.totalRow}>
                <Text style={styles.labelBold}>Down Payment</Text>
                <Text style={styles.textNormal}>
                  {formatRupiah(downPayment)}
                </Text>
              </View>

              <View
                style={[
                  styles.grandTotalBox,
                  isCancelled ? { backgroundColor: COLORS.lightGray } : {},
                ]}
              >
                <Text style={styles.grandTotalText}>
                  {isCancelled ? "AMOUNT DUE" : "TOTAL"}
                </Text>
                <Text style={styles.grandTotalText}>
                  {formatRupiah(grandTotal)}
                </Text>
              </View>

              {isCancelled && downPayment > 0 && (
                <View style={styles.refundBox}>
                  <Text style={styles.refundTitle}>REFUND NOTICE</Text>
                  <Text style={styles.refundText}>
                    Layanan dibatalkan. Harap tunjukkan nota ini untuk
                    pengembalian DP sebesar {formatRupiah(downPayment)}.
                  </Text>
                </View>
              )}

              <View style={{ marginBottom: 1 }}>
                <Text style={styles.signArea}>Technician Name</Text>
              </View>
            </View>
          </View>

          <View style={styles.footerStrip}>
            <Text style={[styles.smallText, { marginHorizontal: 3 }]}>
              0812-3456-7890
            </Text>
            <Text style={[styles.smallText, { marginHorizontal: 3 }]}>|</Text>
            <Text style={[styles.smallText, { marginHorizontal: 3 }]}>
              Website
            </Text>
            <Text style={[styles.smallText, { marginHorizontal: 3 }]}>|</Text>
            <Text style={[styles.smallText, { marginHorizontal: 3 }]}>
              Jl. Guru Kojar, Kp. Pondok Belimbing, Jurang Mangu Barat,
              Tangerang Selatan
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};
