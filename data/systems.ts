import type { Filters, SystemModel } from "./types";

export const systems: Record<SystemModel, { label: string; maxSockets: number; allowE: boolean; maxTdp?: number; description: string }> = {
  any: { label: "Any System", maxSockets: 4, allowE: true, description: "Select a concrete system for compatibility validation." },
  "st50-v3": { label: "ThinkSystem ST50 V3", maxSockets: 1, allowE: false, maxTdp: 125, description: "Entry level tower/server platform." },
  "sr250-v3": { label: "ThinkSystem SR250 V3", maxSockets: 1, allowE: false, maxTdp: 95, description: "Entry level 1U server platform." },
  "sr630-v4": { label: "ThinkSystem SR630 V4", maxSockets: 2, allowE: true, maxTdp: 350, description: "1U rack server. Supports P-Cores and selected E-Cores." },
  "sr650-v4": { label: "ThinkSystem SR650 V4", maxSockets: 2, allowE: false, maxTdp: 350, description: "2U rack server for Xeon 6500/6700 P-Cores." },
  "sr680a-v4": { label: "ThinkSystem SR680a V4", maxSockets: 2, allowE: false, maxTdp: 350, description: "Accelerated rack platform for Xeon 6500/6700 P-Cores." },
  "sr850-v4": { label: "ThinkSystem SR850 V4", maxSockets: 4, allowE: false, maxTdp: 350, description: "4-socket capable rack platform for compatible P-Core CPUs." },
  "sr860-v4": { label: "ThinkSystem SR860 V4", maxSockets: 4, allowE: false, maxTdp: 350, description: "4-socket capable rack platform for compatible P-Core CPUs." }
};

export const defaultFilters: Filters = {
  workload: "database", system: "sr650-v4", maxBudget: 15000, minAvgCores: 4,
  maxTdp: 400, minSpec: 0, coreKind: "all", segment: "all", scalability: "any", socket: "any"
};
