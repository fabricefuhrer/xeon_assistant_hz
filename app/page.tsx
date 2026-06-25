"use client";

import React, { useMemo, useState } from "react";
import type { Cpu, Filters } from "@/data/types";
import { cpuCatalog } from "@/data/cpus";
import { defaultFilters } from "@/data/systems";
import { allowedByFilters } from "@/lib/compatibility";
import { avgCores, eCores, fmtMoney, pCores, perfDollar, perfWatt, totalCores, totalCost, totalTdp } from "@/lib/metrics";
import { scoreCpu } from "@/lib/scoring";
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

  const top: Cpu | null = filtered.length ? filtered[0] : null;
  const topPerformance = [...filtered].sort((a, b) => b.specInt2017 - a.specInt2017).slice(0, 5);

  const exportExcel = () => {
    const headers = ["Rank", "SKU", "Family", "Codename", "Core Type", "P-Cores", "E-Cores", "Avg Cores (P+E)", "Total Cores", "Max Turbo (GHz)", "Base (GHz)", "Cache (MB)", "TDP (W)", "Total TDP", "Chips", "SPECint2017", "Perf / $", "Perf / Watt", "CPU Price (USD)", "System Price (USD)", "Max Scalability", "Segment", "Score"];
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
    <section className="dashboard">
      <FiltersPanel pending={pending} setPending={setPending} setFilters={setFilters} />
      <div style={{ display: "grid", gap: 6 }}>
        <Recommendation top={top} filters={filters} />
        <CompatibilitySummary top={top} filters={filters} />
        <CommercialAlternatives filtered={filtered} top={top} filters={filters} />
      </div>
      <div style={{ display: "grid", gap: 6 }}>
        <KeyMetrics filtered={filtered} />
        <RadarPanel top={top} topPerformance={topPerformance} />
      </div>
      <RankPanels filtered={filtered} />
    </section>
    <CpuTable filtered={filtered} sortBy={sortBy} setSortBy={setSortBy} exportExcel={exportExcel} />
    <Footer />
  </main>;
}
