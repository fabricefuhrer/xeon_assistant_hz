import Image from "next/image";
export function Header() {
  return <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "0 4px 10px" }}><div className="logo-row"><Image src="/lenovo-logo.jpg" width={118} height={36} alt="Lenovo" style={{ objectFit: "contain" }} /><Image src="/intel-logo.png" width={78} height={36} alt="Intel" style={{ objectFit: "contain" }} /><div style={{ width: 1, height: 36, background: "#355064" }} /><div><h1 style={{ margin: 0, fontSize: 26 }}>Xeon Deal Assistant</h1><p style={{ margin: "2px 0 0", color: "#c9d6e0", fontSize: 13 }}>Find the best Xeon CPU by workload, system, segment, cores, budget and efficiency</p></div></div><div style={{ fontSize: 12, color: "#d7e1e8" }}>Last updated: May 20, 2025</div></header>;
}
