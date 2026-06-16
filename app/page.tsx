"use client";

import React, { useMemo, useState } from "react";

const cpuCatalog = [
  { sku: "6315P", family: "Xeon 6300", codename: "Raptor Lake", coreType: "P-core", cores: 4, maxTurboGHz: 5.2, baseGHz: 2.8, cacheMB: 12, tdpW: 55, costUsd: 199, chips: 1, specInt2017: 41.6, maxScalability: "1S" },
  { sku: "6325P", family: "Xeon 6300", codename: "Raptor Lake", coreType: "P-core", cores: 4, maxTurboGHz: 5.2, baseGHz: 3.5, cacheMB: 12, tdpW: 55, costUsd: 253, chips: 1, specInt2017: 50.9, maxScalability: "1S" },
  { sku: "6333P", family: "Xeon 6300", codename: "Raptor Lake", coreType: "P-core", cores: 6, maxTurboGHz: 4.7, baseGHz: 3.1, cacheMB: 18, tdpW: 65, costUsd: 287, chips: 1, specInt2017: 71.1, maxScalability: "1S" },
  { sku: "6337P", family: "Xeon 6300", codename: "Raptor Lake", coreType: "P-core", cores: 6, maxTurboGHz: 5.3, baseGHz: 3.5, cacheMB: 18, tdpW: 80, costUsd: 337, chips: 1, specInt2017: 75.8, maxScalability: "1S" },
  { sku: "6349P", family: "Xeon 6300", codename: "Raptor Lake", coreType: "P-core", cores: 6, maxTurboGHz: 5.7, baseGHz: 3.6, cacheMB: 18, tdpW: 95, costUsd: 455, chips: 1, specInt2017: 79.2, maxScalability: "1S" },
  { sku: "6353P", family: "Xeon 6300", codename: "Raptor Lake", coreType: "P-core", cores: 8, maxTurboGHz: 5.4, baseGHz: 2.7, cacheMB: 24, tdpW: 65, costUsd: 383, chips: 1, specInt2017: 84.4, maxScalability: "1S" },
  { sku: "6357P", family: "Xeon 6300", codename: "Raptor Lake", coreType: "P-core", cores: 8, maxTurboGHz: 5.4, baseGHz: 3.0, cacheMB: 24, tdpW: 80, costUsd: 500, chips: 1, specInt2017: 96.6, maxScalability: "1S" },
  { sku: "6369P", family: "Xeon 6300", codename: "Raptor Lake", coreType: "P-core", cores: 8, maxTurboGHz: 5.7, baseGHz: 3.3, cacheMB: 24, tdpW: 95, costUsd: 545, chips: 1, specInt2017: 98.8, maxScalability: "1S" },

  { sku: "6505P", family: "Xeon 6500", codename: "Granite Rapids", coreType: "P-core", cores: 12, maxTurboGHz: 4.1, baseGHz: 2.2, cacheMB: 48, tdpW: 150, costUsd: 435, chips: 2, specInt2017: 286, maxScalability: "2S" },
  { sku: "6507P", family: "Xeon 6500", codename: "Granite Rapids", coreType: "P-core", cores: 8, maxTurboGHz: 4.3, baseGHz: 3.5, cacheMB: 48, tdpW: 150, costUsd: 551, chips: 2, specInt2017: 210, maxScalability: "2S" },
  { sku: "6511P", family: "Xeon 6500", codename: "Granite Rapids", coreType: "P-core", cores: 16, maxTurboGHz: 4.2, baseGHz: 2.3, cacheMB: 72, tdpW: 150, costUsd: 640, chips: 1, specInt2017: 195, maxScalability: "1S" },
  { sku: "6515P", family: "Xeon 6500", codename: "Granite Rapids", coreType: "P-core", cores: 16, maxTurboGHz: 3.8, baseGHz: 2.3, cacheMB: 72, tdpW: 150, costUsd: 515, chips: 2, specInt2017: 373, maxScalability: "2S" },
  { sku: "6517P", family: "Xeon 6500", codename: "Granite Rapids", coreType: "P-core", cores: 16, maxTurboGHz: 4.2, baseGHz: 3.2, cacheMB: 72, tdpW: 190, costUsd: 850, chips: 2, specInt2017: 388, maxScalability: "2S" },
  { sku: "6520P", family: "Xeon 6500", codename: "Granite Rapids", coreType: "P-core", cores: 24, maxTurboGHz: 4.0, baseGHz: 2.4, cacheMB: 144, tdpW: 210, costUsd: 950, chips: 2, specInt2017: 522, maxScalability: "2S" },
  { sku: "6521P", family: "Xeon 6500", codename: "Granite Rapids", coreType: "P-core", cores: 24, maxTurboGHz: 4.1, baseGHz: 2.6, cacheMB: 144, tdpW: 225, costUsd: 900, chips: 1, specInt2017: 296, maxScalability: "1S" },
  { sku: "6527P", family: "Xeon 6500", codename: "Granite Rapids", coreType: "P-core", cores: 24, maxTurboGHz: 4.2, baseGHz: 3.0, cacheMB: 144, tdpW: 255, costUsd: 1910, chips: 2, specInt2017: 592, maxScalability: "2S" },
  { sku: "6530P", family: "Xeon 6500", codename: "Granite Rapids", coreType: "P-core", cores: 32, maxTurboGHz: 4.1, baseGHz: 2.3, cacheMB: 144, tdpW: 225, costUsd: 1800, chips: 2, specInt2017: 706, maxScalability: "2S" },

  { sku: "6710E", family: "Xeon 6700", codename: "Sierra Forest", coreType: "E-core", cores: 64, maxTurboGHz: 3.2, baseGHz: 2.4, cacheMB: 96, tdpW: 205, costUsd: 1181, chips: 2, specInt2017: 695, maxScalability: "2S" },
  { sku: "6714P", family: "Xeon 6700", codename: "Granite Rapids", coreType: "P-core", cores: 8, maxTurboGHz: 4.3, baseGHz: 4.0, cacheMB: 48, tdpW: 165, costUsd: 2250, chips: 2, specInt2017: 210, maxScalability: "2S" },
  { sku: "6724P", family: "Xeon 6700", codename: "Granite Rapids", coreType: "P-core", cores: 16, maxTurboGHz: 4.3, baseGHz: 3.6, cacheMB: 72, tdpW: 210, costUsd: 2467, chips: 2, specInt2017: 402, maxScalability: "2S" },
  { sku: "6728P", family: "Xeon 6700", codename: "Granite Rapids", coreType: "P-core", cores: 24, maxTurboGHz: 4.1, baseGHz: 2.7, cacheMB: 144, tdpW: 210, costUsd: 1450, chips: 4, specInt2017: 1120, maxScalability: "4S" },
  { sku: "6731E", family: "Xeon 6700", codename: "Sierra Forest", coreType: "E-core", cores: 96, maxTurboGHz: 3.1, baseGHz: 2.2, cacheMB: 96, tdpW: 250, costUsd: 1209, chips: 1, specInt2017: 493, maxScalability: "1S" },
  { sku: "6731P", family: "Xeon 6700", codename: "Granite Rapids", coreType: "P-core", cores: 32, maxTurboGHz: 4.1, baseGHz: 2.5, cacheMB: 144, tdpW: 245, costUsd: 1700, chips: 1, specInt2017: 371, maxScalability: "1S" },
  { sku: "6736P", family: "Xeon 6700", codename: "Granite Rapids", coreType: "P-core", cores: 36, maxTurboGHz: 4.1, baseGHz: 2.0, cacheMB: 144, tdpW: 205, costUsd: 2400, chips: 2, specInt2017: 735, maxScalability: "2S" },
  { sku: "6737P", family: "Xeon 6700", codename: "Granite Rapids", coreType: "P-core", cores: 32, maxTurboGHz: 4.0, baseGHz: 2.9, cacheMB: 144, tdpW: 270, costUsd: 2750, chips: 2, specInt2017: 749, maxScalability: "2S" },
  { sku: "6738P", family: "Xeon 6700", codename: "Granite Rapids", coreType: "P-core", cores: 32, maxTurboGHz: 4.2, baseGHz: 2.9, cacheMB: 144, tdpW: 270, costUsd: 3500, chips: 4, specInt2017: 1460, maxScalability: "4S" },
  { sku: "6740E", family: "Xeon 6700", codename: "Sierra Forest", coreType: "E-core", cores: 96, maxTurboGHz: 3.2, baseGHz: 2.4, cacheMB: 96, tdpW: 250, costUsd: 1331, chips: 2, specInt2017: 979, maxScalability: "2S" },
  { sku: "6740P", family: "Xeon 6700", codename: "Granite Rapids", coreType: "P-core", cores: 48, maxTurboGHz: 3.8, baseGHz: 2.1, cacheMB: 288, tdpW: 270, costUsd: 2700, chips: 2, specInt2017: 972, maxScalability: "2S" },
  { sku: "6745P", family: "Xeon 6700", codename: "Granite Rapids", coreType: "P-core", cores: 32, maxTurboGHz: 4.3, baseGHz: 3.1, cacheMB: 336, tdpW: 300, costUsd: 3048, chips: 2, specInt2017: 785, maxScalability: "2S" },
  { sku: "6746E", family: "Xeon 6700", codename: "Sierra Forest", coreType: "E-core", cores: 112, maxTurboGHz: 2.7, baseGHz: 2.0, cacheMB: 96, tdpW: 250, costUsd: 1230, chips: 2, specInt2017: 1020, maxScalability: "2S" },
  { sku: "6748P", family: "Xeon 6700", codename: "Granite Rapids", coreType: "P-core", cores: 48, maxTurboGHz: 4.1, baseGHz: 2.5, cacheMB: 192, tdpW: 300, costUsd: 10049, chips: 4, specInt2017: 2010, maxScalability: "4S" },
  { sku: "6756E", family: "Xeon 6700", codename: "Sierra Forest", coreType: "E-core", cores: 128, maxTurboGHz: 2.6, baseGHz: 1.8, cacheMB: 96, tdpW: 225, costUsd: 1747, chips: 2, specInt2017: 1100, maxScalability: "2S" },
  { sku: "6760P", family: "Xeon 6700", codename: "Granite Rapids", coreType: "P-core", cores: 64, maxTurboGHz: 3.8, baseGHz: 2.2, cacheMB: 320, tdpW: 330, costUsd: 3600, chips: 2, specInt2017: 1250, maxScalability: "2S" },
  { sku: "6761P", family: "Xeon 6700", codename: "Granite Rapids", coreType: "P-core", cores: 64, maxTurboGHz: 3.9, baseGHz: 2.5, cacheMB: 336, tdpW: 350, costUsd: 3600, chips: 1, specInt2017: 663, maxScalability: "1S" },
  { sku: "6766E", family: "Xeon 6700", codename: "Sierra Forest", coreType: "E-core", cores: 144, maxTurboGHz: 2.7, baseGHz: 1.9, cacheMB: 108, tdpW: 250, costUsd: 2217, chips: 2, specInt2017: 1240, maxScalability: "2S" },
  { sku: "6767P", family: "Xeon 6700", codename: "Granite Rapids", coreType: "P-core", cores: 64, maxTurboGHz: 3.9, baseGHz: 2.4, cacheMB: 336, tdpW: 350, costUsd: 4450, chips: 2, specInt2017: 1300, maxScalability: "2S" },
  { sku: "6768P", family: "Xeon 6700", codename: "Granite Rapids", coreType: "P-core", cores: 64, maxTurboGHz: 3.9, baseGHz: 2.4, cacheMB: 336, tdpW: 330, costUsd: 12226, chips: 4, specInt2017: 2490, maxScalability: "4S" },
  { sku: "6780E", family: "Xeon 6700", codename: "Sierra Forest", coreType: "E-core", cores: 144, maxTurboGHz: 3.0, baseGHz: 2.2, cacheMB: 108, tdpW: 330, costUsd: 2354, chips: 2, specInt2017: 1350, maxScalability: "2S" },
  { sku: "6781P", family: "Xeon 6700", codename: "Granite Rapids", coreType: "P-core", cores: 80, maxTurboGHz: 3.8, baseGHz: 2.0, cacheMB: 336, tdpW: 350, costUsd: 4000, chips: 1, specInt2017: 745, maxScalability: "1S" },
  { sku: "6787P", family: "Xeon 6700", codename: "Granite Rapids", coreType: "P-core", cores: 86, maxTurboGHz: 3.8, baseGHz: 2.0, cacheMB: 336, tdpW: 350, costUsd: 4300, chips: 2, specInt2017: 1540, maxScalability: "2S" },
  { sku: "6788P", family: "Xeon 6700", codename: "Granite Rapids", coreType: "P-core", cores: 86, maxTurboGHz: 3.8, baseGHz: 2.0, cacheMB: 336, tdpW: 350, costUsd: 14520, chips: 4, specInt2017: 2910, maxScalability: "4S" }
];


