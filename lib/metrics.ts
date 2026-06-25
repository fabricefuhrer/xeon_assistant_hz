import type { Cpu } from "@/data/types";
export function socketCount(cpu: Cpu) { return parseInt(cpu.maxScalability.replace("S", ""), 10) || 1; }
export function totalCores(cpu: Cpu) { return cpu.cores * socketCount(cpu); }
export function totalCost(cpu: Cpu) { return cpu.costUsd * socketCount(cpu); }
export function totalTdp(cpu: Cpu) { return cpu.tdpW * socketCount(cpu); }
export function pCores(cpu: Cpu) { return cpu.coreType === "P-Cores" ? cpu.cores : 0; }
export function eCores(cpu: Cpu) { return cpu.coreType === "E-Cores" ? cpu.cores : 0; }
export function avgCores(cpu: Cpu) { return pCores(cpu) + eCores(cpu); }
export function perfDollar(cpu: Cpu) { return cpu.specInt2017 / Math.max(1, totalCost(cpu)); }
export function perfWatt(cpu: Cpu) { return cpu.specInt2017 / Math.max(1, totalTdp(cpu)); }
export function fmtMoney(v: number) { return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v); }
export function normalize(v: number, min: number, max: number) { return max === min ? 60 : Math.round(20 + ((v - min) / (max - min)) * 80); }
