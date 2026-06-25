export type Segment = "Extended" | "Mainstream" | "Specialised" | "TCE";
export type CoreType = "P-Cores" | "E-Cores";
export type Workload = "any" | "hpc-ai" | "database" | "web" | "cloud" | "storage";
export type SystemModel = "any" | "st50-v3" | "sr250-v3" | "sr630-v4" | "sr650-v4" | "sr680a-v4" | "sr850-v4" | "sr860-v4";

export type Cpu = {
  sku: string; family: string; codename: string; coreType: CoreType; cores: number;
  maxTurboGHz: number; baseGHz: number; cacheMB: number; tdpW: number; costUsd: number;
  chips: number; specInt2017: number; maxScalability: string; segment: Segment;
};

export type Filters = {
  workload: Workload; system: SystemModel; maxBudget: number; minAvgCores: number;
  maxTdp: number; minSpec: number; coreKind: "all" | "p" | "e";
  segment: "all" | Segment; scalability: "any" | "1S" | "2S" | "4S";
  socket: "any" | "1" | "2" | "4";
};