const workloads = [
  { value: "tower", label: "Tower" },
  { value: "hpc", label: "HPC" },
  { value: "cae", label: "CAE" },
  { value: "modeling and simulation", label: "Modeling and Simulation" },
  { value: "web-microservices", label: "Web & Microservices" },
  { value: "cloud-native", label: "Cloud-Native" },
  { value: "consumer digital services", label: "Consumer Digital Services" },
  { value: "application dev ops", label: "Application Dev Ops" },
  { value: "database-analytics", label: "Database & Analytics" },
  { value: "ai", label: "AI" },
  { value: "infrastructure-storage", label: "Infrastructure & Storage" },
  { value: "networking", label: "Networking" },
  { value: "edge", label: "Edge" }
];


const servers = [
  { value: "any", label: "Any server", formFactor: "Mixed", sockets: 0, maxRamTb: 16, memoryType: "DDR5 6400", pCore: true, eCore: true },
  { value: "sr630-v4", label: "ThinkSystem SR630 V4", formFactor: "1U", sockets: 2, maxRamTb: 8, memoryType: "DDR5 6400", pCore: true, eCore: true },
  { value: "sr650-v4", label: "ThinkSystem SR650 V4", formFactor: "2U", sockets: 2, maxRamTb: 8, memoryType: "DDR5 6400", pCore: true, eCore: false },
  { value: "sr680a-v4", label: "ThinkSystem SR680a V4", formFactor: "8U", sockets: 2, maxRamTb: 4, memoryType: "DDR5 6400", pCore: true, eCore: false },
  { value: "sr850-v4", label: "ThinkSystem SR850 V4", formFactor: "2U", sockets: 4, maxRamTb: 16, memoryType: "DDR5 6400", pCore: true, eCore: false },
  { value: "sr860-v4", label: "ThinkSystem SR860 V4", formFactor: "2U", sockets: 4, maxRamTb: 16, memoryType: "DDR5 6400", pCore: true, eCore: false },
  { value: "st50-v3", label: "ThinkSystem ST50 V3", formFactor: "Tower", sockets: 1, maxRamTb: 0.125, memoryType: "DDR4", pCore: true, eCore: false }
];



