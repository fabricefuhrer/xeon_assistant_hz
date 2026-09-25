import type { Cpu, Filters, SystemModel } from "@/data/types";
import { avgCores, maxSocketCount, totalCost } from "./metrics";
import { systems } from "@/data/systems";

const entrySystems: SystemModel[] = ["st50-v3", "sr250-v3"];
const rackSystems: SystemModel[] = ["sr630-v4", "sr650-v4", "sr680a-v4", "sr850-v4", "sr860-v4"];

export function isEntryServerCpu(cpu: Cpu) {
  return cpu.family === "Intel Pentium" || cpu.family === "Xeon E" || cpu.family === "Xeon 6300" || cpu.codename === "Raptor Lake";
}
export function isRackServer(system: SystemModel) { return rackSystems.includes(system); }

export function systemCompatible(cpu: Cpu, filters: Pick<Filters, "system">) {
  if (filters.system === "any") return false;
  if (entrySystems.includes(filters.system)) return isEntryServerCpu(cpu);
  if (isEntryServerCpu(cpu)) return false;
  if (cpu.coreType === "E-Cores") return filters.system === "sr630-v4";
  if (cpu.coreType === "P-Cores" && (cpu.family === "Xeon 6500" || cpu.family === "Xeon 6700")) return rackSystems.includes(filters.system);
  return false;
}

export function allowedByFilters(cpu: Cpu, filters: Filters) {
  if (!systemCompatible(cpu, filters)) return false;
  const system = systems[filters.system];
  if (system.maxTdp && cpu.tdpW > system.maxTdp) return false;
  if (totalCost(cpu) > filters.maxBudget) return false;
  if (avgCores(cpu) < filters.minAvgCores) return false;
  if (cpu.tdpW > filters.maxTdp) return false;
  if (cpu.specInt2017 < filters.minSpec) return false;
  if (filters.coreKind === "p" && cpu.coreType !== "P-Cores") return false;
  if (filters.coreKind === "e" && cpu.coreType !== "E-Cores") return false;
  if (filters.segment !== "all" && cpu.segment !== filters.segment) return false;
  if (filters.scalability !== "any" && maxSocketCount(cpu) < Number(filters.scalability.replace("S", ""))) return false;
  if (filters.socket !== "any" && Number(filters.socket) > maxSocketCount(cpu)) return false;
  return true;
}