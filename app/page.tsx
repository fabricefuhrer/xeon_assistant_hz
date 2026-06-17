"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Tooltip } from "recharts";

type Segment = "Extended" | "Mainstream" | "Specialised" | "TCE";
type CoreType = "P-Cores" | "E-Cores";
type Workload = "any" | "hpc" | "ai" | "database" | "web" | "cloud" | "edge" | "storage" | "tower";
type SystemModel = "any" | "st50-v3" | "sr630-v4" | "sr650-v4" | "sr680a-v4" | "sr850-v4" | "sr860-v4";

type Cpu = {
  sku: string;
  family: string;
  codename: string;
  coreType: CoreType;
  cores: number;
  maxTurboGHz: number;
  baseGHz: number;
  cacheMB: number;
  tdpW: number;
  costUsd: number;
  chips: number;
  specInt2017: number;
  maxScalability: string;
  segment: Segment;
};

type Filters = {
  workload: Workload;
  system: SystemModel;
  maxBudget: number;
  minAvgCores: number;
  maxTdp: number;
  minSpec: number;
  coreKind: "all" | "p" | "e";
  segment: "all" | Segment;
  scalability: "any" | "1S" | "2S" | "4S";
  socket: "any" | "1" | "2" | "4";
};

const cpuCatalog: Cpu[] = [
  { sku: "6315P", family: "Xeon 6300", codename: "Raptor Lake", coreType: "P-Cores", cores: 4, maxTurboGHz: 5.2, baseGHz: 2.8, cacheMB: 12, tdpW: 55, costUsd: 199, chips: 1, specInt2017: 41.6, maxScalability: "1S", segment: "Mainstream" },
  { sku: "6325P", family: "Xeon 6300", codename: "Raptor Lake", coreType: "P-Cores", cores: 4, maxTurboGHz: 5.2, baseGHz: 3.5, cacheMB: 12, tdpW: 55, costUsd: 253, chips: 1, specInt2017: 50.9, maxScalability: "1S", segment: "Mainstream" },
  { sku: "6333P", family: "Xeon 6300", codename: "Raptor Lake", coreType: "P-Cores", cores: 6, maxTurboGHz: 4.7, baseGHz: 3.1, cacheMB: 18, tdpW: 65, costUsd: 287, chips: 1, specInt2017: 71.1, maxScalability: "1S", segment: "TCE" },
  { sku: "6337P", family: "Xeon 6300", codename: "Raptor Lake", coreType: "P-Cores", cores: 6, maxTurboGHz: 5.3, baseGHz: 3.5, cacheMB: 18, tdpW: 80, costUsd: 337, chips: 1, specInt2017: 75.8, maxScalability: "1S", segment: "Extended" },
  { sku: "6349P", family: "Xeon 6300", codename: "Raptor Lake", coreType: "P-Cores", cores: 6, maxTurboGHz: 5.7, baseGHz: 3.6, cacheMB: 18, tdpW: 95, costUsd: 455, chips: 1, specInt2017: 79.2, maxScalability: "1S", segment: "Extended" },
  { sku: "6353P", family: "Xeon 6300", codename: "Raptor Lake", coreType: "P-Cores", cores: 8, maxTurboGHz: 5.4, baseGHz: 2.7, cacheMB: 24, tdpW: 65, costUsd: 383, chips: 1, specInt2017: 84.4, maxScalability: "1S", segment: "Mainstream" },
  { sku: "6357P", family: "Xeon 6300", codename: "Raptor Lake", coreType: "P-Cores", cores: 8, maxTurboGHz: 5.4, baseGHz: 3.0, cacheMB: 24, tdpW: 80, costUsd: 500, chips: 1, specInt2017: 96.6, maxScalability: "1S", segment: "Mainstream" },
  { sku: "6369P", family: "Xeon 6300", codename: "Raptor Lake", coreType: "P-Cores", cores: 8, maxTurboGHz: 5.7, baseGHz: 3.3, cacheMB: 24, tdpW: 95, costUsd: 545, chips: 1, specInt2017: 98.8, maxScalability: "1S", segment: "Extended" },
  { sku: "6505P", family: "Xeon 6500", codename: "Granite Rapids", coreType: "P-Cores", cores: 12, maxTurboGHz: 4.1, baseGHz: 2.2, cacheMB: 48, tdpW: 150, costUsd: 435, chips: 2, specInt2017: 286, maxScalability: "2S", segment: "TCE" },
  { sku: "6507P", family: "Xeon 6500", codename: "Granite Rapids", coreType: "P-Cores", cores: 8, maxTurboGHz: 4.3, baseGHz: 3.5, cacheMB: 48, tdpW: 150, costUsd: 551, chips: 2, specInt2017: 210, maxScalability: "2S", segment: "Mainstream" },
  { sku: "6511P", family: "Xeon 6500", codename: "Granite Rapids", coreType: "P-Cores", cores: 16, maxTurboGHz: 4.2, baseGHz: 2.3, cacheMB: 72, tdpW: 150, costUsd: 640, chips: 1, specInt2017: 195, maxScalability: "1S", segment: "Extended" },
  { sku: "6515P", family: "Xeon 6500", codename: "Granite Rapids", coreType: "P-Cores", cores: 16, maxTurboGHz: 3.8, baseGHz: 2.3, cacheMB: 72, tdpW: 150, costUsd: 515, chips: 2, specInt2017: 373, maxScalability: "2S", segment: TCEe" },
  { sku: "6517P", family: "Xeon 6500", codename: "Granite Rapids", coreType: "P-Cores", cores: 16, maxTurboGHz: 4.2, baseGHz: 3.2, cacheMB: 72, tdpW: 190, costUsd: 850, chips: 2, specInt2017: 388, maxScalability: "2S", segment: "TCE" },
  { sku: "6520P", family: "Xeon 6500", codename: "Granite Rapids", coreType: "P-Cores", cores: 24, maxTurboGHz: 4.0, baseGHz: 2.4, cacheMB: 144, tdpW: 210, costUsd: 950, chips: 2, specInt2017: 522, maxScalability: "2S", segment: "TCE" },
  { sku: "6521P", family: "Xeon 6500", codename: "Granite Rapids", coreType: "P-Cores", cores: 24, maxTurboGHz: 4.1, baseGHz: 2.6, cacheMB: 144, tdpW: 225, costUsd: 900, chips: 1, specInt2017: 296, maxScalability: "1S", segment: "Extended" },
  { sku: "6527P", family: "Xeon 6500", codename: "Granite Rapids", coreType: "P-Cores", cores: 24, maxTurboGHz: 4.2, baseGHz: 3.0, cacheMB: 144, tdpW: 255, costUsd: 1910, chips: 2, specInt2017: 592, maxScalability: "2S", segment: "TCE" },
  { sku: "6530P", family: "Xeon 6500", codename: "Granite Rapids", coreType: "P-Cores", cores: 32, maxTurboGHz: 4.1, baseGHz: 2.3, cacheMB: 144, tdpW: 225, costUsd: 1800, chips: 2, specInt2017: 706, maxScalability: "2S", segment: "TCE" },
  { sku: "6710E", family: "Xeon 6700", codename: "Sierra Forest", coreType: "E-Cores", cores: 64, maxTurboGHz: 3.2, baseGHz: 2.4, cacheMB: 96, tdpW: 205, costUsd: 1181, chips: 2, specInt2017: 695, maxScalability: "2S", segment: "Extended" },
  { sku: "6714P", family: "Xeon 6700", codename: "Granite Rapids", coreType: "P-Cores", cores: 8, maxTurboGHz: 4.3, baseGHz: 4.0, cacheMB: 48, tdpW: 165, costUsd: 2250, chips: 2, specInt2017: 210, maxScalability: "2S", segment: "Specialised" },
  { sku: "6724P", family: "Xeon 6700", codename: "Granite Rapids", coreType: "P-Cores", cores: 16, maxTurboGHz: 4.3, baseGHz: 3.6, cacheMB: 72, tdpW: 210, costUsd: 2467, chips: 2, specInt2017: 402, maxScalability: "2S", segment: "TCE" },
  { sku: "6728P", family: "Xeon 6700", codename: "Granite Rapids", coreType: "P-Cores", cores: 24, maxTurboGHz: 4.1, baseGHz: 2.7, cacheMB: 144, tdpW: 210, costUsd: 1450, chips: 4, specInt2017: 1120, maxScalability: "4S", segment: "Mainstream" },
  { sku: "6731E", family: "Xeon 6700", codename: "Sierra Forest", coreType: "E-Cores", cores: 96, maxTurboGHz: 3.1, baseGHz: 2.2, cacheMB: 96, tdpW: 250, costUsd: 1209, chips: 1, specInt2017: 493, maxScalability: "1S", segment: "Extended" },
  { sku: "6731P", family: "Xeon 6700", codename: "Granite Rapids", coreType: "P-Cores", cores: 32, maxTurboGHz: 4.1, baseGHz: 2.5, cacheMB: 144, tdpW: 245, costUsd: 1700, chips: 1, specInt2017: 371, maxScalability: "1S", segment: "Extended" },
  { sku: "6736P", family: "Xeon 6700", codename: "Granite Rapids", coreType: "P-Cores", cores: 36, maxTurboGHz: 4.1, baseGHz: 2.0, cacheMB: 144, tdpW: 205, costUsd: 2400, chips: 2, specInt2017: 735, maxScalability: "2S", segment: "Extended" },
  { sku: "6737P", family: "Xeon 6700", codename: "Granite Rapids", coreType: "P-Cores", cores: 32, maxTurboGHz: 4.0, baseGHz: 2.9, cacheMB: 144, tdpW: 270, costUsd: 2750, chips: 2, specInt2017: 749, maxScalability: "2S", segment: "TCE" },
  { sku: "6738P", family: "Xeon 6700", codename: "Granite Rapids", coreType: "P-Cores", cores: 32, maxTurboGHz: 4.2, baseGHz: 2.9, cacheMB: 144, tdpW: 270, costUsd: 3500, chips: 4, specInt2017: 1460, maxScalability: "4S", segment: "Mainstream" },
  { sku: "6740E", family: "Xeon 6700", codename: "Sierra Forest", coreType: "E-Cores", cores: 96, maxTurboGHz: 3.2, baseGHz: 2.4, cacheMB: 96, tdpW: 250, costUsd: 1331, chips: 2, specInt2017: 979, maxScalability: "2S", segment: "Extended" },
  { sku: "6740P", family: "Xeon 6700", codename: "Granite Rapids", coreType: "P-Cores", cores: 48, maxTurboGHz: 3.8, baseGHz: 2.1, cacheMB: 288, tdpW: 270, costUsd: 2700, chips: 2, specInt2017: 972, maxScalability: "2S", segment: "Mainstream" },
  { sku: "6745P", family: "Xeon 6700", codename: "Granite Rapids", coreType: "P-Cores", cores: 32, maxTurboGHz: 4.3, baseGHz: 3.1, cacheMB: 336, tdpW: 300, costUsd: 3048, chips: 2, specInt2017: 785, maxScalability: "2S", segment: "Extended" },
  { sku: "6746E", family: "Xeon 6700", codename: "Sierra Forest", coreType: "E-Cores", cores: 112, maxTurboGHz: 2.7, baseGHz: 2.0, cacheMB: 96, tdpW: 250, costUsd: 1230, chips: 2, specInt2017: 1020, maxScalability: "2S", segment: "Extended" },
  { sku: "6748P", family: "Xeon 6700", codename: "Granite Rapids", coreType: "P-Cores", cores: 48, maxTurboGHz: 4.1, baseGHz: 2.5, cacheMB: 192, tdpW: 300, costUsd: 10049, chips: 4, specInt2017: 2010, maxScalability: "4S", segment: "Specialised" },
  { sku: "6756E", family: "Xeon 6700", codename: "Sierra Forest", coreType: "E-Cores", cores: 128, maxTurboGHz: 2.6, baseGHz: 1.8, cacheMB: 96, tdpW: 225, costUsd: 1747, chips: 2, specInt2017: 1100, maxScalability: "2S", segment: "Extended" },
  { sku: "6760P", family: "Xeon 6700", codename: "Granite Rapids", coreType: "P-Cores", cores: 64, maxTurboGHz: 3.8, baseGHz: 2.2, cacheMB: 320, tdpW: 330, costUsd: 3600, chips: 2, specInt2017: 1250, maxScalability: "2S", segment: "Extended" },
  { sku: "6761P", family: "Xeon 6700", codename: "Granite Rapids", coreType: "P-Cores", cores: 64, maxTurboGHz: 3.9, baseGHz: 2.5, cacheMB: 336, tdpW: 350, costUsd: 3600, chips: 1, specInt2017: 663, maxScalability: "1S", segment: "Extended" },
  { sku: "6766E", family: "Xeon 6700", codename: "Sierra Forest", coreType: "E-Cores", cores: 144, maxTurboGHz: 2.7, baseGHz: 1.9, cacheMB: 108, tdpW: 250, costUsd: 2217, chips: 2, specInt2017: 1240, maxScalability: "2S", segment: "Extended" },
  { sku: "6767P", family: "Xeon 6700", codename: "Granite Rapids", coreType: "P-Cores", cores: 64, maxTurboGHz: 3.9, baseGHz: 2.4, cacheMB: 336, tdpW: 350, costUsd: 4450, chips: 2, specInt2017: 1300, maxScalability: "2S", segment: "Mainstream" },
  { sku: "6768P", family: "Xeon 6700", codename: "Granite Rapids", coreType: "P-Cores", cores: 64, maxTurboGHz: 3.9, baseGHz: 2.4, cacheMB: 336, tdpW: 330, costUsd: 12226, chips: 4, specInt2017: 2490, maxScalability: "4S", segment: "Specialised" },
  { sku: "6780E", family: "Xeon 6700", codename: "Sierra Forest", coreType: "E-Cores", cores: 144, maxTurboGHz: 3.0, baseGHz: 2.2, cacheMB: 108, tdpW: 330, costUsd: 2354, chips: 2, specInt2017: 1350, maxScalability: "2S", segment: "Extended" },
  { sku: "6781P", family: "Xeon 6700", codename: "Granite Rapids", coreType: "P-Cores", cores: 80, maxTurboGHz: 3.8, baseGHz: 2.0, cacheMB: 336, tdpW: 350, costUsd: 4000, chips: 1, specInt2017: 745, maxScalability: "1S", segment: "Extended" },
  { sku: "6787P", family: "Xeon 6700", codename: "Granite Rapids", coreType: "P-Cores", cores: 86, maxTurboGHz: 3.8, baseGHz: 2.0, cacheMB: 336, tdpW: 350, costUsd: 4300, chips: 2, specInt2017: 1540, maxScalability: "2S", segment: "Specialised" },
  { sku: "6788P", family: "Xeon 6700", codename: "Granite Rapids", coreType: "P-Cores", cores: 86, maxTurboGHz: 3.8, baseGHz: 2.0, cacheMB: 336, tdpW: 350, costUsd: 14520, chips: 4, specInt2017: 2910, maxScalability: "4S", segment: "Specialised" }
];

const systems: Record<SystemModel, { label: string; maxSockets: number; tower?: boolean; allowedSegments?: Segment[]; allowE: boolean; maxTdp?: number }> = {
  any: { label: "Any System", maxSockets: 4, allowE: true },
  "st50-v3": { label: "ThinkSystem ST50 V3", maxSockets: 1, tower: true, allowedSegments: ["tce"], allowE: false, maxTdp: 125 },
  "sr630-v4": { label: "ThinkSystem SR630 V4", maxSockets: 2, allowE: true, maxTdp: 350 },
  "sr650-v4": { label: "ThinkSystem SR650 V4", maxSockets: 2, allowE: false, maxTdp: 350 },
  "sr680a-v4": { label: "ThinkSystem SR680a V4", maxSockets: 2, allowE: false, maxTdp: 350 },
  "sr850-v4": { label: "ThinkSystem SR850 V4", maxSockets: 4, allowE: false, maxTdp: 350 },
  "sr860-v4": { label: "ThinkSystem SR860 V4", maxSockets: 4, allowE: false, maxTdp: 350 }
};

const defaultFilters: Filters = {
  workload: "database",
  system: "any",
  maxBudget: 15000,
  minAvgCores: 4,
  maxTdp: 400,
  minSpec: 0,
  coreKind: "all",
  segment: "all",
  scalability: "any",
  socket: "any"
};

function socketCount(cpu: Cpu) { return parseInt(cpu.maxScalability.replace("S", ""), 10) || 1; }
function totalCores(cpu: Cpu) { return cpu.cores * socketCount(cpu); }
function totalCost(cpu: Cpu) { return cpu.costUsd * socketCount(cpu); }
function totalTdp(cpu: Cpu) { return cpu.tdpW * socketCount(cpu); }
function pCores(cpu: Cpu) { return cpu.coreType === "P-Cores" ? cpu.cores : 0; }
function eCores(cpu: Cpu) { return cpu.coreType === "E-Cores" ? cpu.cores : 0; }
function avgCores(cpu: Cpu) { return pCores(cpu) + eCores(cpu); }
function perfDollar(cpu: Cpu) { return cpu.specInt2017 / Math.max(1, totalCost(cpu)); }
function perfWatt(cpu: Cpu) { return cpu.specInt2017 / Math.max(1, totalTdp(cpu)); }
function fmtMoney(v: number) { return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v); }
function normalize(v: number, min: number, max: number) { return max === min ? 60 : Math.round(20 + ((v - min) / (max - min)) * 80); }

