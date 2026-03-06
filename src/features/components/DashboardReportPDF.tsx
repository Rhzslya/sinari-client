import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { formatRupiah } from "@/components/utils/formatRupiah";
import { format } from "date-fns";
import type { DashboardStatsResponse } from "@/model/dashboard-model";

const COLORS = {
  primary: "#0f172a",
  muted: "#64748b",
  border: "#e2e8f0",
  background: "#f8fafc",
  text: "#1e293b",
};

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: COLORS.text,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: COLORS.primary,
  },
  date: {
    fontSize: 9,
    color: COLORS.muted,
  },
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  card: {
    width: "48%",
    backgroundColor: COLORS.background,
    padding: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 10,
  },
  cardLabel: {
    fontSize: 8,
    color: COLORS.muted,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: COLORS.primary,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    marginBottom: 10,
    marginTop: 10,
    color: COLORS.primary,
  },
  table: {
    width: "100%",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: COLORS.primary,
    padding: 6,
  },
  thText: {
    color: "#ffffff",
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    padding: 6,
  },
  colTime: { width: "20%" },
  colUser: { width: "20%" },
  colAction: { width: "25%" },
  colDesc: { width: "35%" },
  tdText: {
    fontSize: 8,
    color: COLORS.text,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: "center",
    color: COLORS.muted,
    fontSize: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 10,
  },
});

interface DashboardReportProps {
  stats: DashboardStatsResponse;
  translations: {
    title: string;
    printed_on: string;
    revenue: string;
    profit: string;
    products_sold: string;
    active_repairs: string;
    table_title: string;
    th_date: string;
    th_user: string;
    th_action: string;
    th_desc: string;
  };
}

export const DashboardReportPDF = ({
  stats,
  translations: t,
}: DashboardReportProps) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.title}>{t.title}</Text>
          <Text style={styles.date}>
            {t.printed_on}: {format(new Date(), "dd MMM yyyy, HH:mm")}
          </Text>
        </View>

        {/* SUMMARY CARDS */}
        <View style={styles.summaryGrid}>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>{t.revenue}</Text>
            <Text style={styles.cardValue}>
              {formatRupiah(stats.cards.total_revenue)}
            </Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>{t.profit}</Text>
            <Text style={[styles.cardValue, { color: "#16a34a" }]}>
              {formatRupiah(stats.cards.profit)}
            </Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>{t.products_sold}</Text>
            <Text style={styles.cardValue}>{stats.cards.products_sold}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>{t.active_repairs}</Text>
            <Text style={styles.cardValue}>{stats.cards.active_services}</Text>
          </View>
        </View>

        {/* ACTIVITY TABLE */}
        <Text style={styles.sectionTitle}>{t.table_title}</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.thText, styles.colTime]}>{t.th_date}</Text>
            <Text style={[styles.thText, styles.colUser]}>{t.th_user}</Text>
            <Text style={[styles.thText, styles.colAction]}>{t.th_action}</Text>
            <Text style={[styles.thText, styles.colDesc]}>{t.th_desc}</Text>
          </View>
          {stats.recent_activity.map((item, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={[styles.tdText, styles.colTime]}>
                {format(new Date(item.time), "dd/MM/yyyy HH:mm")}
              </Text>
              <Text style={[styles.tdText, styles.colUser]}>
                {item.username}
              </Text>
              <Text style={[styles.tdText, styles.colAction]}>
                {item.action.replace(/_/g, " ")}
              </Text>
              <Text style={[styles.tdText, styles.colDesc]}>
                {item.description}
              </Text>
            </View>
          ))}
        </View>

        {/* FOOTER */}
        <Text style={styles.footer}>Generated securely by System.</Text>
      </Page>
    </Document>
  );
};
