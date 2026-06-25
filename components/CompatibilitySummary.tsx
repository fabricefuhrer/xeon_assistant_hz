import type { Cpu, Filters } from "@/data/types";
import { systems } from "@/data/systems";
import { workloadLabel } from "@/lib/scoring";
import { Panel, Title } from "./ui";

export function CompatibilitySummary({ top, filters }: { top: Cpu | null; filters: Filters }) {
  const selectedSystem = systems[filters.system];
  return <Panel><Title color="#9cff70">Compatibility Summary</Title><div style={{ padding: "10px 14px", fontSize: 12 }}>{top ? <><div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 6 }}><span>✅ System</span><b>{selectedSystem.label}</b><span>✅ Core Type</span><b>{top.coreType}</b><span>✅ Workload</span><b>{workloadLabel(filters.workload)}</b><span>✅ Socket Support</span><b>{top.maxScalability}</b><span>✅ TDP Limit</span><b>Up to {filters.maxTdp}W</b></div><div style={{ marginTop: 9, borderTop: "1px solid rgba(97,145,175,.25)", paddingTop: 8, color: "#d8e1e8" }}><span style={{ color: "#46ff63", marginRight: 8 }}>✓</span>This CPU is fully compatible with your selections.</div></> : <div style={{ color: "#ffd2d2", lineHeight: 1.45 }}><b>No compatible option.</b><br />Entry CPUs are only ST50/SR250. E-Cores only SR630 V4. Xeon 6500/6700 P-Cores only SR630 V4 and higher SR systems.</div>}</div></Panel>;
}
