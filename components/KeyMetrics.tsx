import type { Cpu } from "@/data/types";
import { eCores, fmtMoney, pCores, perfDollar, perfWatt, socketCount } from "@/lib/metrics";
import { Panel, Stat, Title } from "./ui";

export function KeyMetrics({ filtered }: { filtered: Cpu[] }) {
  const top = filtered[0] || null;
  const bestPerf = [...filtered].sort((a, b) => b.specInt2017 - a.specInt2017)[0] || top;
  const bestValue = [...filtered].sort((a, b) => perfDollar(b) - perfDollar(a))[0] || top;
  const mostP = [...filtered].sort((a, b) => pCores(b) - pCores(a))[0] || top;
  const mostE = [...filtered].sort((a, b) => eCores(b) - eCores(a))[0] || top;
  const lowestTdp = [...filtered].sort((a, b) => a.tdpW - b.tdpW)[0] || top;
  const highTurbo = [...filtered].sort((a, b) => b.maxTurboGHz - a.maxTurboGHz)[0] || top;
  const efficient = [...filtered].sort((a, b) => perfWatt(b) - perfWatt(a))[0] || top;
  const maxScalability = [...filtered].sort((a, b) => socketCount(b) - socketCount(a))[0] || top;
  const prices = filtered.map(c => c.costUsd);
  const priceRange = filtered.length ? `${fmtMoney(Math.min(...prices))} - ${fmtMoney(Math.max(...prices))}` : "-";
  return <Panel><Title>Key Metrics</Title><div style={{ padding: "7px 14px 0", color: "#9fb0bd", fontSize: 12, lineHeight: 1.35 }}><b style={{ color: "#18a8ff" }}>Calculated from the current compatible CPU pool only.</b> Changing System, Workload, Budget, Core Type or Segment recalculates these values.</div><div className="stat-grid" style={{ padding: 12 }}><Stat label="Best Performance" value={bestPerf ? bestPerf.specInt2017.toLocaleString() : "-"} hint="SPECint2017" /><Stat label="Best Value" value={bestValue ? perfDollar(bestValue).toFixed(3) : "-"} accent="#39ff5f" hint="SPECint / $" /><Stat label="Most P-Cores" value={mostP ? pCores(mostP) : "-"} /><Stat label="Most E-Cores" value={mostE ? eCores(mostE) : "-"} /><Stat label="Lowest Power" value={lowestTdp ? `${lowestTdp.tdpW}W` : "-"} /><Stat label="Highest Turbo" value={highTurbo ? `${highTurbo.maxTurboGHz} GHz` : "-"} /><Stat label="Best Efficiency" value={efficient ? perfWatt(efficient).toFixed(2) : "-"} /><Stat label="Price Range" value={priceRange} /></div></Panel>;
}
