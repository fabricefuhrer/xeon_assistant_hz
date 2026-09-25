"use client";
import type { DealConfig,Filters } from "@/data/types";
import { systems } from "@/data/systems";
import { Panel,Title } from "./ui";
export function DealConfiguration({deal,setDeal,filters}:{deal:DealConfig;setDeal:(d:DealConfig)=>void;filters:Filters}){
 const max=systems[filters.system].maxSockets;
 const input={background:"#071724",border:"1px solid #25445c",borderRadius:4,color:"#fff",padding:"7px 8px",width:"100%"};
 return <Panel><Title>Deal Configuration</Title><div style={{padding:10,display:"grid",gridTemplateColumns:"1.4fr 1.4fr .7fr .8fr",gap:7}}>
 <label style={{fontSize:10,color:"#9fb0bd"}}>Customer<input style={input} value={deal.customer} placeholder="Optional" onChange={e=>setDeal({...deal,customer:e.target.value})}/></label>
 <label style={{fontSize:10,color:"#9fb0bd"}}>Opportunity<input style={input} value={deal.opportunity} placeholder="Optional" onChange={e=>setDeal({...deal,opportunity:e.target.value})}/></label>
 <label style={{fontSize:10,color:"#9fb0bd"}}>Servers<input style={input} type="number" min={1} value={deal.serverQty} onChange={e=>setDeal({...deal,serverQty:Math.max(1,Number(e.target.value)||1)})}/></label>
 <label style={{fontSize:10,color:"#9fb0bd"}}>CPUs / Server<select style={input} value={Math.min(deal.socketsPerServer,max)} onChange={e=>setDeal({...deal,socketsPerServer:Number(e.target.value) as 1|2|4})}>{[1,2,4].filter(x=>x<=max).map(x=><option key={x}>{x}</option>)}</select></label>
 </div></Panel>
}