import type { Filters, SystemModel } from "./types";

export const systems: Record<SystemModel, { label: string; maxSockets: number; allowE: boolean; maxTdp?: number; description: string; lenovoPress?: string }> = {
  any: { label: "Any System", maxSockets: 4, allowE: true, description: "Select a concrete system for compatibility validation." },
  "st50-v3": { label: "ThinkSystem ST50 V3", maxSockets: 1, allowE: false, maxTdp: 95, description: "Entry level tower/server platform. Compatible with Xeon 6300 P-series.", lenovoPress:"https://lenovopress.lenovo.com/lp1907-thinksystem-st50-v3-server" },
  "sr250-v3": { label: "ThinkSystem SR250 V3", maxSockets: 1, allowE: false, maxTdp: 95, description: "Entry level 1U server platform. Compatible with Xeon 6300 P-series.", lenovoPress:"https://lenovopress.lenovo.com/lp1802-thinksystem-sr250-v3-server" },
  "sr630-v4": { label: "ThinkSystem SR630 V4", maxSockets: 2, allowE: true, maxTdp: 350, description: "1U rack server. Supports P-Cores and selected E-Cores.", lenovoPress:"https://lenovopress.lenovo.com/lp1971-thinksystem-sr630-v4-server" },
  "sr650-v4": { label: "ThinkSystem SR650 V4", maxSockets: 2, allowE: false, maxTdp: 350, description: "2U rack server for Xeon 6500/6700 P-Cores.", lenovoPress:"https://lenovopress.lenovo.com/lp2127-thinksystem-sr650-v4-server" },
  "sr680a-v4": { label: "ThinkSystem SR680a V4", maxSockets: 2, allowE: false, maxTdp: 350, description: "Accelerated rack platform for Xeon 6500/6700 P-Cores.", lenovoPress:"https://lenovopress.lenovo.com/lp2264-thinksystem-sr680a-v4-server" },
  "sr850-v4": { label: "ThinkSystem SR850 V4", maxSockets: 4, allowE: false, maxTdp: 350, description: "4-socket capable rack platform for compatible P-Core CPUs.", lenovoPress:"https://lenovopress.lenovo.com/lp2230-thinksystem-sr850-v4-server" },
  "sr860-v4": { label: "ThinkSystem SR860 V4", maxSockets: 4, allowE: false, maxTdp: 350, description: "4-socket capable rack platform for compatible P-Core CPUs.", lenovoPress:"https://lenovopress.lenovo.com/lp2231-thinksystem-sr860-v4-server" }
};

export const defaultFilters: Filters = {
  workload: "any", system: "sr650-v4", minAvgCores: 4,
  maxTdp: 400, minSpec: 0, coreKind: "all", segment: "all", tceOnly: true, sku: "all", family: "all", maxRcp: 25000, scalability: "all"
};
