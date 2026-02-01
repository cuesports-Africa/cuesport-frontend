"use client";

import { useState, useEffect } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Loader2,
  RefreshCw,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ServiceStatus {
  name: string;
  slug: string;
  description: string;
  status: "operational" | "degraded" | "partial_outage" | "major_outage" | "unknown";
  response_time_ms: number | null;
  last_checked: string | null;
  uptime_90_days: number;
  daily_history: Array<{
    date: string;
    status: "operational" | "degraded" | "partial_outage" | "major_outage";
    uptime: number;
  }>;
}

interface IncidentUpdate {
  status: string;
  message: string;
  posted_at: string;
}

interface Incident {
  id: number;
  title: string;
  status: "investigating" | "identified" | "monitoring" | "resolved";
  impact: "none" | "minor" | "major" | "critical";
  started_at: string;
  resolved_at: string | null;
  affected_services: string[];
  updates: IncidentUpdate[];
}

interface StatusData {
  status: "operational" | "degraded" | "partial_outage" | "major_outage";
  status_message: string;
  services: ServiceStatus[];
  active_incidents: Incident[];
  recent_incidents: Incident[];
  last_updated: string;
}

const statusConfig = {
  operational: {
    label: "Operational",
    color: "bg-green-500",
    textColor: "text-green-600",
    bgColor: "bg-green-500/10",
    icon: CheckCircle2,
  },
  degraded: {
    label: "Degraded",
    color: "bg-yellow-500",
    textColor: "text-yellow-600",
    bgColor: "bg-yellow-500/10",
    icon: AlertTriangle,
  },
  partial_outage: {
    label: "Partial Outage",
    color: "bg-orange-500",
    textColor: "text-orange-600",
    bgColor: "bg-orange-500/10",
    icon: AlertTriangle,
  },
  major_outage: {
    label: "Major Outage",
    color: "bg-red-500",
    textColor: "text-red-600",
    bgColor: "bg-red-500/10",
    icon: XCircle,
  },
  unknown: {
    label: "Unknown",
    color: "bg-gray-400",
    textColor: "text-gray-600",
    bgColor: "bg-gray-400/10",
    icon: Loader2,
  },
};

const impactConfig = {
  none: { label: "None", color: "text-gray-500" },
  minor: { label: "Minor", color: "text-yellow-500" },
  major: { label: "Major", color: "text-orange-500" },
  critical: { label: "Critical", color: "text-red-500" },
};

