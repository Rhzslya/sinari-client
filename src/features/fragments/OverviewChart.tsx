import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { motion } from "framer-motion"; // 👈 Import framer-motion
import { useTranslation } from "react-i18next";

interface OverviewChartProps {
  data: { name: string; total: number }[];
}

export function OverviewChart({ data }: OverviewChartProps) {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
      className="w-full h-62.5 sm:h-75 md:h-87.5"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <XAxis
            dataKey="name"
            stroke="#888888"
            fontSize={10}
            tickLine={false}
            axisLine={false}
            dy={10}
          />
          <YAxis
            stroke="#888888"
            fontSize={10}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `Rp${value / 1000}k`}
          />
          <Tooltip
            cursor={{ fill: "transparent" }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border border-border/50 bg-background/95 backdrop-blur-sm p-3 shadow-lg">
                    <div className="grid gap-1.5">
                      <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        {t("dashboard.chart.revenue", {
                          defaultValue: "Revenue",
                        })}
                      </span>
                      <span className="font-black text-sm sm:text-base text-primary">
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          minimumFractionDigits: 0,
                        }).format(payload[0].value as number)}
                      </span>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar
            dataKey="total"
            fill="currentColor"
            radius={[4, 4, 0, 0]}
            className="fill-primary"
            animationDuration={1500}
          />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
