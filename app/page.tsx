"use client";

import React, { useMemo, useRef, useState } from "react";
import type { Cpu, DealConfig, Filters } from "@/data/types";
import { cpuCatalog } from "@/data/cpus";
import { specResult } from "@/data/specResults";
import { defaultFilters } from "@/data/systems";
import { allowedByFilters, bestFallback } from "@/lib/compatibility";
import { avgCores, eCores, fmtMoney, pCores, perfDollar, perfWatt, benchmarkSockets, specBase, totalCores, totalCost, totalTdp } from "@/lib/metrics";
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
  const [busy, setBusy] = useState(false);
  const [leftSku, setLeftSku] = useState("");
  const [rightSku, setRightSku] = useState("");
  const [thirdSku, setThirdSku] = useState("");
  const compareRef = useRef<HTMLDivElement>(null);
  const [deal, setDeal] = useState<DealConfig>({customer:"",opportunity:"",serverQty:1,socketsPerServer:2});

  const specCatalog = useMemo(() => cpuCatalog.filter(cpu => Boolean(specResult(cpu.sku))), []);
  const filtered = useMemo(() => specCatalog.filter(cpu => allowedByFilters(cpu, filters, deal)).sort((a, b) => {
    if (sortBy === "score") return scoreCpu(b, filters) - scoreCpu(a, filters);
    if (sortBy === "value") return perfDollar(b) - perfDollar(a);
    if (sortBy === "efficiency") return perfWatt(b) - perfWatt(a);
    if (sortBy === "price") return totalCost(a) - totalCost(b);
    return specBase(b) - specBase(a);
  }), [filters, sortBy, deal, specCatalog]);

  const fallback = filtered.length ? null : bestFallback(specCatalog,filters,deal,cpu=>scoreCpu(cpu,filters));
  const displayPool = filtered.length ? filtered : (fallback ? [fallback] : []);
  const selectedCpu = filters.sku!=="all" ? specCatalog.find(cpu=>cpu.sku===filters.sku && allowedByFilters(cpu,filters,deal)) || null : null;
  const top: Cpu | null = selectedCpu || displayPool[0] || null;
  const topPerformance = [...displayPool].sort((a, b) => specBase(b) - specBase(a)).slice(0, 5);
  const runBusy=(fn:()=>void)=>{setBusy(true);window.setTimeout(()=>{fn();window.setTimeout(()=>setBusy(false),350)},120)};
  const openCompare=()=>runBusy(()=>compareRef.current?.scrollIntoView({behavior:"smooth",block:"center"}));


  const exportDealSummary = () => {
    if (!top) return;
    const q = scoreBreakdown(top, displayPool);
    const lines = ["Xeon Deal Assistant - Recommendation Summary", "", `Customer: ${deal.customer || "-"}`, `Opportunity: ${deal.opportunity || "-"}`, `Servers: ${deal.serverQty}`, `CPUs / Server: ${deal.socketsPerServer}`, `Total CPU Qty: ${deal.serverQty * deal.socketsPerServer}`, "", `System: ${systems[filters.system].label}`, `Workload: ${workloadLabel(filters.workload)}`, `Recommended CPU: Xeon ${top.sku}`, `Top Choice Express: ${top.tce?"TCE":"Not TCE"}`, `Segment: ${top.segment}`, `Cores / CPU: ${top.cores}`, `Max Turbo: ${top.maxTurboGHz} GHz`, `TDP / CPU: ${top.tdpW} W`, `SPECrate2017_int_base: ${specBase(top)} (${benchmarkSockets(top)} enabled chip${benchmarkSockets(top)>1?"s":""})`, `Intel RCP / Unit: ${fmtMoney(top.costUsd)}`, `Total Intel RCP Investment: ${fmtMoney(top.costUsd * deal.serverQty * deal.socketsPerServer)}`, "", `Performance: ${q.performance}`, `Value: ${q.value}`, `Efficiency: ${q.efficiency}`, `Turbo: ${q.turbo}`, "", "Why this CPU:", ...recommendationReasons(top, filters).map(x => `- ${x}`)];
    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href=url; a.download=`xeon-deal-${top.sku}.txt`; a.click(); URL.revokeObjectURL(url);
  };

  const exportPdf = async () => {
    if (!top) return;
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({unit:"mm",format:"a4"});
    const q=scoreBreakdown(top,displayPool), qty=deal.serverQty*deal.socketsPerServer;
    const imageData=async(src:string)=>{const res=await fetch(src);if(!res.ok)throw new Error("Unable to load "+src);const blob=await res.blob();return await new Promise<string>((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result));reader.onerror=()=>reject(reader.error);reader.readAsDataURL(blob)})};
    let y=18; const line=(label:string,value:string)=>{doc.setFont("helvetica","bold");doc.text(label,16,y);doc.setFont("helvetica","normal");doc.text(value,62,y);y+=7};
    // Branded PDF header: use the same Lenovo and Intel logo assets shown in the app.
    doc.setFillColor(247,249,251);doc.roundedRect(12,10,186,29,2,2,"F");
    try{const [lenovoLogo,intelLogo]=await Promise.all([imageData("/lenovo-logo.jpg"),imageData("/intel-logo.png")]);doc.addImage(lenovoLogo,"JPEG",16,15,31,9.5,undefined,"FAST");doc.addImage(intelLogo,"PNG",52,14.5,20.5,10,undefined,"FAST")}catch{/* Keep PDF generation available if a logo asset cannot be loaded. */}
    doc.setDrawColor(205,214,221);doc.line(78,14,78,35);
    doc.setFontSize(18);doc.setTextColor(20,31,40);doc.setFont("helvetica","bold");doc.text("Xeon Deal Assistant",84,22);doc.setFontSize(9.5);doc.setFont("helvetica","normal");doc.setTextColor(82,96,107);doc.text("Lenovo + Intel | Deal Recommendation Summary",84,29);doc.setTextColor(0);y=49;
    line("Customer",deal.customer||"-");line("Opportunity",deal.opportunity||"-");line("System",systems[filters.system].label);line("Workload",workloadLabel(filters.workload));line("Servers",String(deal.serverQty));line("CPUs / Server",String(deal.socketsPerServer));line("Total CPU Qty",String(qty));y+=3;
    doc.setFontSize(14);doc.setFont("helvetica","bold");doc.text(`Recommended: Intel Xeon ${top.sku}`,16,y);y+=9;doc.setFontSize(10);
    line("Top Choice Express",top.tce?"TCE":"Not TCE");line("Segment",top.segment);line("Core Type",top.coreType);line("Cores / CPU",String(top.cores));line("Max Turbo",`${top.maxTurboGHz} GHz`);line("TDP / CPU",`${top.tdpW} W`);line("SPECint2017",`${specBase(top).toLocaleString()} (${benchmarkSockets(top)} enabled chip${benchmarkSockets(top)>1?"s":""})`);line("Intel RCP / Unit",fmtMoney(top.costUsd));line("Intel RCP Investment",fmtMoney(top.costUsd*qty));y+=4;
    doc.setFont("helvetica","bold");doc.text("Recommendation quality",16,y);y+=7;doc.setFont("helvetica","normal");doc.text(`Performance: ${q.performance}   Value: ${q.value}   Efficiency: ${q.efficiency}   Turbo: ${q.turbo}`,16,y);y+=10;
    doc.setFont("helvetica","bold");doc.text("Why this CPU?",16,y);y+=7;doc.setFont("helvetica","normal");recommendationReasons(top,filters).forEach(reason=>{const lines=doc.splitTextToSize(`- ${reason}`,175);doc.text(lines,16,y);y+=lines.length*5+2});
    const alternatives=displayPool.filter(x=>x.sku!==top.sku).slice(0,3);if(alternatives.length){y+=3;doc.setFont("helvetica","bold");doc.text("Other compatible options",16,y);y+=7;doc.setFont("helvetica","normal");alternatives.forEach(x=>{doc.text(`Xeon ${x.sku} | ${x.segment} | ${x.cores} cores | ${x.tdpW}W | ${fmtMoney(x.costUsd)}`,16,y);y+=6})}
    doc.setFontSize(8);doc.setTextColor(100);doc.text("Generated by Xeon Deal Assistant. Validate final platform configuration and commercial pricing before quotation.",16,287);
    doc.save(`xeon-deal-${top.sku}.pdf`);
  };

  const copyDealSummary = async () => { if(!top)return; const q=scoreBreakdown(top,displayPool); const text=`Xeon Deal Assistant | ${deal.customer || "Customer"} | ${deal.opportunity || "Opportunity"} | ${deal.serverQty} servers x ${deal.socketsPerServer} CPUs | ${systems[filters.system].label} | ${workloadLabel(filters.workload)} | Recommended: Xeon ${top.sku} | ${top.cores} cores | ${top.tdpW}W | SPECrate int base ${specBase(top)} (${benchmarkSockets(top)} enabled chips) | ${fmtMoney(top.costUsd * deal.serverQty * deal.socketsPerServer)} CPU investment | Performance ${q.performance} | Value ${q.value} | Efficiency ${q.efficiency}`; await navigator.clipboard.writeText(text); };

  const exportExcel = () => {
    const headers = ["Rank", "SKU", "Family", "Codename", "Core Type", "P-Cores", "E-Cores", "Avg Cores (P+E)", "Total Cores", "Max Turbo (GHz)", "Base (GHz)", "Cache (MB)", "TDP (W)", "Total TDP", "Chips", "SPECint2017", "Perf / $", "Perf / Watt", "Intel RCP / Unit (USD)", "Catalog Config RCP (USD)", "Max Scalability", "Top Choice Express", "Segment", "Score"];
    const rows = filtered.map((cpu, i) => [i + 1, cpu.sku, cpu.family, cpu.codename, cpu.coreType, pCores(cpu), eCores(cpu), avgCores(cpu), totalCores(cpu), cpu.maxTurboGHz, cpu.baseGHz, cpu.cacheMB, cpu.tdpW, totalTdp(cpu), cpu.chips, cpu.specInt2017, perfDollar(cpu).toFixed(3), perfWatt(cpu).toFixed(2), cpu.costUsd, totalCost(cpu), cpu.maxScalability, cpu.tce ? "TCE" : "Not TCE", cpu.segment, scoreCpu(cpu, filters)]);
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
    <div className={`activity-orb ${busy?"busy":""}`} title={busy?"Xeon Assistant is processing":"Xeon Assistant ready"} aria-label={busy?"Processing":"Ready"} />
    <DealConfiguration deal={deal} setDeal={setDeal} filters={filters} />
    <section className="dashboard-fixed">
      <FiltersPanel pending={pending} setPending={setPending} setFilters={(f)=>runBusy(()=>setFilters(f))} deal={deal} />
      <div style={{ display: "grid", gap: 6 }}>
        <Recommendation top={top} filters={filters} pool={displayPool} deal={deal} onCompare={openCompare} />
        <CompatibilitySummary top={top} filters={filters} deal={deal} />
        <CommercialAlternatives filtered={displayPool} top={top} filters={filters} />
        <DealWarnings top={top} filtered={displayPool} filters={filters} deal={deal} />
      </div>
      <div style={{ display: "grid", gap: 6 }}>
        <KeyMetrics filtered={displayPool} />
        <RadarPanel top={top} topPerformance={topPerformance} />
        <WhyNot pool={displayPool} top={top} filters={filters} />
      </div>
      <RankPanels filtered={displayPool} />
    </section>
    {fallback&&<div className="fallback-note">No exact filter match. Showing the closest compatible CPU for the selected platform and deal configuration.</div>}
    <div className="action-bar"><button onClick={copyDealSummary} disabled={!top}>Copy Deal Summary</button><button onClick={exportDealSummary} disabled={!top}>Export Deal Summary</button><button onClick={exportPdf} disabled={!top}>Generate PDF</button></div>
    <div ref={compareRef} className="compare-anchor"><CpuCompare pool={displayPool} firstSku={leftSku || top?.sku || ""} secondSku={rightSku || filtered.find(c=>c.sku!==top?.sku)?.sku || ""} thirdSku={thirdSku} setFirstSku={setLeftSku} setSecondSku={setRightSku} setThirdSku={setThirdSku} /></div>
    <CpuTable filtered={displayPool} sortBy={sortBy} setSortBy={setSortBy} exportExcel={exportExcel} />
    <Footer />
  </main>;
}
