import type { Cpu } from "@/data/types";
import { perfDollar } from "@/lib/metrics";
import { Panel, td, Title } from "./ui";

function RankPanel({ title, color, rows, header }: { title: string; color: string; rows: string[][]; header: string }) {
  return <Panel><Title color={color}>{title}</Title><div style={{ padding: "6px 12px 10px" }}><table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}><thead><tr><th style={{ ...td, textAlign: "left" }}>Rank</th><th style={{ ...td, textAlign: "left" }}>CPU</th><th style={{ ...td, textAlign: "right" }}>{header}</th></tr></thead><tbody>{rows.map((r, i) => <tr key={r[0]}><td style={{ ...td, textAlign: "left" }}>{i + 1}</td><td style={{ ...td, textAlign: "left" }}>Xeon {r[0]}</td><td style={{ ...td, textAlign: "right", color, fontWeight: 800 }}>{r[1]}</td></tr>)}</tbody></table><div style={{ fontSize: 11, color: "#9fb0bd", marginTop: 8 }}>Higher is better</div></div></Panel>;
}

export function RankPanels({ filtered }: { filtered: Cpu[] }) {
  const bestValue = [...filtered].sort((a, b) => perfDollar(b) - perfDollar(a)).slice(0, 5);
  const topPerformance = [...filtered].sort((a, b) => b.specInt2017 - a.specInt2017).slice(0, 5);
  return <div className="side-grid"><RankPanel title="Best Value (Performance / $)" color="#39ff5f" rows={bestValue.map(c => [c.sku, perfDollar(c).toFixed(3)])} header="SPECint2017 / $" /><RankPanel title="Top Performance (SPECint2017)" color="#e15cff" rows={topPerformance.map(c => [c.sku, c.specInt2017.toLocaleString()])} header="SPECint2017" /></div>;
}
