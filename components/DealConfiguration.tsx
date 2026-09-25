"use client";
import type { DealConfig,Filters } from "@/data/types";
import { systems } from "@/data/systems";
import { Panel } from "./ui";
export function DealConfiguration({deal,setDeal,filters}:{deal:DealConfig;setDeal:(d:DealConfig)=>void;filters:Filters}){
 const max=systems[filters.system].maxSockets;
 const actualSockets=Math.min(deal.socketsPerServer,max) as 1|2|4;
 const input={background:"#071724",border:"1px solid #25445c",borderRadius:4,color:"#fff",padding:"6px 8px",width:"100%",height:30};
 const setSockets=(n:1|2|4)=>setDeal({...deal,socketsPerServer:n});
 const setSystemSafeSockets=max<deal.socketsPerServer?max as 1|2|4:deal.socketsPerServer;
 return <Panel style={{marginBottom:6}}><div className="deal-config">
 <b className="deal-title">DEAL CONFIGURATION</b>
 <label>Customer<input style={input} value={deal.customer} placeholder="Optional" onChange={e=>setDeal({...deal,customer:e.target.value})}/></label>
 <label>Opportunity<input style={input} value={deal.opportunity} placeholder="Optional" onChange={e=>setDeal({...deal,opportunity:e.target.value})}/></label>
 <label>Servers<input style={input} type="number" min={1} value={deal.serverQty} onChange={e=>setDeal({...deal,serverQty:Math.max(1,Number(e.target.value)||1)})}/></label>
 <label>CPUs / Server<select style={input} value={setSystemSafeSockets} onChange={e=>setSockets(Number(e.target.value) as 1|2|4)}>{[1,2,4].filter(x=>x<=max).map(x=><option key={x} value={x}>{x} CPU{x>1?"s":""}</option>)}</select><span className="socket-hint">{systems[filters.system].label}: up to {max} CPU{max>1?"s":""}</span></label>
 </div></Panel>
}