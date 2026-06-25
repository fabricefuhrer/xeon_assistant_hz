"use client";
import type { Cpu } from "@/data/types";
import { eCores, normalize, pCores } from "@/lib/metrics";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Tooltip } from "recharts";
import { Panel, Title } from "./ui";

export function RadarPanel({ top, topPerformance }: { top: Cpu | null; topPerformance: Cpu[] }) {
  const candidates = top ? [top, ...topPerformance.filter(c => c.sku !== top.sku).slice(0, 4)] : topPerformance.slice(0, 5);
  const axes = ["P-Cores", "E-Cores", "SPECint2017", "Cache (MB)", "Max Turbo (GHz)"];
  const metric = (cpu: Cpu, axis: string) => axis === "P-Cores" ? pCores(cpu) : axis === "E-Cores" ? eCores(cpu) : axis === "SPECint2017" ? cpu.specInt2017 : axis === "Cache (MB)" ? cpu.cacheMB : cpu.maxTurboGHz;
  const data = axes.map(axis => {
    const values = candidates.map(c => metric(c, axis));
    const min = Math.min(...values, 0), max = Math.max(...values, 1);
    const row: Record<string, string | number> = { metric: axis };
    candidates.forEach(c => row[c.sku] = normalize(metric(c, axis), min, max));
    return row;
  });
  return <Panel><Title>Performance Radar <span style={{ color: "#cbd5e1", fontWeight: 500, textTransform: "none" }}>(Normalized)</span><span style={{ float: "right", color: "#9fb0bd", fontSize: 11, textTransform: "none" }}>Higher is better</span></Title><div style={{ height: 230, padding: "2px 8px 4px" }}>{candidates.length ? <ResponsiveContainer><RadarChart data={data} outerRadius="68%"><PolarGrid stroke="#31526a" /><PolarAngleAxis dataKey="metric" tick={{ fill: "#d8e1e8", fontSize: 11 }} /><PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />{candidates.map((c, i) => <Radar key={c.sku} name={`Xeon ${c.sku}`} dataKey={c.sku} stroke={["#39ff5f", "#18a8ff", "#d85aff", "#ffd400", "#ff3333"][i]} fill={["#39ff5f", "#18a8ff", "#d85aff", "#ffd400", "#ff3333"][i]} fillOpacity={0.05} />)}<Tooltip contentStyle={{ background: "#071724", border: "1px solid #25445c", color: "white" }} /><Legend wrapperStyle={{ fontSize: 11 }} /></RadarChart></ResponsiveContainer> : <div style={{ padding: 20, color: "#9fb0bd" }}>No data to display.</div>}</div><div style={{ padding: "0 12px 8px", color: "#9fb0bd", fontSize: 11 }}>Scores are normalized within the current filtered CPU pool.</div></Panel>;
}
