import React from "react";
import type { Filters, SystemModel, Workload } from "@/data/types";
import { defaultFilters, systems } from "@/data/systems";
import { fmtMoney } from "@/lib/metrics";
import { Panel, Select } from "./ui";

export function FiltersPanel({ pending, setPending, setFilters }: { pending: Filters; setPending: (f: Filters) => void; setFilters: (f: Filters) => void }) {
  const slider = (label: string, key: "maxBudget" | "minAvgCores" | "maxTdp" | "minSpec", min: number, max: number, step: number, display?: string, help?: string) => <div style={{ marginBottom: 12 }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, marginBottom: 5 }}><span>{label}</span><span style={{ border: "1px solid #38566d", borderRadius: 4, padding: "6px 10px", minWidth: 60, textAlign: "center", background: "#071724" }}>{display ?? pending[key]}</span></div><input className="control-input" type="range" min={min} max={max} step={step} value={pending[key]} onChange={e => setPending({ ...pending, [key]: Number(e.target.value) })} style={{ width: "72%", accentColor: "#0969e8" }} />{help && <div style={{ fontSize: 10, color: "#9fb0bd", lineHeight: 1.35, marginTop: 4 }}>{help}</div>}</div>;
  return <Panel><div style={{ padding: "10px 14px", borderBottom: "1px solid rgba(97,145,175,.25)", display: "flex", justifyContent: "space-between" }}><b>FILTERS</b><button onClick={() => { setPending(defaultFilters); setFilters(defaultFilters); }} style={{ background: "transparent", border: 0, color: "#18a8ff" }}>Reset All</button></div><div style={{ padding: 12 }}>
    <Select label="Optimize Choice" value={pending.workload} onChange={v => setPending({ ...pending, workload: v as Workload })} opts={[["any", "Optimize Choice"], ["database", "Database & Analytics"], ["hpc-ai", "HPC / AI"], ["web", "Web & Microservices"], ["cloud", "Cloud Native"], ["storage", "Infrastructure & Storage"]]} />
    <Select label="System" value={pending.system} onChange={v => setPending({ ...pending, system: v as SystemModel, ...((v === "st50-v3" || v === "sr250-v3") ? { workload: "any" as Workload } : {}) })} opts={Object.entries(systems).filter(([value]) => value !== "any").map(([value, item]) => [value, item.label])} />
    {slider("Max System Budget (USD)", "maxBudget", 100, 60000, 100, fmtMoney(pending.maxBudget))}
    {slider("Min Avg Cores (P + E)", "minAvgCores", 0, 172, 1, String(pending.minAvgCores), "Applies to both P-Cores and E-Cores using the visible core count field.")}
    {slider("Max TDP / Socket (W)", "maxTdp", 50, 400, 5)}
    {slider("Min SPECint2017", "minSpec", 0, 3000, 10)}
    <Select label="Core Type" value={pending.coreKind} onChange={v => setPending({ ...pending, coreKind: v as Filters["coreKind"] })} opts={[["all", "All Core Types"], ["p", "P-Cores only"], ["e", "E-Cores only"]]} />
    <Select label="Segment" value={pending.segment} onChange={v => setPending({ ...pending, segment: v as Filters["segment"] })} opts={[["all", "All Segments"], ["Extended", "Extended CPU"], ["Mainstream", "Mainstream CPU"], ["Specialised", "Specialised CPU"], ["TCE", "TCE"]]} />
    <Select label="Max Scalability" value={pending.scalability} onChange={v => setPending({ ...pending, scalability: v as Filters["scalability"] })} opts={[["any", "Any"], ["1S", "1S"], ["2S", "2S"], ["4S", "4S"]]} />
    <Select label="Socket Support" value={pending.socket} onChange={v => setPending({ ...pending, socket: v as Filters["socket"] })} opts={[["any", "Any"], ["1", "1"], ["2", "2"], ["4", "4"]]} />
    <button onClick={() => setFilters(pending)} style={{ width: "100%", padding: "9px", border: 0, borderRadius: 4, background: "linear-gradient(180deg,#0878ff,#0758d8)", color: "white", fontWeight: 700, marginTop: 8 }}>Apply Filters</button>
    <button onClick={() => { setPending(defaultFilters); setFilters(defaultFilters); }} style={{ width: "100%", padding: "9px", border: "1px solid #223d52", borderRadius: 4, background: "rgba(255,255,255,.03)", color: "white", marginTop: 8 }}>Clear All Filters</button>
  </div></Panel>;
}