const defaultForm = {
  workload: "database-analytics",
  priority: "balanced",
  socketCount: "any",
  coreBand: "any",
  serverModel: "any",
  licensing: "normal",
  onlyAIProgram: false,
};

const AI_PROGRAM_CPUS = ["6737P", "6740P", "6747P", "6761P", "6767P", "6774P", "6776P"];

function getMaxSockets(cpu: any) {
  return parseInt(String(cpu.maxScalability).replace("S", ""), 10);
}

function getSystemMetrics(cpu: any) {
  const sockets = Math.max(1, getMaxSockets(cpu));
  return {
    sockets,
    totalCores: cpu.cores * sockets,
    totalCostUsd: cpu.costUsd * sockets,
    totalTdpW: cpu.tdpW * sockets,
    totalSpecInt2017: cpu.specInt2017,
    specPerDollar: cpu.specInt2017 / Math.max(1, cpu.costUsd * sockets),
    specPerWatt: cpu.specInt2017 / Math.max(1, cpu.tdpW * sockets),
  };
}

function fmtMoney(v: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v);
}

function isAIProgramEligible(cpu: any) {
  return AI_PROGRAM_CPUS.includes(cpu.sku);
}

function selectedServer(value: string) {
  return servers.find((s: any) => s.value === value) || servers[0];
}