function workloadFit(cpu: Cpu, workload: Workload) {
  if (workload === "any") return 1;
  if (workload === "tower") return cpu.segment === "tce" ? 1.35 : 0.2;
  if (["hpc", "ai", "database"].includes(workload)) return cpu.coreType === "P-Cores" ? 1.25 : 0.75;
  if (["web", "cloud"].includes(workload)) return cpu.coreType === "E-Cores" ? 1.35 : 0.75;
  if (["edge", "storage"].includes(workload)) return cpu.tdpW <= 250 ? 1.18 : 0.9;
  return 1;
}

function systemCompatible(cpu: Cpu, filters: Filters) {
  if (filters.system === "any") return true;

  // 63XX -> ST50 only
  if (cpu.family === "Xeon 6300") {
    return filters.system === "st50-v3";
  }

  // E-Cores -> SR630 V4 only
  if (cpu.coreType === "E-Cores") {
    return filters.system === "sr630-v4";
  }

  // 65XX + 67XX P-Cores -> all rack servers
  return [
    "sr630-v4",
    "sr650-v4",
    "sr680a-v4",
    "sr850-v4",
    "sr860-v4"
  ].includes(filters.system);
}

function allowedByFilters(cpu: Cpu, filters: Filters) {

  // 63XX only for Tower workload
  if (cpu.family === "Xeon 6300" && filters.system !== "st50-v3") return false;

  // P-Cores selector should only show 6500 and 6700 families
  if (
    filters.coreKind === "p" &&
    !["Xeon 6500", "Xeon 6700"].includes(cpu.family)
  ) return false;

  // E-Cores only allowed on SR630 V4

  if (totalCost(cpu) > filters.maxBudget) return false;
  if (avgCores(cpu) < filters.minAvgCores) return false;
  if (cpu.tdpW > filters.maxTdp) return false;
  if (cpu.specInt2017 < filters.minSpec) return false;

  if (filters.coreKind === "p" && cpu.coreType !== "P-Cores") return false;
  if (filters.coreKind === "e" && cpu.coreType !== "E-Cores") return false;

  if (filters.segment !== "all" && cpu.segment !== filters.segment) return false;
  if (filters.scalability !== "any" && cpu.maxScalability !== filters.scalability) return false;
  if (filters.socket !== "any" && cpu.chips !== Number(filters.socket)) return false;

  if (filters.workload === "tower" && cpu.segment !== "tce") return false;
  if (filters.workload === "hpc" && cpu.coreType !== "P-Cores") return false;
  if (filters.workload === "ai" && cpu.coreType !== "P-Cores") return false;
  if (["web", "cloud"].includes(filters.workload) && cpu.coreType !== "E-Cores") return false;

  if (!systemCompatible(cpu, filters)) return false;

  return true;
}