function UptimeBar({ service }: { service: ServiceStatus }) {
  // Generate 90 days of data, filling in missing days
  const days = [];
  const today = new Date();
  const historyMap = new Map(
    service.daily_history.map((d) => [d.date, d])
  );

  for (let i = 89; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    const dayData = historyMap.get(dateStr);

    days.push({
      date: dateStr,
      status: dayData?.status || "operational",
      uptime: dayData?.uptime ?? 100,
    });
  }

  return (
    <div className="flex gap-[2px] h-8">
      {days.map((day, index) => {
        const config = statusConfig[day.status] || statusConfig.operational;
        const date = new Date(day.date);
        const formattedDate = date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
        const uptimeValue = Number(day.uptime) || 0;

        return (
          <div
            key={day.date}
            className={`flex-1 ${config.color} rounded-sm opacity-90 hover:opacity-100 transition-opacity cursor-pointer group relative`}
            title={`${formattedDate}: ${uptimeValue.toFixed(2)}% uptime`}
          >
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50">
              <div className="bg-popover text-popover-foreground text-xs rounded-md shadow-lg px-3 py-2 whitespace-nowrap border">
                <div className="font-medium">{formattedDate}</div>
                <div className="text-muted-foreground">
                  {uptimeValue.toFixed(2)}% uptime
                </div>
                <div className={config.textColor}>{config.label}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ServiceCard({ service }: { service: ServiceStatus }) {
  const config = statusConfig[service.status] || statusConfig.unknown;
  const Icon = config.icon;

  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${config.bgColor}`}>
            <Icon className={`h-4 w-4 ${config.textColor}`} />
          </div>
          <h3 className="font-medium">{service.name}</h3>
        </div>
        <div className="text-right">
          <div className={`text-sm font-medium ${config.textColor}`}>
            {config.label}
          </div>
          {service.response_time_ms && (
            <div className="text-xs text-muted-foreground">
              {service.response_time_ms}ms
            </div>
          )}
        </div>
      </div>

      {/* 90-day uptime bar */}
      <UptimeBar service={service} />

      <div className="flex justify-between text-xs text-muted-foreground">
        <span>90 days ago</span>
        <span className="font-medium">{service.uptime_90_days.toFixed(2)}% uptime</span>
        <span>Today</span>
      </div>
    </div>
  );
}

function IncidentCard({ incident, isExpanded, onToggle }: {
  incident: Incident;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const impact = impactConfig[incident.impact];
  const isResolved = incident.status === "resolved";

  return (
    <div className="border rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full p-4 text-left hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-medium">{incident.title}</h3>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                isResolved
                  ? "bg-green-500/10 text-green-600"
                  : "bg-yellow-500/10 text-yellow-600"
              }`}>
                {incident.status}
              </span>
            </div>
            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
              <span className={impact.color}>Impact: {impact.label}</span>
              <span>
                {new Date(incident.started_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            {incident.affected_services.length > 0 && (
              <div className="flex gap-1 mt-2">
                {incident.affected_services.map((service) => (
                  <span
                    key={service}
                    className="text-xs bg-muted px-2 py-0.5 rounded"
                  >
                    {service}
                  </span>
                ))}
              </div>
            )}
          </div>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </button>

      {isExpanded && incident.updates.length > 0 && (
        <div className="border-t px-4 py-3 space-y-3 bg-muted/30">
          {incident.updates.map((update, index) => (
            <div key={index} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                {index < incident.updates.length - 1 && (
                  <div className="w-0.5 flex-1 bg-border mt-1" />
                )}
              </div>
              <div className="flex-1 pb-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="capitalize font-medium text-foreground">
                    {update.status}
                  </span>
                  <span>
                    {new Date(update.posted_at).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <p className="text-sm mt-1">{update.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function StatusPage() {
  const [data, setData] = useState<StatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedIncident, setExpandedIncident] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStatus = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/status`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch status");
      }
      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load status");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchStatus();
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <XCircle className="h-12 w-12 text-red-500" />
        <h2 className="text-xl font-medium">Unable to load status</h2>
        <p className="text-muted-foreground">{error}</p>
        <Button onClick={handleRefresh} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Try again
        </Button>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="container max-w-4xl mx-auto px-4 py-12 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold">System Status</h1>
        <p className="text-muted-foreground">
          Current status of CueSports Africa services
        </p>
      </div>


      {/* Active Incidents */}
      {data.active_incidents.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Active Incidents</h2>
          <div className="space-y-3">
            {data.active_incidents.map((incident) => (
              <IncidentCard
                key={incident.id}
                incident={incident}
                isExpanded={expandedIncident === incident.id}
                onToggle={() =>
                  setExpandedIncident(
                    expandedIncident === incident.id ? null : incident.id
                  )
                }
              />
            ))}
          </div>
        </div>
      )}

      {/* Services */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Services</h2>
        <div className="space-y-4">
          {data.services.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>
      </div>

      {/* Recent Incidents */}
      {data.recent_incidents.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Past Incidents</h2>
          <p className="text-sm text-muted-foreground">
            Incidents resolved in the last 7 days
          </p>
          <div className="space-y-3">
            {data.recent_incidents.map((incident) => (
              <IncidentCard
                key={incident.id}
                incident={incident}
                isExpanded={expandedIncident === incident.id}
                onToggle={() =>
                  setExpandedIncident(
                    expandedIncident === incident.id ? null : incident.id
                  )
                }
              />
            ))}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="border-t pt-6">
        <h3 className="text-sm font-medium mb-3">Status Legend</h3>
        <div className="flex flex-wrap gap-4">
          {Object.entries(statusConfig)
            .filter(([key]) => key !== "unknown")
            .map(([key, config]) => (
              <div key={key} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded ${config.color}`} />
                <span className="text-sm text-muted-foreground">
                  {config.label}
                </span>
              </div>
            ))}
        </div>
      </div>

    </div>
  );
}