function serverAllows(cpu: any, serverValue: string) {
  if (serverValue === "any") return true;
  const server = selectedServer(serverValue);
  if (server.value === "st50-v3") return cpu.family === "Xeon 6300";
  if (cpu.family === "Xeon 6300") return false;
  if (cpu.coreType === "E-core" && !server.eCore) return false;
  if (cpu.coreType === "P-core" && !server.pCore) return false;
  return getMaxSockets(cpu) <= server.sockets;
}

function allowed(cpu: any, form: any) {
  if (form.workload !== "tower" && cpu.family === "Xeon 6300") return false;
  if (form.workload === "tower" && cpu.family !== "Xeon 6300") return false;
  if (form.workload === "hpc" && cpu.coreType !== "P-core") return false;
  if (form.workload === "ai" && cpu.coreType !== "P-core") return false;
  if (form.workload === "web-microservices" && cpu.coreType !== "E-core") return false;
  if (form.socketCount !== "any" && cpu.maxScalability !== form.socketCount) return false;
  if (form.coreBand !== "any") {
    if (form.coreBand === "80plus" && cpu.cores < 80) return false;
    if (form.coreBand !== "80plus" && cpu.cores !== Number(form.coreBand)) return false;
  }
  if (form.licensing === "sensitive" && cpu.cores > 32) return false;
  if (form.onlyAIProgram && !isAIProgramEligible(cpu)) return false;
  if (!serverAllows(cpu, form.serverModel)) return false;
  return true;
}

