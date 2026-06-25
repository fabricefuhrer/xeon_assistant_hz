import type { Cpu, Filters, Workload } from "@/data/types";
import { perfDollar, perfWatt, socketCount, totalCores } from "./metrics";

export function workloadLabel(workload: Workload) {
  const labels: Record<Workload, string> = {
    any: "Optimize Choice", "hpc-ai": "HPC / AI", database: "Database & Analytics",
    web: "Web & Microservices", cloud: "Cloud Native", storage: "Infrastructure & Storage"
  };
  return labels[workload];
}

export function workloadFit(cpu: Cpu, workload: Workload) {
  if (workload === "any") return 1;
  if (workload === "hpc-ai") return cpu.coreType === "P-Cores" ? 1.35 : 0.55;
  if (workload === "database") return cpu.coreType === "P-Cores" ? 1.25 : 0.75;
  if (["web", "cloud"].includes(workload)) return cpu.coreType === "E-Cores" ? 1.35 : 0.75;
  if (workload === "storage") return cpu.tdpW <= 250 ? 1.18 : 0.9;
  return 1;
}

export function scoreCpu(cpu: Cpu, filters: Filters) {
  const spec = cpu.specInt2017, cores = totalCores(cpu), value = perfDollar(cpu), efficiency = perfWatt(cpu), turbo = cpu.maxTurboGHz;
  let score = spec * 0.55 + cores * 4 + value * 120 + efficiency * 90 + turbo * 35;
  if (filters.system === "sr250-v3" || filters.system === "st50-v3") {
    score = spec * 0.45 + cpu.cores * 18 + turbo * 45 + efficiency * 140 - cpu.tdpW * 0.9;
    if (cpu.tdpW <= 65) score += 45;
    if (cpu.family === "Xeon E" || cpu.family === "Xeon 6300") score += 40;
  }
  if (filters.workload === "any") score += value * 90 + efficiency * 60;
  if (filters.workload === "database") score += cpu.cacheMB * 0.45 + turbo * 35 + (cpu.coreType === "P-Cores" ? 90 : -40);
  if (filters.workload === "hpc-ai") score += spec * 0.32 + cores * 2.4 + turbo * 55 + (["Extended", "Specialised"].includes(cpu.segment) ? 85 : 0) + (cpu.coreType === "P-Cores" ? 130 : -240);
  if (filters.workload === "web" || filters.workload === "cloud") score += cores * 7 + efficiency * 125 + (cpu.coreType === "E-Cores" ? 220 : -120);
  if (filters.workload === "storage") score += socketCount(cpu) >= 2 ? 85 : 0;
  return Math.round(score * workloadFit(cpu, filters.workload));
}
