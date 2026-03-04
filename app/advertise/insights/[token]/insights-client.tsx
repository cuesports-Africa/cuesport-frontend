"use client";

import Image from "next/image";
import {
  Eye,
  MousePointerClick,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { InsightsData } from "./page";

const COLORS = {
  blue: "#004E86",
  blueDark: "#003D6B",
  dark: "#0A1628",
  gold: "#C9A227",
  green: "#16A34A",
  lightBg: "#F8FAFC",
  cardBg: "#FFFFFF",
  muted: "#64748B",
  border: "#E2E8F0",
  textDark: "#0F172A",
};

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  active: { bg: "#DCFCE7", text: "#166534" },
  paused: { bg: "#FEF9C3", text: "#854D0E" },
  draft: { bg: "#F1F5F9", text: "#475569" },
  expired: { bg: "#FEE2E2", text: "#991B1B" },
};

function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}

function formatDateShort(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function formatDateFull(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; dataKey: string; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: COLORS.dark,
        border: `1px solid ${COLORS.blueDark}`,
        borderRadius: 8,
        padding: "10px 14px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
      }}
    >
      <p style={{ color: "#94A3B8", fontSize: 12, marginBottom: 6 }}>{label}</p>
      {payload.map((entry) => (
        <p
          key={entry.dataKey}
          style={{
            color: entry.color,
            fontSize: 13,
            fontWeight: 600,
            margin: "2px 0",
          }}
        >
          {entry.dataKey === "impressions" ? "Impressions" : "Clicks"}:{" "}
          {formatNumber(entry.value)}
        </p>
      ))}
    </div>
  );
}