function scoreCpu(cpu: any, form: any) {
  const m = getSystemMetrics(cpu);
  let score = 0;
  score += m.totalSpecInt2017 * 0.8;
  score += m.specPerDollar * 650;
  score += m.specPerWatt * 55;
  score += cpu.maxTurboGHz * 35;

  if (form.priority === "performance") score += m.totalSpecInt2017 * 1.2 + m.totalCores * 3;
  if (form.priority === "efficiency") score += m.specPerWatt * 220 - m.totalTdpW * 0.15;
  if (form.priority === "balanced") score += m.specPerDollar * 450 + m.specPerWatt * 80;

  if (form.workload === "database-analytics" && m.totalCores >= 24 && m.totalCores <= 96) score += 160;
  if (form.workload === "ai" && isAIProgramEligible(cpu)) score += 250;
  if (form.workload === "edge" && m.totalTdpW <= 500) score += 120;
  if (form.workload === "infrastructure-storage" && getMaxSockets(cpu) >= 2) score += 120;
  if (form.workload === "networking" && cpu.maxTurboGHz >= 4.0) score += 80;
  if (form.workload === "tower") score += cpu.maxTurboGHz * 80;

  return Math.round(score);
}

function why(cpu: any, form: any) {
  const m = getSystemMetrics(cpu);
  const lines = [];
  if (form.priority === "performance") lines.push("Strong top-end SPECint performance");
  if (form.priority === "balanced") lines.push("Balanced performance, cost and efficiency");
  if (form.priority === "efficiency") lines.push("Strong performance per watt profile");
  if (form.workload === "database-analytics") lines.push("Good fit for database and analytics sizing");
  if (form.workload === "ai") lines.push("P-core aligned for AI host workloads");
  if (form.workload === "tower") lines.push("Tower path with Xeon 6300 / Raptor Lake");
  if (isAIProgramEligible(cpu)) lines.push("AI Host Node Program eligible");
  lines.push(`${m.totalCores} total cores and ${m.totalTdpW}W system TDP`);
  return lines;
}

function SelectField({ label, value, onChange, children }: any) {
  return <label className="field"><span>{label}</span><select value={value} onChange={(e) => onChange(e.target.value)}>{children}</select></label>;
}

function MiniCard({ label, value, sub }: any) {
  return <div className="mini-card"><div className="mini-label">{label}</div><div className="mini-value">{value}</div>{sub && <div className="mini-sub">{sub}</div>}</div>;
}

function TopList({ title, items, metric, accent }: any) {
  return <section className="panel side-panel"><h3 style={{color: accent}}>{title}</h3><div className="rank-list">{items.map((cpu: any, idx: number) => <div className="rank-row" key={cpu.sku}><span>{idx + 1}</span><strong>Xeon {cpu.sku}</strong><em>{metric(cpu)}</em></div>)}</div></section>;
}

function Bar({ label, value, max }: any) {
  const pct = Math.max(3, Math.min(100, (value / max) * 100));
  return <div className="bar-line"><span>{label}</span><div><i style={{width: `${pct}%`}} /></div><b>{value}</b></div>;
}