function scoreCpu(cpu: Cpu, filters: Filters) {
  const spec = cpu.specInt2017;
  const cores = totalCores(cpu);
  const value = perfDollar(cpu);
  const efficiency = perfWatt(cpu);
  const turbo = cpu.maxTurboGHz;
  const fit = workloadFit(cpu, filters.workload);

  let score = spec * 0.58 + cores * 4 + value * 160 + efficiency * 80 + turbo * 35;

  if (filters.workload === "database") score += cpu.cacheMB * 0.4 + turbo * 30;
  if (filters.workload === "hpc") score += spec * 0.25 + cores * 2;
  if (filters.workload === "ai") score += turbo * 50 + (cpu.segment === "extended" ? 80 : 0);
  if (filters.workload === "web" || filters.workload === "cloud") score += cores * 7 + efficiency * 120;
  if (filters.workload === "edge") score += cpu.tdpW <= 250 ? 160 : -80;
  if (filters.workload === "storage") score += socketCount(cpu) >= 2 ? 80 : 0;
  if (filters.workload === "tower") score += cpu.segment === "tce" ? 300 : -500;

  return Math.round(score * fit);
}

function Panel({ children, className = "", style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return <div className={`panel ${className}`} style={{ background: "linear-gradient(180deg,rgba(10,27,42,.96),rgba(5,17,27,.96))", border: "1px solid #25445c", borderRadius: 8, boxShadow: "0 16px 50px rgba(0,0,0,.28)", overflow: "hidden", ...style }}>{children}</div>;
}
function Title({ children, color = "#18a8ff" }: { children: React.ReactNode; color?: string }) {
  return <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(97,145,175,.25)", fontWeight: 800, color, textTransform: "uppercase", letterSpacing: .3 }}>{children}</div>;
}
function Info() { return <span style={{ color: "#18a8ff", fontSize: 12 }}>ⓘ</span>; }
function Stat({ label, value, accent = "#18a8ff" }: { label: string; value: string | number; accent?: string }) {
  return <div style={{ border: "1px solid #25445c", borderRadius: 7, padding: "12px 10px", textAlign: "center", background: "rgba(9,24,37,.85)" }}><div style={{ color: accent, fontSize: 12, marginBottom: 6 }}>{label}</div><div style={{ fontWeight: 800, fontSize: 24 }}>{value}</div></div>;
}
function Mini({ label, value }: { label: string; value: string | number }) {
  return <div style={{ border: "1px solid #25445c", borderRadius: 6, padding: "12px 8px", textAlign: "center", background: "rgba(255,255,255,.03)" }}><div style={{ fontWeight: 900, fontSize: 18 }}>{value}</div><div style={{ fontSize: 11, marginTop: 6, color: "#d8e1e8" }}>{label}</div></div>;
}

const selectStyle: React.CSSProperties = { width: "100%", padding: "8px 10px", background: "#071724", border: "1px solid #38566d", borderRadius: 4, color: "#fff" };
const th: React.CSSProperties = { background: "rgba(255,255,255,.04)", border: "1px solid rgba(97,145,175,.22)", padding: "9px", textAlign: "center", fontWeight: 700, whiteSpace: "nowrap" };
const td: React.CSSProperties = { border: "1px solid rgba(97,145,175,.18)", padding: "8px", textAlign: "center", color: "#eaf2f8", whiteSpace: "nowrap" };

function Select({ label, value, onChange, opts }: { label: string; value: string; onChange: (v: string) => void; opts: string[][] }) {
  return <div style={{ display: "grid", gridTemplateColumns: "1fr 1.65fr", alignItems: "center", gap: 10, marginBottom: 10, fontSize: 13 }}><label>{label} <Info /></label><select value={value} onChange={e => onChange(e.target.value)} style={selectStyle}>{opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></div>;
}

function RankPanel({ title, color, rows, header }: { title: string; color: string; rows: string[][]; header: string }) {
  return <Panel><Title color={color}>{title}</Title><div style={{ padding: "8px 14px 12px" }}><table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}><thead><tr><th style={{ ...td, textAlign: "left" }}>Rank</th><th style={{ ...td, textAlign: "left" }}>CPU</th><th style={{ ...td, textAlign: "right" }}>{header}</th></tr></thead><tbody>{rows.map((r, i) => <tr key={r[0]}><td style={{ ...td, textAlign: "left" }}>{i + 1}</td><td style={{ ...td, textAlign: "left" }}>Xeon {r[0]}</td><td style={{ ...td, textAlign: "right", color, fontWeight: 800 }}>{r[1]}</td></tr>)}</tbody></table><div style={{ fontSize: 12, color: "#9fb0bd", marginTop: 10 }}>Higher is better</div></div></Panel>;
}

export default function Page() {
  const [pending, setPending] = useState<Filters>(defaultFilters);
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [sortBy, setSortBy] = useState("score");

  const filtered = useMemo(() => cpuCatalog.filter(cpu => allowedByFilters(cpu, filters)).sort((a, b) => {
    if (sortBy === "score") return scoreCpu(b, filters) - scoreCpu(a, filters);
    if (sortBy === "value") return perfDollar(b) - perfDollar(a);
    if (sortBy === "efficiency") return perfWatt(b) - perfWatt(a);
    if (sortBy === "price") return totalCost(a) - totalCost(b);
    return b.specInt2017 - a.specInt2017;
  }), [filters, sortBy]);

  const top = filtered[0] || cpuCatalog[0];
  const bestValue = [...filtered].sort((a, b) => perfDollar(b) - perfDollar(a)).slice(0, 5);
  const topPerformance = [...filtered].sort((a, b) => b.specInt2017 - a.specInt2017).slice(0, 5);
  const bestPerf = topPerformance[0] || top;
  const mostP = [...filtered].sort((a, b) => pCores(b) - pCores(a))[0] || top;
  const mostE = [...filtered].sort((a, b) => eCores(b) - eCores(a))[0] || top;
  const lowestTdp = [...filtered].sort((a, b) => a.tdpW - b.tdpW)[0] || top;
  const highTurbo = [...filtered].sort((a, b) => b.maxTurboGHz - a.maxTurboGHz)[0] || top;
  const efficient = [...filtered].sort((a, b) => perfWatt(b) - perfWatt(a))[0] || top;
  const maxScalability = [...filtered].sort((a, b) => socketCount(b) - socketCount(a))[0] || top;
  const selectedSystem = systems[filters.system];

  const radarCandidates = [top, ...topPerformance.filter(c => c.sku !== top.sku).slice(0, 4)];
  const radarData = useMemo(() => {
    const axes = ["P-Cores", "E-Cores", "SPECint2017", "Cache (MB)", "Max Turbo (GHz)"];
    const metric = (cpu: Cpu, axis: string) => axis === "P-Cores" ? pCores(cpu) : axis === "E-Cores" ? eCores(cpu) : axis === "SPECint2017" ? cpu.specInt2017 : axis === "Cache (MB)" ? cpu.cacheMB : cpu.maxTurboGHz;
    return axes.map(axis => {
      const values = radarCandidates.map(c => metric(c, axis));
      const min = Math.min(...values), max = Math.max(...values);
      const row: Record<string, string | number> = { metric: axis };
      radarCandidates.forEach(c => row[c.sku] = normalize(metric(c, axis), min, max));
      return row;
    });
  }, [top.sku, filtered.length, sortBy]);

  const exportExcel = () => {
    const headers = ["Rank", "SKU", "Family", "Codename", "Core Type", "P-Cores", "E-Cores", "Avg Cores (P+E)", "Total Cores", "Max Turbo (GHz)", "Base (GHz)", "Cache (MB)", "TDP (W)", "Total TDP", "Chips", "SPECint2017", "Perf / $", "Perf / Watt", "CPU Price (USD)", "CPU Price (USD)", "Max Scalability", "Segment", "Score"];
    const rows = filtered.map((cpu, i) => [i + 1, cpu.sku, cpu.family, cpu.codename, cpu.coreType, pCores(cpu), eCores(cpu), avgCores(cpu), totalCores(cpu), cpu.maxTurboGHz, cpu.baseGHz, cpu.cacheMB, cpu.tdpW, totalTdp(cpu), cpu.chips, cpu.specInt2017, perfDollar(cpu).toFixed(3), perfWatt(cpu).toFixed(2), cpu.costUsd, totalCost(cpu), cpu.maxScalability, cpu.segment, scoreCpu(cpu, filters)]);
    const csv = [headers, ...rows].map(r => r.map(x => `"${String(x).replaceAll('"', '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "application/vnd.ms-excel;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "xeon-ranked-list.xls";
    a.click();
    URL.revokeObjectURL(url);
  };

  const slider = (label: string, key: "maxBudget" | "minAvgCores" | "maxTdp" | "minSpec", min: number, max: number, step: number, display?: string, help?: string) => <div style={{ marginBottom: 16 }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13, marginBottom: 6 }}><span>{label} <Info /></span><span style={{ border: "1px solid #38566d", borderRadius: 4, padding: "7px 12px", minWidth: 68, textAlign: "center", background: "#071724" }}>{display ?? pending[key]}</span></div><input className="control-input" type="range" min={min} max={max} step={step} value={pending[key]} onChange={e => setPending({ ...pending, [key]: Number(e.target.value) })} style={{ width: "72%", accentColor: "#0969e8" }} />{help && <div style={{ fontSize: 11, color: "#9fb0bd", lineHeight: 1.4, marginTop: 5 }}>{help}</div>}</div>;

  return <main style={{ minHeight: "100vh", padding: 14, background: "radial-gradient(circle at 35% 10%,#0b2740 0,#06111d 35%,#020812 100%)" }}>
    <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "0 4px 14px" }}>
      <div className="logo-row" style={{ display: "flex", alignItems: "center", gap: 18 }}><Image src="/lenovo-logo.jpg" width={118} height={36} alt="Lenovo" style={{ objectFit: "contain" }} /><Image src="/intel-logo.png" width={78} height={36} alt="Intel" style={{ objectFit: "contain" }} /><div style={{ width: 1, height: 36, background: "#355064" }} /><div><h1 style={{ margin: 0, fontSize: 28 }}>Xeon Deal Assistant</h1><p style={{ margin: "3px 0 0", color: "#c9d6e0" }}>Find the best Xeon CPU by workload, system, segment, cores, budget and efficiency</p></div></div>
      <div style={{ fontSize: 12, color: "#d7e1e8" }}>Last updated: May 20, 2025</div>
    </header>

    <section className="dashboard" style={{ display: "grid", gridTemplateColumns: "320px 1fr 1.55fr 1.25fr", gap: 8 }}>
      <Panel><div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(97,145,175,.25)", display: "flex", justifyContent: "space-between" }}><b>FILTERS</b><button onClick={() => { setPending(defaultFilters); setFilters(defaultFilters); }} style={{ background: "transparent", border: 0, color: "#18a8ff" }}>Reset All</button></div><div style={{ padding: 14 }}>
        <Select label="Workload" value={pending.workload} onChange={v => setPending({ ...pending, workload: v as Workload, ...(v === "tower" ? { system: "st50-v3", segment: "tce" } : {}) })} opts={[["any", "Any Workload"], ["database", "Database & Analytics"], ["hpc", "HPC"], ["ai", "AI"], ["web", "Web & Microservices"], ["cloud", "Cloud Native"], ["edge", "Edge"], ["storage", "Infrastructure & Storage"], ["tower", "Tower"]]} />
        <Select label="System" value={pending.system} onChange={v => setPending({ ...pending, system: v as SystemModel, ...(v === "st50-v3" ? { workload: "tower", segment: "tce" } : {}) })} opts={Object.entries(systems).map(([value, item]) => [value, item.label])} />
        {slider("Max System Budget (USD)", "maxBudget", 100, 60000, 100, fmtMoney(pending.maxBudget))}
        {slider("Min Avg Cores (P + E)", "minAvgCores", 0, 172, 1, String(pending.minAvgCores), "Applies to both P-Cores and E-Cores using the visible core count field.")}
        {slider("Max TDP / Socket (W)", "maxTdp", 50, 400, 5)}
        {slider("Min SPECint2017", "minSpec", 0, 3000, 10)}
        <Select label="P-Cores / E-Cores" value={pending.coreKind} onChange={v => setPending({ ...pending, coreKind: v as Filters["coreKind"] })} opts={[["all", "All (P-Cores & E-Cores)"], ["p", "P-Cores only"], ["e", "E-Cores only"]]} />
        <Select label="CPU Segment" value={pending.segment} onChange={v => setPending({ ...pending, segment: v as Filters["segment"] })} opts={[["all", "All (Extended + Mainstream + TCE)"], ["extended", "Extended CPU"], ["mainstream", "Mainstream CPU"], ["specialised", "Specialised CPU"], ["tce", "TCE"]]} />
        <Select label="Max Scalability" value={pending.scalability} onChange={v => setPending({ ...pending, scalability: v as Filters["scalability"] })} opts={[["any", "Any"], ["1S", "1S"], ["2S", "2S"], ["4S", "4S"]]} />
        <Select label="Socket / Chipsets" value={pending.socket} onChange={v => setPending({ ...pending, socket: v as Filters["socket"] })} opts={[["any", "Any"], ["1", "1"], ["2", "2"], ["4", "4"]]} />
        <button onClick={() => setFilters(pending)} style={{ width: "100%", padding: "9px", border: 0, borderRadius: 4, background: "linear-gradient(180deg,#0878ff,#0758d8)", color: "white", fontWeight: 700, marginTop: 10 }}>Apply Filters</button>
        <button onClick={() => { setPending(defaultFilters); setFilters(defaultFilters); }} style={{ width: "100%", padding: "9px", border: "1px solid #223d52", borderRadius: 4, background: "rgba(255,255,255,.03)", color: "white", marginTop: 8 }}>Clear All Filters</button>
      </div></Panel>

      <Panel><Title color="#38ff64">Recommendation</Title><div style={{ padding: 14 }}><div style={{ border: "1px solid #0b7039", borderRadius: 7, padding: 14, textAlign: "center", background: "rgba(4,55,37,.45)" }}><div style={{ fontSize: 28, color: "#39ff5f", fontWeight: 900 }}>Xeon {top.sku}</div><div style={{ fontSize: 13, color: "#58ff7a", marginTop: 7 }}>{top.family} • {top.codename} • {top.coreType}</div><div style={{ fontSize: 12, color: "#c9d6e0", marginTop: 7 }}>System: {selectedSystem.label} • Workload: {filters.workload}</div></div><div className="mini-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginTop: 10 }}><Mini label="P-Cores" value={pCores(top)} /><Mini label="E-Cores" value={eCores(top)} /><Mini label="Total Cores" value={totalCores(top)} /><Mini label="Max Turbo" value={`${top.maxTurboGHz} GHz`} /><Mini label="TDP / Socket" value={`${top.tdpW} W`} /><Mini label="System TDP" value={`${totalTdp(top)} W`} /><Mini label="CPU Price" value={fmtMoney(totalCost(top))} /><Mini label="Score" value={scoreCpu(top, filters)} /></div></div><div style={{ borderTop: "1px solid rgba(97,145,175,.25)", padding: 16 }}><h3 style={{ color: "#39ff5f", margin: "0 0 12px" }}>Why this CPU?</h3>{[`Best ranked fit for ${filters.workload} workload`, `Compatible with ${selectedSystem.label}`, `Strong ${top.coreType} alignment`, `Balanced score using SPECint, cores, value, efficiency and turbo`].map(x => <div key={x} style={{ fontSize: 13, margin: "10px 0" }}><span style={{ color: "#46ff63", marginRight: 8 }}>✓</span>{x}</div>)}</div></Panel>

      <div style={{ display: "grid", gap: 8 }}><Panel><Title>Key Metrics</Title><div className="stat-grid" style={{ padding: 14, display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}><Stat label="Best Performance" value={bestPerf.specInt2017.toLocaleString()} /><Stat label="Best Value" value={perfDollar(bestValue[0] || top).toFixed(3)} accent="#39ff5f" /><Stat label="Most P-Cores" value={pCores(mostP)} /><Stat label="Most E-Cores" value={eCores(mostE)} /><Stat label="Lowest Power" value={`${lowestTdp.tdpW}W`} /><Stat label="Highest Turbo" value={`${highTurbo.maxTurboGHz} GHz`} /><Stat label="Best Efficiency" value={perfWatt(efficient).toFixed(2)} /><Stat label="Max Scalability" value={maxScalability.maxScalability} /></div></Panel>
      <Panel><Title>Performance Radar <span style={{ color: "#cbd5e1", fontWeight: 500, textTransform: "none" }}>(Normalized)</span></Title><div style={{ height: 270, padding: 8 }}><ResponsiveContainer><RadarChart data={radarData} outerRadius="70%"><PolarGrid stroke="#31526a" /><PolarAngleAxis dataKey="metric" /><PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />{radarCandidates.map((c, i) => <Radar key={c.sku} name={`Xeon ${c.sku}`} dataKey={c.sku} stroke={["#39ff5f", "#18a8ff", "#d85aff", "#ffd400", "#ff3333"][i]} fill={["#39ff5f", "#18a8ff", "#d85aff", "#ffd400", "#ff3333"][i]} fillOpacity={0.05} />)}<Tooltip contentStyle={{ background: "#071724", border: "1px solid #25445c", color: "white" }} /><Legend /></RadarChart></ResponsiveContainer><div style={{ textAlign: "right", fontSize: 12, color: "#9fb0bd", marginRight: 20 }}>Higher is better</div></div></Panel></div>

      <div className="side-grid" style={{ display: "grid", gap: 8 }}><RankPanel title="Best Value (Performance / $)" color="#39ff5f" rows={bestValue.map(c => [c.sku, perfDollar(c).toFixed(3)])} header="SPECint2017 / $" /><RankPanel title="Top Performance (SPECint2017)" color="#e15cff" rows={topPerformance.map(c => [c.sku, c.specInt2017.toLocaleString()])} header="SPECint2017" /></div>
    </section>

    <Panel className="table-wrap" style={{ marginTop: 8 }}><div style={{ padding: "10px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(97,145,175,.25)", gap: 12 }}><b style={{ color: "#18a8ff", textTransform: "uppercase" }}>▦ Full Ranked List <span style={{ color: "#fff", fontWeight: 400 }}>({filtered.length} CPUs)</span></b><div style={{ display: "flex", alignItems: "center", gap: 12 }}><span>Sort by</span><select value={sortBy} onChange={e => setSortBy(e.target.value)} style={selectStyle}><option value="score">Best Recommendation</option><option value="specInt2017">SPECint2017</option><option value="value">Performance / $</option><option value="efficiency">Performance / W</option><option value="price">Price</option></select><button onClick={exportExcel} style={{ padding: "8px 16px", border: "1px solid #25445c", borderRadius: 5, background: "#071724", color: "white", fontWeight: 700 }}>🟩 Export Excel</button></div></div><table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}><thead><tr>{["Rank", "SKU", "Family", "Codename", "Core Type", "P-Cores", "E-Cores", "Avg Cores", "Total Cores", "Turbo", "Cache", "TDP", "System TDP", "SPECint", "Perf / $", "Perf / W", "CPU Price", "Scalability", "Segment", "Score"].map(h => <th key={h} style={th}>{h}</th>)}</tr></thead><tbody>{filtered.slice(0, 20).map((cpu, i) => <tr key={cpu.sku}>{[i + 1, cpu.sku, cpu.family, cpu.codename, cpu.coreType, pCores(cpu), eCores(cpu), avgCores(cpu), totalCores(cpu), `${cpu.maxTurboGHz} GHz`, `${cpu.cacheMB} MB`, `${cpu.tdpW} W`, `${totalTdp(cpu)} W`, cpu.specInt2017.toLocaleString(), perfDollar(cpu).toFixed(3), perfWatt(cpu).toFixed(2), fmtMoney(totalCost(cpu)), cpu.maxScalability, cpu.segment, scoreCpu(cpu, filters)].map((v, j) => <td key={j} style={td}>{v}</td>)}</tr>)}</tbody></table></Panel>
    <footer style={{ display: "flex", justifyContent: "space-between", color: "#9fb0bd", fontSize: 12, padding: "18px 12px 0" }}><span>SPECint2017 scores are estimated based on internal benchmarks and may differ from official results.</span><span>Xeon Deal Assistant v1.0</span></footer>
  </main>;
}
