"use client";
import type {DealConfig,Filters} from "@/data/types";import {systems} from "@/data/systems";import {Panel} from "./ui";
export function DealConfiguration({deal,setDeal,filters}:{deal:DealConfig;setDeal:(d:DealConfig)=>void;filters:Filters}){
 const max=systems[filters.system].maxSockets;const shown=Math.min(deal.socketsPerServer,max) as 1|2|4;
 const change=(n:1|2|4)=>setDeal({...deal,socketsPerServer:n});
 return <Panel style={{marginBottom:6}}><div className="deal-config-fixed"><b className="deal-title">DEAL CONFIGURATION</b>
 <label><span>Customer</span><input value={deal.customer} placeholder="Optional" onChange={e=>setDeal({...deal,customer:e.target.value})}/></label>
 <label><span>Opportunity</span><input value={deal.opportunity} placeholder="Optional" onChange={e=>setDeal({...deal,opportunity:e.target.value})}/></label>
 <label><span>Servers</span><input type="number" min={1} value={deal.serverQty} onChange={e=>setDeal({...deal,serverQty:Math.max(1,Number(e.target.value)||1)})}/></label>
 <label><span>CPUs / Server</span><select value={shown} onChange={e=>change(Number(e.target.value) as 1|2|4)}>{[1,2,4].filter(x=>x<=max).map(x=><option key={x} value={x}>{x}</option>)}</select></label>
 <div className="deal-capacity"><span>{systems[filters.system].label}</span><b>MAX {max} CPU{max>1?"s":""}</b>{systems[filters.system].lenovoPress&&<a href={systems[filters.system].lenovoPress} target="_blank" rel="noreferrer">Lenovo Press ↗</a>}</div>
 </div></Panel>
}