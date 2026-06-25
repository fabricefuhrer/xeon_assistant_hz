import type { Cpu, Filters } from "@/data/types";
import { fmtMoney, pCores, perfDollar, totalCost } from "@/lib/metrics";
import { scoreCpu } from "@/lib/scoring";
import { Panel, Title } from "./ui";

function pct(a: number, b: number) { return b ? Math.round((a / b) * 100) : 0; }
function Row({ label, cpu, color, top, filters }: { label: string; cpu: Cpu | null; color: string; top: Cpu | null; filters: Filters }) {
  if (!cpu) return <div style={{ border: `1px solid ${color}`, borderRadius: 7, padding: 8, opacity: .75 }}><b style={{ color }}>{label}</b><div style={{ fontSize: 12, marginTop: 5 }}>No matching option</div></div>;
  const perf = top ? pct(cpu.specInt2017, top.specInt2017) : 0;
  const priceDelta = top ? Math.round(((totalCost(cpu) - totalCost(top)) / Math.max(1, totalCost(top))) * 100) : 0;
  return <div style={{ border: `1px solid ${color}`, borderRadius: 7, padding: 8, background: "rgba(255,255,255,.03)", display: "grid", gridTemplateColumns: "1.2fr 1fr .8fr", gap: 8, alignItems: "center" }}><div><div style={{ color, fontWeight: 800, fontSize: 12 }}>{label}</div><div style={{ fontSize: 20, fontWeight: 900, marginTop: 4 }}>Xeon {cpu.sku}</div></div><div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6, textAlign: "center", fontSize: 11 }}><span><b>{pCores(cpu)}</b><br />P-Cores</span><span><b>{cpu.specInt2017}</b><br />SPECint</span><span><b>{fmtMoney(totalCost(cpu))}</b><br />Price</span></div><div style={{ borderLeft: "1px solid rgba(97,145,175,.25)", paddingLeft: 8, fontSize: 11, lineHeight: 1.35 }}><b>vs. Recommended</b><br />Performance <span style={{ color }}>{perf}%</span><br />Price <span style={{ color }}>{priceDelta}%</span><br />Score <span style={{ color }}>{scoreCpu(cpu, filters)}</span></div></div>;
}

export function CommercialAlternatives({ filtered, top, filters }: { filtered: Cpu[]; top: Cpu | null; filters: Filters }) {
  const bestTce = filtered.filter(c => c.segment === "TCE").sort((a,b)=>scoreCpu(b,filters)-scoreCpu(a,filters))[0] || null;
  const bestValue = [...filtered].sort((a,b)=>perfDollar(b)-perfDollar(a))[0] || null;
  const lowestPower = [...filtered].sort((a,b)=>a.tdpW-b.tdpW)[0] || null;
  return <Panel><Title color="#f5f8fb">Commercial Alternatives</Title><div style={{ padding: 8, display: "grid", gap: 6 }}><Row label="Best TCE Option" color="#39ff5f" cpu={bestTce} top={top} filters={filters} /><Row label="Best Value Option" color="#18a8ff" cpu={bestValue} top={top} filters={filters} /><Row label="Lowest Power Option" color="#ff9a2e" cpu={lowestPower} top={top} filters={filters} /></div></Panel>;
}
