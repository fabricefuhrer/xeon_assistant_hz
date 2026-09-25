import type { Cpu } from "@/data/types";
import { fmtMoney, perfDollar, perfWatt, totalCost } from "@/lib/metrics";
import { Panel, Title } from "./ui";
const delta=(a:number,b:number)=>b?Math.round((a/b-1)*100):0;
export function CpuCompare({recommended,alternative}:{recommended:Cpu|null;alternative:Cpu|null}){
 if(!recommended||!alternative)return null;
 const rows:[string,string|number,string|number][]=[
  ["Cores / CPU",recommended.cores,alternative.cores],
  ["Max Turbo",`${recommended.maxTurboGHz} GHz`,`${alternative.maxTurboGHz} GHz`],
  ["TDP / CPU",`${recommended.tdpW} W`,`${alternative.tdpW} W`],
  ["SPECint2017",recommended.specInt2017,alternative.specInt2017],
  ["Configured Price",fmtMoney(totalCost(recommended)),fmtMoney(totalCost(alternative))],
  ["Perf / $",perfDollar(recommended).toFixed(3),perfDollar(alternative).toFixed(3)],
  ["Perf / Watt",perfWatt(recommended).toFixed(2),perfWatt(alternative).toFixed(2)]
 ];
 return <Panel style={{marginTop:6}}><Title>Quick CPU Compare</Title><div style={{padding:10}}><div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",fontSize:12,fontWeight:800,paddingBottom:6}}><span>Metric</span><span style={{textAlign:"center",color:"#39ff5f"}}>Xeon {recommended.sku}</span><span style={{textAlign:"center",color:"#18a8ff"}}>Xeon {alternative.sku}</span></div>{rows.map(r=><div key={r[0]} style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",fontSize:11,padding:"5px 0",borderTop:"1px solid rgba(97,145,175,.15)"}}><span>{r[0]}</span><span style={{textAlign:"center"}}>{r[1]}</span><span style={{textAlign:"center"}}>{r[2]}</span></div>)}<div style={{marginTop:7,fontSize:11,color:"#9fb0bd"}}>Alternative vs recommended: performance {delta(alternative.specInt2017,recommended.specInt2017)>0?"+":""}{delta(alternative.specInt2017,recommended.specInt2017)}% • price {delta(totalCost(alternative),totalCost(recommended))>0?"+":""}{delta(totalCost(alternative),totalCost(recommended))}%</div></div></Panel>
}