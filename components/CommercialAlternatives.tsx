import type { Cpu, Filters } from "@/data/types";
import { fmtMoney, perfDollar, totalCost } from "@/lib/metrics";
import { scoreCpu } from "@/lib/scoring";
import { Panel, Title } from "./ui";

function nextDistinct(list: Cpu[], top: Cpu | null){ return list.find(c=>c.sku!==top?.sku) || list[0] || null; }
function Row({label,cpu,color,top}:{label:string;cpu:Cpu|null;color:string;top:Cpu|null}){
 if(!cpu)return <div style={{border:`1px solid ${color}`,borderRadius:7,padding:8,opacity:.75}}><b style={{color}}>{label}</b><div style={{fontSize:12,marginTop:5}}>No matching option</div></div>;
 const price=top?Math.round((totalCost(cpu)/Math.max(1,totalCost(top))-1)*100):0;
 const perf=top?Math.round((cpu.specInt2017/Math.max(1,top.specInt2017)-1)*100):0;
 return <div style={{border:`1px solid ${color}`,borderRadius:7,padding:8,background:"rgba(255,255,255,.03)",display:"grid",gridTemplateColumns:"1.1fr 1fr",gap:8}}><div><div style={{color,fontWeight:800,fontSize:12}}>{label}</div><div style={{fontSize:19,fontWeight:900,marginTop:3}}>Xeon {cpu.sku}</div><div style={{fontSize:11,color:"#9fb0bd"}}>{cpu.segment} • {cpu.tdpW}W • {fmtMoney(totalCost(cpu))}</div></div><div style={{fontSize:11,lineHeight:1.55,borderLeft:"1px solid rgba(97,145,175,.25)",paddingLeft:8}}><b>vs. Recommended</b><br/>Performance <span style={{color}}>{perf>0?"+":""}{perf}%</span><br/>Price <span style={{color}}>{price>0?"+":""}{price}%</span></div></div>
}
export function CommercialAlternatives({filtered,top,filters}:{filtered:Cpu[];top:Cpu|null;filters:Filters}){
 const tce=nextDistinct(filtered.filter(c=>c.segment==="TCE").sort((a,b)=>scoreCpu(b,filters)-scoreCpu(a,filters)),top);
 const value=nextDistinct([...filtered].sort((a,b)=>perfDollar(b)-perfDollar(a)),top);
 const power=nextDistinct([...filtered].sort((a,b)=>a.tdpW-b.tdpW),top);
 return <Panel><Title>Commercial Alternatives</Title><div style={{padding:8,display:"grid",gap:6}}><Row label="Best TCE Alternative" color="#39ff5f" cpu={tce} top={top}/><Row label="Best Value Alternative" color="#18a8ff" cpu={value} top={top}/><Row label="Lowest Power Alternative" color="#ff9a2e" cpu={power} top={top}/></div></Panel>
}