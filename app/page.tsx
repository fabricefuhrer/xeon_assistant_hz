"use client";

import React, { useMemo, useState } from "react";
import type { Cpu, DealConfig, Filters } from "@/data/types";
import { cpuCatalog } from "@/data/cpus";
import { defaultFilters } from "@/data/systems";
import { allowedByFilters } from "@/lib/compatibility";
import { avgCores, eCores, fmtMoney, pCores, perfDollar, perfWatt, totalCores, totalCost, totalTdp } from "@/lib/metrics";
import { recommendationReasons, scoreBreakdown, scoreCpu, workloadLabel } from "@/lib/scoring";
import { systems } from "@/data/systems";
import { Header } from "@/components/Header";
import { FiltersPanel } from "@/components/FiltersPanel";
import { KeyMetrics } from "@/components/KeyMetrics";
import { Recommendation } from "@/components/Recommendation";
import { CompatibilitySummary } from "@/components/CompatibilitySummary";
import { CommercialAlternatives } from "@/components/CommercialAlternatives";
import { RadarPanel } from "@/components/RadarPanel";
import { RankPanels } from "@/components/RankPanels";
import { CpuTable } from "@/components/CpuTable";
import { Footer } from "@/components/Footer";
import { CpuCompare } from "@/components/CpuCompare";
import { DealConfiguration } from "@/components/DealConfiguration";
import { DealWarnings } from "@/components/DealWarnings";
import { WhyNot } from "@/components/WhyNot";

export default function Page() {
  const [pending, setPending] = useState<Filters>(defaultFilters);
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [sortBy, setSortBy] = useState("score");
  const [leftSku, setLeftSku] = useState("");
  const [rightSku, setRightSku] = useState("");
  const [showCompare, setShowCompare] = useState(false);
  const [deal, setDeal] = useState<DealConfig>({customer:"",opportunity:"",serverQty:1,socketsPerServer:2});

  const filtered = useMemo(() => cpuCatalog.filter(cpu => allowedByFilters(cpu, filters)).sort((a, b) => {
    if (sortBy === "score") return scoreCpu(b, filters) - scoreCpu(a, filters);
    if (sortBy === "value") return perfDollar(b) - perfDollar(a);
    if (sortBy === "efficiency") return perfWatt(b) - perfWatt(a);
    if (sortBy === "price") return totalCost(a) - totalCost(b);
    return b.specInt2017 - a.specInt2017;
  }), [filters, sortBy]);

  const top: Cpu | null = filtered.length ? filtered[0] : null;
  const topPerformance = [...filtered].sort((a, b) => b.specInt2017 - a.specInt2017).slice(0, 5);


  const exportDealSummary = () => {
    if (!top) return;
    const q = scoreBreakdown(top, filtered);
    const lines = ["Xeon Deal Assistant - Recommendation Summary", "", `Customer: ${deal.customer || "-"}`, `Opportunity: ${deal.opportunity || "-"}`, `Servers: ${deal.serverQty}`, `CPUs / Server: ${deal.socketsPerServer}`, `Total CPU Qty: ${deal.serverQty * deal.socketsPerServer}`, "", `System: ${systems[filters.system].label}`, `Workload: ${workloadLabel(filters.workload)}`, `Recommended CPU: Xeon ${top.sku}`, `Segment: ${top.segment}`, `Cores / CPU: ${top.cores}`, `Max Turbo: ${top.maxTurboGHz} GHz`, `TDP / CPU: ${top.tdpW} W`, `SPECint2017: ${top.specInt2017}`, `CPU Price / Unit: ${fmtMoney(top.costUsd)}`, `Total CPU Investment: ${fmtMoney(top.costUsd * deal.serverQty * deal.socketsPerServer)}`, "", `Performance: ${q.performance}`, `Value: ${q.value}`, `Efficiency: ${q.efficiency}`, `Turbo: ${q.turbo}`, "", "Why this CPU:", ...recommendationReasons(top, filters).map(x => `- ${x}`)];
    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href=url; a.download=`xeon-deal-${top.sku}.txt`; a.click(); URL.revokeObjectURL(url);
  };

  const copyDealSummary = async () => { if(!top)return; const q=scoreBreakdown(top,filtered); const text=`Xeon Deal Assistant | ${deal.customer || "Customer"} | ${deal.opportunity || "Opportunity"} | ${deal.serverQty} servers x ${deal.socketsPerServer} CPUs | ${systems[filters.system].label} | ${workloadLabel(filters.workload)} | Recommended: Xeon ${top.sku} | ${top.cores} cores | ${top.tdpW}W | SPECint ${top.specInt2017} | ${fmtMoney(top.costUsd * deal.serverQty * deal.socketsPerServer)} CPU investment | Performance ${q.performance} | Value ${q.value} | Efficiency ${q.efficiency}`; await navigator.clipboard.writeText(text); };

  const exportExcel = () => {
    const headers = ["Rank", "SKU", "Family", "Codename", "Core Type", "P-Cores", "E-Cores", "Avg Cores (P+E)", "Total Cores", "Max Turbo (GHz)", "Base (GHz)", "Cache (MB)", "TDP (W)", "Total TDP", "Chips", "SPECint2017", "Perf / $", "Perf / Watt", "CPU Price / Unit (USD)", "Catalog Config CPU Price (USD)", "Max Scalability", "Segment", "Score"];
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

  return <main className="dashboard-shell">
    <Header />
    <DealConfiguration deal={deal} setDeal={setDeal} filters={filters} />
    <section className="dashboard">
      <FiltersPanel pending={pending} setPending={setPending} setFilters={setFilters} />
      <div style={{ display: "grid", gap: 6 }}>
        <Recommendation top={top} filters={filters} pool={filtered} deal={deal} onCompare={()=>setShowCompare(v=>!v)} />
        <CompatibilitySummary top={top} filters={filters} />
        <CommercialAlternatives filtered={filtered} top={top} filters={filters} />
        <DealWarnings top={top} filtered={filtered} filters={filters} deal={deal} />
      </div>
      <div style={{ display: "grid", gap: 6 }}>
        <KeyMetrics filtered={filtered} />
<RadarPanel top={top} topPerformance={topPerformance} />
        <WhyNot pool={filtered} top={top} filters={filters} />
      </div>
      <RankPanels filtered={filtered} />
    </section>
    <div style={{display:"flex",justifyContent:"flex-end",gap:6,marginTop:6}}><button onClick={copyDealSummary} disabled={!top}>Copy Deal Summary</button><button onClick={exportDealSummary} disabled={!top}>Export Deal Summary</button></div>
    {showCompare&&<CpuCompare pool={filtered} leftSku={leftSku || top?.sku || ""} rightSku={rightSku || filtered.find(c=>c.sku!==top?.sku)?.sku || ""} setLeftSku={setLeftSku} setRightSku={setRightSku} />}
    <CpuTable filtered={filtered} sortBy={sortBy} setSortBy={setSortBy} exportExcel={exportExcel} />
    <Footer />
  </main>;
}
