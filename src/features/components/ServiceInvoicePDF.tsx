import { formatRupiah } from "@/components/utils/formatRupiah";
import type { ServiceResponse } from "@/model/repair-model";
import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { format } from "date-fns";

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 9,
    fontFamily: "Helvetica",
    color: "#1e293b",
    backgroundColor: "#ffffff",
    flexDirection: "column",
  },

  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
    borderBottomWidth: 1.5,
    borderBottomColor: "#0f172a",
    paddingBottom: 10,

    alignItems: "flex-start",
  },
  brandColumn: {
    flexDirection: "column",
    width: "60%",
  },
  brandName: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  brandInfo: {
    fontSize: 8,
    color: "#64748b",
    marginBottom: 1,
    lineHeight: 1.3,
  },
  invoiceColumn: {
    width: "35%",
    alignItems: "flex-end",
  },
  invoiceTitle: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
    marginBottom: 4,
  },
  invoiceDetail: {
    fontSize: 8,
    color: "#64748b",
    marginBottom: 1,
  },

  gridContainer: {
    flexDirection: "row",
    marginBottom: 15,
    gap: 10,
  },
  gridColumn: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 8,
    borderRadius: 4,
  },
  sectionLabel: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: "#94a3b8",
    textTransform: "uppercase",
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  infoText: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    marginBottom: 1,
    color: "#334155",
  },
  infoSubText: {
    fontSize: 8,
    color: "#64748b",
  },

  tableContainer: {
    marginTop: 5,
    marginBottom: 15,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#e2e8f0",
    paddingVertical: 6,
    paddingHorizontal: 4,
    marginBottom: 2,
    borderRadius: 2,
  },
  tableHeaderLabel: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: "#475569",
    textTransform: "uppercase",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: "#e2e8f0",
  },
  colDesc: { flex: 1, paddingRight: 10 },
  colPrice: { width: "35%", textAlign: "right" },
  itemText: { fontSize: 9, color: "#334155" },

  totalContainer: {
    flexDirection: "column",
    alignItems: "flex-end",
    marginTop: 5,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "60%",
    marginBottom: 3,
  },
  totalLabel: {
    fontSize: 8,
    color: "#64748b",
  },
  totalValue: {
    fontSize: 9,
    fontFamily: "Helvetica",
    color: "#334155",
  },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "60%",
    marginTop: 5,
    paddingTop: 5,
    borderTopWidth: 1,
    borderTopColor: "#0f172a",
  },
  grandTotalLabel: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
  },
  grandTotalValue: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
  },

  footer: {
    marginTop: "auto",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    paddingTop: 10,
  },
  termsTitle: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    marginBottom: 2,
  },
  termsText: {
    fontSize: 6,
    color: "#94a3b8",
    lineHeight: 1.4,
    marginBottom: 8,
  },
  thankYou: {
    textAlign: "center",
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#334155",
  },
  printMeta: {
    marginTop: 5,
    textAlign: "center",
    fontSize: 6,
    color: "#cbd5e1",
  },
});

interface InvoiceProps {
  service: ServiceResponse;
}

export const ServiceInvoicePDF = ({ service }: InvoiceProps) => {
  const discount = service.discount || 0;
  const subTotal = service.total_price + discount;
  const printedAt = format(new Date(), "dd/MM/yyyy HH:mm");

  return (
    <Document>
      <Page size="A6" style={styles.page}>
        <View style={styles.headerContainer}>
          <View style={styles.brandColumn}>
            <Text style={styles.brandName}>SINARI CELL</Text>
            <Text style={styles.brandInfo}>
              Jl. Guru Kojar, Kp. Pondok Belimbing, RT.03/04, Jurang Mangu
              Barat, Pondok Aren, Tangerang Selatan
            </Text>
            <Text style={styles.brandInfo}>WhatsApp: 0812-3456-7890</Text>
          </View>
          <View style={styles.invoiceColumn}>
            <Text style={styles.invoiceTitle}>INVOICE</Text>
            <Text style={styles.invoiceDetail}>#{service.service_id}</Text>
            <Text style={styles.invoiceDetail}>
              {format(new Date(service.created_at), "dd MMM yyyy")}
            </Text>
          </View>
        </View>

        <View style={styles.gridContainer}>
          <View style={styles.gridColumn}>
            <Text style={styles.sectionLabel}>BILL TO</Text>
            <Text style={styles.infoText}>{service.customer_name}</Text>
            <Text style={styles.infoSubText}>{service.phone_number}</Text>
          </View>

          <View style={styles.gridColumn}>
            <Text style={styles.sectionLabel}>DEVICE INFO</Text>
            <Text style={styles.infoText}>
              {service.brand} {service.model}
            </Text>
            <Text style={styles.infoSubText}>{service.status}</Text>
          </View>
        </View>

        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderLabel, styles.colDesc]}>
            DESCRIPTION
          </Text>
          <Text style={[styles.tableHeaderLabel, styles.colPrice]}>AMOUNT</Text>
        </View>

        <View style={styles.tableContainer}>
          {service.service_list.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.itemText, styles.colDesc]}>{item.name}</Text>
              <Text style={[styles.itemText, styles.colPrice]}>
                {formatRupiah(item.price)}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.totalContainer} wrap={false}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValue}>{formatRupiah(subTotal)}</Text>
          </View>

          {discount > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Discount</Text>
              <Text style={[styles.totalValue, { color: "#ef4444" }]}>
                {discount} %
              </Text>
            </View>
          )}

          <View style={styles.grandTotalRow}>
            <Text style={styles.grandTotalLabel}>TOTAL</Text>
            <Text style={styles.grandTotalValue}>
              {formatRupiah(service.total_price)}
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.termsTitle}>TERMS & CONDITIONS</Text>
          <Text style={styles.termsText}>
            1. Garansi service berlaku selama 7 hari untuk kerusakan yang sama.
            {"\n"}
            2. Nota ini adalah bukti garansi yang sah, harap disimpan.{"\n"}
            3. Barang yang tidak diambil lebih dari 1 bulan bukan tanggung jawab
            kami.
          </Text>

          <Text style={styles.thankYou}>TERIMA KASIH ATAS KUNJUNGAN ANDA</Text>
          <Text style={styles.printMeta}>Printed on {printedAt}</Text>
        </View>
      </Page>
    </Document>
  );
};