export default function InsightsClient({ data }: { data: InsightsData }) {
  const { ad, stats, daily_breakdown } = data;
  const statusKey = ad.status.toLowerCase();
  const statusColor = STATUS_COLORS[statusKey] || STATUS_COLORS.draft;

  const chartData = [...daily_breakdown].map((d) => ({
    ...d,
    label: formatDateShort(d.date),
  }));

  const reversedBreakdown = [...daily_breakdown].reverse();

  return (
    <div style={{ minHeight: "100vh", background: COLORS.lightBg }}>
      {/* Hero Header */}
      <div
        style={{
          background: `linear-gradient(135deg, ${COLORS.blue} 0%, ${COLORS.blueDark} 40%, ${COLORS.dark} 100%)`,
          paddingBottom: 64,
        }}
      >
        <div
          style={{
            maxWidth: 960,
            margin: "0 auto",
            padding: "48px 24px 0",
            textAlign: "center",
          }}
        >
          {/* Logo */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(12px)",
              borderRadius: 16,
              padding: "12px 20px",
              marginBottom: 24,
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            <Image
              src="/logo.svg"
              alt="CueSports Africa"
              width={140}
              height={32}
              style={{ filter: "brightness(0) invert(1)" }}
            />
          </div>

          {/* Report Label */}
          <p
            style={{
              color: COLORS.gold,
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            Ad Performance Report
          </p>

          {/* Ad Title */}
          <h1
            style={{
              color: "#FFFFFF",
              fontSize: "clamp(24px, 4vw, 36px)",
              fontWeight: 800,
              margin: "0 0 8px",
              lineHeight: 1.2,
            }}
          >
            {ad.title}
          </h1>

          {/* Advertiser Name */}
          <p
            style={{
              color: "rgba(255,255,255,0.7)",
              fontSize: 16,
              marginBottom: 20,
            }}
          >
            {ad.advertiser_name}
          </p>

          {/* Badges */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "5px 14px",
                borderRadius: 9999,
                fontSize: 13,
                fontWeight: 600,
                background: statusColor.bg,
                color: statusColor.text,
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: statusColor.text,
                  display: "inline-block",
                }}
              />
              {ad.status}
            </span>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "5px 14px",
                borderRadius: 9999,
                fontSize: 13,
                fontWeight: 500,
                background: "rgba(255,255,255,0.12)",
                color: "rgba(255,255,255,0.85)",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              {ad.placement}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px 48px" }}>
        {/* Stats Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 20,
            marginTop: -40,
            marginBottom: 32,
          }}
        >
          {/* Impressions */}
          <div
            style={{
              background: COLORS.cardBg,
              borderRadius: 16,
              padding: "28px 24px",
              boxShadow:
                "0 4px 24px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)",
              borderTop: `3px solid ${COLORS.blue}`,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 14,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: `${COLORS.blue}12`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Eye size={20} color={COLORS.blue} />
              </div>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: COLORS.muted,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                Impressions
              </span>
            </div>
            <p
              style={{
                fontSize: "clamp(28px, 4vw, 36px)",
                fontWeight: 800,
                color: COLORS.textDark,
                margin: 0,
                lineHeight: 1,
              }}
            >
              {formatNumber(stats.total_impressions)}
            </p>
          </div>

          {/* Clicks */}
          <div
            style={{
              background: COLORS.cardBg,
              borderRadius: 16,
              padding: "28px 24px",
              boxShadow:
                "0 4px 24px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)",
              borderTop: `3px solid ${COLORS.gold}`,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 14,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: `${COLORS.gold}12`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MousePointerClick size={20} color={COLORS.gold} />
              </div>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: COLORS.muted,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                Clicks
              </span>
            </div>
            <p
              style={{
                fontSize: "clamp(28px, 4vw, 36px)",
                fontWeight: 800,
                color: COLORS.textDark,
                margin: 0,
                lineHeight: 1,
              }}
            >
              {formatNumber(stats.total_clicks)}
            </p>
          </div>

          {/* CTR */}
          <div
            style={{
              background: COLORS.cardBg,
              borderRadius: 16,
              padding: "28px 24px",
              boxShadow:
                "0 4px 24px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)",
              borderTop: `3px solid ${COLORS.green}`,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 14,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: `${COLORS.green}12`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <TrendingUp size={20} color={COLORS.green} />
              </div>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: COLORS.muted,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                Click-Through Rate
              </span>
            </div>
            <p
              style={{
                fontSize: "clamp(28px, 4vw, 36px)",
                fontWeight: 800,
                color: COLORS.textDark,
                margin: 0,
                lineHeight: 1,
              }}
            >
              {stats.ctr.toFixed(2)}%
            </p>
          </div>
        </div>

        {/* Daily Performance Chart */}
        <div
          style={{
            background: COLORS.cardBg,
            borderRadius: 16,
            padding: "28px 24px",
            boxShadow:
              "0 4px 24px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)",
            marginBottom: 24,
          }}
        >
          <h2
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: COLORS.textDark,
              margin: "0 0 24px",
            }}
          >
            Daily Performance{" "}
            <span
              style={{ fontWeight: 400, color: COLORS.muted, fontSize: 14 }}
            >
              — Last 30 days
            </span>
          </h2>

          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart
                data={chartData}
                margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
              >
                <defs>
                  <linearGradient
                    id="impressionsFill"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor={COLORS.blue}
                      stopOpacity={0.2}
                    />
                    <stop
                      offset="100%"
                      stopColor={COLORS.blue}
                      stopOpacity={0.02}
                    />
                  </linearGradient>
                  <linearGradient
                    id="clicksFill"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor={COLORS.gold}
                      stopOpacity={0.2}
                    />
                    <stop
                      offset="100%"
                      stopColor={COLORS.gold}
                      stopOpacity={0.02}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={COLORS.border}
                  vertical={false}
                />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 12, fill: COLORS.muted }}
                  tickLine={false}
                  axisLine={{ stroke: COLORS.border }}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: COLORS.muted }}
                  tickLine={false}
                  axisLine={false}
                  width={50}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ stroke: COLORS.border, strokeWidth: 1 }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: 13, color: COLORS.muted }}
                />
                <Area
                  type="monotone"
                  dataKey="impressions"
                  name="Impressions"
                  stroke={COLORS.blue}
                  strokeWidth={2.5}
                  fill="url(#impressionsFill)"
                />
                <Area
                  type="monotone"
                  dataKey="clicks"
                  name="Clicks"
                  stroke={COLORS.gold}
                  strokeWidth={2.5}
                  fill="url(#clicksFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: 240,
                color: COLORS.muted,
              }}
            >
              <BarChart3 size={48} strokeWidth={1.2} />
              <p style={{ marginTop: 12, fontSize: 15 }}>
                No performance data yet
              </p>
            </div>
          )}
        </div>

        {/* Daily Breakdown Table */}
        {reversedBreakdown.length > 0 && (
          <div
            style={{
              background: COLORS.cardBg,
              borderRadius: 16,
              padding: "28px 24px",
              boxShadow:
                "0 4px 24px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)",
              marginBottom: 24,
            }}
          >
            <h2
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: COLORS.textDark,
                margin: "0 0 20px",
              }}
            >
              Daily Breakdown
            </h2>

            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: 14,
                }}
              >
                <thead>
                  <tr
                    style={{
                      borderBottom: `2px solid ${COLORS.border}`,
                    }}
                  >
                    <th
                      style={{
                        textAlign: "left",
                        padding: "10px 12px",
                        fontSize: 12,
                        fontWeight: 700,
                        color: COLORS.muted,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Date
                    </th>
                    <th
                      style={{
                        textAlign: "right",
                        padding: "10px 12px",
                        fontSize: 12,
                        fontWeight: 700,
                        color: COLORS.muted,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Impressions
                    </th>
                    <th
                      style={{
                        textAlign: "right",
                        padding: "10px 12px",
                        fontSize: 12,
                        fontWeight: 700,
                        color: COLORS.muted,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Clicks
                    </th>
                    <th
                      style={{
                        textAlign: "right",
                        padding: "10px 12px",
                        fontSize: 12,
                        fontWeight: 700,
                        color: COLORS.muted,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      CTR
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {reversedBreakdown.map((day) => (
                    <tr
                      key={day.date}
                      style={{
                        borderBottom: `1px solid ${COLORS.border}`,
                      }}
                    >
                      <td
                        style={{
                          padding: "12px",
                          fontWeight: 500,
                          color: COLORS.textDark,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {formatDateFull(day.date)}
                      </td>
                      <td
                        style={{
                          padding: "12px",
                          textAlign: "right",
                          color: COLORS.textDark,
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >
                        {formatNumber(day.impressions)}
                      </td>
                      <td
                        style={{
                          padding: "12px",
                          textAlign: "right",
                          color: COLORS.textDark,
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >
                        {formatNumber(day.clicks)}
                      </td>
                      <td
                        style={{
                          padding: "12px",
                          textAlign: "right",
                          fontWeight: 600,
                          color: COLORS.blue,
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >
                        {day.ctr.toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Footer */}
        <div
          style={{
            borderTop: `1px solid ${COLORS.border}`,
            paddingTop: 32,
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: 13,
              color: COLORS.muted,
              margin: 0,
            }}
          >
            Powered by{" "}
            <span style={{ fontWeight: 600, color: COLORS.blue }}>
              CueSports Africa
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