export default function XeonDealAssistant() {
  const [form, setForm] = useState(defaultForm);

  const ranked = useMemo(() => cpuCatalog
    .filter((cpu: any) => allowed(cpu, form))
    .map((cpu: any) => ({ ...cpu, score: scoreCpu(cpu, form), aiProgram: isAIProgramEligible(cpu) }))
    .sort((a: any, b: any) => b.score - a.score), [form]);

  const top: any = ranked[0];
  const topMetrics = top ? getSystemMetrics(top) : null;
  const bestValue = [...ranked].sort((a: any, b: any) => getSystemMetrics(b).specPerDollar - getSystemMetrics(a).specPerDollar).slice(0,5);
  const bestPerf = [...ranked].sort((a: any, b: any) => b.specInt2017 - a.specInt2017).slice(0,5);
  const bestEff = [...ranked].sort((a: any, b: any) => getSystemMetrics(b).specPerWatt - getSystemMetrics(a).specPerWatt).slice(0,5);
  const maxSpec = Math.max(...ranked.map((c:any)=>c.specInt2017), 1);
  const maxCores = Math.max(...ranked.map((c:any)=>getSystemMetrics(c).totalCores), 1);
  const maxTurbo = Math.max(...ranked.map((c:any)=>c.maxTurboGHz), 1);

  return <main className="page">
    <style>{`
:root{color-scheme:dark}*{box-sizing:border-box}body{margin:0;background:#06111f;color:#eef6ff;font-family:Arial,Helvetica,sans-serif}.page{min-height:100vh;padding:18px;background:radial-gradient(circle at 35% -10%,#12345a 0,#06111f 42%,#020817 100%)}.hero{display:flex;justify-content:space-between;align-items:flex-start;gap:20px;margin-bottom:16px}.hero h1{margin:0;font-size:30px;letter-spacing:-.04em}.hero p{margin:5px 0 0;color:#a8b3c5}.chip-icon{float:left;width:42px;height:42px;border:2px solid #1d9bff;color:#38bdf8;border-radius:10px;display:grid;place-items:center;margin-right:12px;font-size:26px;box-shadow:0 0 25px rgba(56,189,248,.25)}.hero-actions{display:flex;gap:10px}.hero-actions button,.table-head button{border:1px solid #27415f;background:#0d2036;color:#eaf6ff;border-radius:10px;padding:10px 14px;font-weight:700;cursor:pointer}.hero-actions .reset{background:#172033}.dashboard-grid{display:grid;grid-template-columns:320px minmax(330px,1.05fr) minmax(430px,1.4fr) 400px;gap:12px;align-items:stretch}.panel{border:1px solid #29415e;background:linear-gradient(180deg,rgba(14,32,52,.96),rgba(7,20,35,.96));border-radius:10px;box-shadow:0 14px 45px rgba(0,0,0,.28),inset 0 1px 0 rgba(255,255,255,.04);padding:16px}.panel h2,.panel h3{margin:0 0 13px;text-transform:uppercase;letter-spacing:.03em}.panel h2{font-size:15px;color:#52c7ff}.panel h3{font-size:14px}.filters{display:flex;flex-direction:column;gap:12px}.field{display:grid;grid-template-columns:1fr 1.2fr;align-items:center;gap:10px;font-size:13px}.field span{color:#f1f5f9}.field select{width:100%;background:#0b1727;color:white;border:1px solid #34506d;border-radius:7px;padding:9px}.check{display:flex;align-items:center;gap:8px;font-size:13px;color:#cbd5e1;margin:4px 0}.primary,.secondary{border:none;border-radius:8px;padding:11px;font-weight:800;cursor:pointer}.primary{background:linear-gradient(90deg,#1267f3,#1d8cff);color:#fff}.secondary{background:#101e30;color:#fff;border:1px solid #263d58}.cpu-hero{border:1px solid #125f48;background:linear-gradient(180deg,rgba(9,79,55,.44),rgba(7,38,35,.35));border-radius:10px;padding:18px;text-align:center;position:relative}.cpu-hero small{display:block;color:#a8ffbd}.cpu-hero strong{display:block;font-size:30px;color:#4ade80;margin:8px 0}.cpu-hero span{color:#dcfce7;font-size:13px}.program{display:inline-block;margin-top:10px;background:#14532d;color:#b7ffca;border:1px solid #22c55e;border-radius:999px;padding:5px 9px;font-size:11px}.mini-grid,.metric-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:12px}.metric-grid{grid-template-columns:repeat(3,1fr);margin-top:0}.mini-card{border:1px solid #29445f;background:rgba(13,29,47,.85);border-radius:8px;padding:12px;text-align:center}.mini-label{font-size:11px;color:#52c7ff;font-weight:700}.mini-value{font-size:22px;font-weight:900;margin:5px 0;color:#fff}.mini-sub{font-size:12px;color:#b6c2d2}.why{margin-top:18px}.why h3{color:#4ade80}.why p{margin:8px 0;color:#dbeafe;font-size:13px}.metrics{display:flex;flex-direction:column;gap:12px}.chart-card{border:1px solid #28425e;border-radius:10px;padding:14px;background:rgba(5,14,25,.45);min-height:178px}.bar-line{display:grid;grid-template-columns:95px 1fr 70px;gap:10px;align-items:center;margin:13px 0;font-size:13px}.bar-line div{height:10px;background:#0f2135;border-radius:999px;overflow:hidden;border:1px solid #243d59}.bar-line i{display:block;height:100%;background:linear-gradient(90deg,#38bdf8,#4ade80);border-radius:999px}.bar-line b{text-align:right}.right-stack{display:grid;grid-template-rows:1fr 1fr 1fr;gap:10px}.side-panel{padding:14px}.rank-list{display:grid;gap:2px}.rank-row{display:grid;grid-template-columns:28px 1fr 80px;gap:8px;align-items:center;border-top:1px solid #223954;padding:7px 0;font-size:13px}.rank-row em{text-align:right;font-style:normal;color:#77ff8e;font-weight:800}.rank-row span{color:#d5e4f7}.table-panel{margin-top:12px;padding:14px}.table-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}.table-head h2{margin:0}.table-head span{color:#dbeafe;text-transform:none}.table-wrap{overflow:auto;max-height:360px;border:1px solid #263d58;border-radius:9px}table{width:100%;border-collapse:collapse;font-size:12px;min-width:1180px}th{position:sticky;top:0;background:#102033;color:#f8fafc;text-align:left;z-index:1}th,td{border-bottom:1px solid #203650;border-right:1px solid #203650;padding:9px 10px;white-space:nowrap}td small{display:block;color:#6ee7b7;font-size:10px;margin-top:2px}tr:hover td{background:#0d2036}.empty{border:1px dashed #34506d;border-radius:10px;padding:18px;color:#a8b3c5}footer{color:#8190a6;text-align:right;font-size:12px;margin:16px 4px}@media(max-width:1250px){.dashboard-grid{grid-template-columns:1fr 1fr}.right-stack{grid-column:1/-1;grid-template-columns:repeat(3,1fr);grid-template-rows:auto}}@media(max-width:800px){.dashboard-grid,.right-stack{grid-template-columns:1fr}.hero{flex-direction:column}.field{grid-template-columns:1fr}.mini-grid,.metric-grid{grid-template-columns:1fr 1fr}}@media print{.page{background:#06111f}.hero-actions,.table-head button{display:none}.table-wrap{max-height:none}}
`}</style>
    <header className="hero">
      <div><div className="chip-icon">▦</div><h1>Xeon Deal Assistant</h1><p>Find the best Intel Xeon CPU for the selected workload, server and commercial priority.</p></div>
      <div className="hero-actions"><button onClick={()=>window.print()}>Export PDF</button><button className="reset" onClick={()=>setForm(defaultForm)}>Reset</button></div>
    </header>

    <div className="dashboard-grid">
      <aside className="panel filters">
        <h2>Filters</h2>
        <SelectField label="Workload" value={form.workload} onChange={(v:string)=>setForm({...form, workload:v, serverModel:v==='tower'?'st50-v3':form.serverModel})}>{workloads.map((w:any)=><option key={w.value} value={w.value}>{w.label}</option>)}</SelectField>
        <SelectField label="Priority" value={form.priority} onChange={(v:string)=>setForm({...form, priority:v})}><option value="performance">Performance</option><option value="balanced">Balanced</option><option value="efficiency">Efficiency</option></SelectField>
        <SelectField label="Server Model" value={form.serverModel} onChange={(v:string)=>setForm({...form, serverModel:v})}>{servers.map((s:any)=><option key={s.value} value={s.value}>{s.label}</option>)}</SelectField>
        <SelectField label="Socket / Chipset" value={form.socketCount} onChange={(v:string)=>setForm({...form, socketCount:v})}><option value="any">Any</option><option value="1S">1S</option><option value="2S">2S</option><option value="4S">4S</option></SelectField>
        <SelectField label="Core Selection" value={form.coreBand} onChange={(v:string)=>setForm({...form, coreBand:v})}><option value="any">Any</option><option value="4">4</option><option value="6">6</option><option value="8">8</option><option value="16">16</option><option value="24">24</option><option value="32">32</option><option value="48">48</option><option value="64">64</option><option value="80plus">80+</option></SelectField>
        <SelectField label="Licensing" value={form.licensing} onChange={(v:string)=>setForm({...form, licensing:v})}><option value="normal">Normal</option><option value="sensitive">Per-core sensitive</option></SelectField>
        <label className="check"><input type="checkbox" checked={form.onlyAIProgram} onChange={(e)=>setForm({...form, onlyAIProgram:e.target.checked})} /> AI Host Node eligible only</label>
        <button className="primary" onClick={()=>{}}>Apply Filters</button>
        <button className="secondary" onClick={()=>setForm(defaultForm)}>Clear All</button>
      </aside>

      <section className="panel recommendation">
        <h2>Recommendation</h2>
        {top ? <>
          <div className="cpu-hero"><small>Recommended CPU</small><strong>Xeon {top.sku}</strong><span>{top.family} • {top.codename} • {top.coreType}</span>{top.aiProgram && <b className="program">AI Host Node Program</b>}</div>
          <div className="mini-grid">
            <MiniCard label="Cores" value={top.cores} sub="per socket" />
            <MiniCard label="Turbo" value={`${top.maxTurboGHz} GHz`} sub="max" />
            <MiniCard label="TDP" value={`${top.tdpW} W`} sub="per socket" />
            <MiniCard label="Price" value={fmtMoney(top.costUsd)} sub="per CPU" />
            <MiniCard label="Total Cores" value={topMetrics.totalCores} sub={top.maxScalability} />
            <MiniCard label="Score" value={top.score} sub="deal fit" />
          </div>
          <div className="why"><h3>Why this CPU?</h3>{why(top, form).map((x:string)=><p key={x}>✓ {x}</p>)}</div>
        </> : <div className="empty">No CPU found for these filters.</div>}
      </section>

      <section className="panel metrics">
        <h2>Key Metrics</h2>
        {top && <div className="metric-grid">
          <MiniCard label="SPECint2017" value={top.specInt2017} sub={`Xeon ${top.sku}`} />
          <MiniCard label="SPEC / $" value={topMetrics.specPerDollar.toFixed(3)} sub="system value" />
          <MiniCard label="SPEC / Watt" value={topMetrics.specPerWatt.toFixed(2)} sub="efficiency" />
          <MiniCard label="Total Cost" value={fmtMoney(topMetrics.totalCostUsd)} sub="system level" />
          <MiniCard label="Total TDP" value={`${topMetrics.totalTdpW} W`} sub="system level" />
          <MiniCard label="Max Scalability" value={top.maxScalability} sub="CPU topology" />
        </div>}
        <div className="chart-card"><h3>Performance Snapshot</h3>{top && <><Bar label="SPECint" value={top.specInt2017} max={maxSpec}/><Bar label="Total cores" value={topMetrics.totalCores} max={maxCores}/><Bar label="Turbo GHz" value={top.maxTurboGHz} max={maxTurbo}/></>}</div>
      </section>

      <div className="right-stack">
        <TopList title="Best Value (Performance / $)" items={bestValue} accent="#62f783" metric={(cpu:any)=>getSystemMetrics(cpu).specPerDollar.toFixed(3)} />
        <TopList title="Best Performance (SPECint2017)" items={bestPerf} accent="#e879f9" metric={(cpu:any)=>cpu.specInt2017} />
        <TopList title="Best Efficiency (SPEC / W)" items={bestEff} accent="#38bdf8" metric={(cpu:any)=>getSystemMetrics(cpu).specPerWatt.toFixed(2)} />
      </div>
    </div>

    <section className="panel table-panel">
      <div className="table-head"><h2>Full Ranked List <span>({ranked.length} CPUs)</span></h2><button onClick={()=>navigator.clipboard?.writeText(JSON.stringify(ranked, null, 2))}>Copy JSON</button></div>
      <div className="table-wrap"><table><thead><tr><th>Rank</th><th>SKU</th><th>Family</th><th>Codename</th><th>Core Type</th><th>Cores</th><th>Turbo</th><th>Cache</th><th>TDP</th><th>Price</th><th>SPECint</th><th>SPEC/$</th><th>SPEC/W</th><th>Max Scalability</th><th>Score</th></tr></thead><tbody>{ranked.map((cpu:any, i:number)=>{const m=getSystemMetrics(cpu); return <tr key={cpu.sku}><td>{i+1}</td><td><strong>Xeon {cpu.sku}</strong>{cpu.aiProgram && <small>AI Program</small>}</td><td>{cpu.family}</td><td>{cpu.codename}</td><td>{cpu.coreType}</td><td>{cpu.cores}</td><td>{cpu.maxTurboGHz} GHz</td><td>{cpu.cacheMB} MB</td><td>{cpu.tdpW} W</td><td>{fmtMoney(cpu.costUsd)}</td><td>{cpu.specInt2017}</td><td>{m.specPerDollar.toFixed(3)}</td><td>{m.specPerWatt.toFixed(2)}</td><td>{cpu.maxScalability}</td><td>{cpu.score}</td></tr>})}</tbody></table></div>
    </section>
    <footer>Xeon Deal Assistant • Dark dashboard build for GitHub + Vercel</footer>
  </main>;
}
