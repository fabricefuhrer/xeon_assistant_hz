import React from "react";

export const selectStyle: React.CSSProperties = { width: "100%", padding: "7px 9px", background: "#071724", border: "1px solid #38566d", borderRadius: 4, color: "#fff", fontSize: 12 };
export const th: React.CSSProperties = { background: "rgba(255,255,255,.04)", border: "1px solid rgba(97,145,175,.22)", padding: "7px", textAlign: "center", fontWeight: 700, whiteSpace: "nowrap", fontSize: 12 };
export const td: React.CSSProperties = { border: "1px solid rgba(97,145,175,.18)", padding: "6px", textAlign: "center", color: "#eaf2f8", whiteSpace: "nowrap", fontSize: 12 };

export function Panel({ children, className = "", style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return <div className={`panel ${className}`} style={{ background: "linear-gradient(180deg,rgba(10,27,42,.96),rgba(5,17,27,.96))", border: "1px solid #25445c", borderRadius: 8, boxShadow: "0 16px 50px rgba(0,0,0,.28)", overflow: "hidden", ...style }}>{children}</div>;
}
export function Title({ children, color = "#18a8ff", style }: { children: React.ReactNode; color?: string; style?: React.CSSProperties }) {
  return <div style={{ padding: "10px 14px", borderBottom: "1px solid rgba(97,145,175,.25)", fontWeight: 800, color, textTransform: "uppercase", letterSpacing: .3, fontSize: 13, ...style }}>{children}</div>;
}
export function Stat({ label, value, accent = "#18a8ff", hint }: { label: string; value: string | number; accent?: string; hint?: string }) {
  return <div style={{ border: "1px solid #25445c", borderRadius: 7, padding: "9px 8px", textAlign: "center", background: "rgba(9,24,37,.85)", minHeight: 72 }}><div style={{ color: accent, fontSize: 11, marginBottom: 4 }}>{label}</div><div style={{ fontWeight: 800, fontSize: 20 }}>{value}</div>{hint && <div style={{ fontSize: 10, color: "#9fb0bd", marginTop: 3 }}>{hint}</div>}</div>;
}
export function Mini({ label, value }: { label: string; value: string | number }) {
  return <div style={{ border: "1px solid #25445c", borderRadius: 6, padding: "8px 6px", textAlign: "center", background: "rgba(255,255,255,.03)" }}><div style={{ fontWeight: 900, fontSize: 16 }}>{value}</div><div style={{ fontSize: 10, marginTop: 4, color: "#d8e1e8" }}>{label}</div></div>;
}
export function Select({ label, value, onChange, opts }: { label: string; value: string; onChange: (v: string) => void; opts: string[][] }) {
  return <div style={{ display: "grid", gridTemplateColumns: "1fr 1.65fr", alignItems: "center", gap: 8, marginBottom: 8, fontSize: 12 }}><label>{label}</label><select value={value} onChange={e => onChange(e.target.value)} style={selectStyle}>{opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></div>;
}
export function EmptyState({ title, children }: { title: string; children: React.ReactNode }) {
  return <Panel><Title color="#ff5252">{title}</Title><div style={{ padding: 16, fontSize: 13, lineHeight: 1.5, color: "#d8e1e8" }}>{children}</div></Panel>;
}
