import React from "react";
import type { Filters,SystemModel,Workload } from "@/data/types";
import { cpuCatalog } from "@/data/cpus";
import { defaultFilters,systems } from "@/data/systems";
import { systemCompatible } from "@/lib/compatibility";
import { maxSocketCount } from "@/lib/metrics";
import { Panel,Select } from "./ui";
export function FiltersPanel({pending,setPending,setFilters}:{pending:Filters;setPending:(f:Filters)=>void;setFilters:(f:Filters)=>void}){
 const compatible=cpuCatalog.filter(c=>systemCompatible(c,pending));
 const hasE=compatible.some(c=>c.coreType==="E-Cores"),hasP=compatible.some(c=>c.coreType==="P-Cores");
 const segments=[...new Set(compatible.map(c=>c.segment))];
 const maxS=Math.max(1,...compatible.map(maxSocketCount));
 const slider=(label:string,key:"minAvgCores"|"maxTdp"|"minSpec",min:number,max:number,step:number,display?:string)=><div style={{marginBottom:12}}><div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:5}}><span>{label}</span><span style={{border:"1px solid #38566d",borderRadius:4,padding:"6px 10px",background:"#071724"}}>{display??pending[key]}</span></div><input type="range" min={min} max={max} step={step} value={pending[key]} onChange={e=>setPending({...pending,[key]:Number(e.target.value)})} style={{width:"72%",accentColor:"#0969e8"}}/></div>;
 const preset=(p:Partial<Filters>)=>setPending({...pending,...p});
 return <Panel><div style={{padding:"10px 14px",borderBottom:"1px solid rgba(97,145,175,.25)",display:"flex",justifyContent:"space-between"}}><b>FILTERS</b><button onClick={()=>{setPending(defaultFilters);setFilters(defaultFilters)}} style={{background:"transparent",border:0,color:"#18a8ff"}}>Reset All</button></div><div style={{padding:12}}>
 <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:4,marginBottom:10}}><button onClick={()=>preset({workload:"hpc-ai",segment:"all"})}>Performance</button><button onClick={()=>preset({workload:"any",segment:"Mainstream"})}>Value</button><button onClick={()=>preset({workload:"any",segment:"TCE"})}>TCE</button><button onClick={()=>preset({workload:"storage",segment:"all",maxTdp:250})}>Efficiency</button></div>
 <Select label="Optimize Choice" value={pending.workload} onChange={v=>setPending({...pending,workload:v as Workload})} opts={[["any","Optimize Choice"],["database","Database & Analytics"],["hpc-ai","HPC / AI"],["web","Web & Microservices"],["cloud","Cloud Native"],["storage","Infrastructure & Storage"]]}/>
 <Select label="System" value={pending.system} onChange={v=>setPending({...pending,system:v as SystemModel,coreKind:"all",segment:"all",scalability:"any",socket:"any"})} opts={Object.entries(systems).filter(([v])=>v!=="any").map(([v,x])=>[v,x.label])}/>
 {slider("Min Cores / CPU","minAvgCores",0,172,1)}{slider("Max TDP / Socket (W)","maxTdp",35,400,5)}{slider("Min SPECint2017","minSpec",0,3000,10)}
 <Select label="Core Type" value={pending.coreKind} onChange={v=>setPending({...pending,coreKind:v as Filters["coreKind"]})} opts={[["all","All Core Types"],...(hasP?[["p","P-Cores only"]]:[]),...(hasE?[["e","E-Cores only"]]:[])]}/>
 <Select label="Segment" value={pending.segment} onChange={v=>setPending({...pending,segment:v as Filters["segment"]})} opts={[["all","All Segments"],...segments.map(s=>[s,s==="TCE"?"TCE":`${s} CPU`])]}/>
 <Select label="Min Scalability" value={pending.scalability} onChange={v=>setPending({...pending,scalability:v as Filters["scalability"]})} opts={[["any","Any"],["1S","1S"],...(maxS>=2?[["2S","2S"]]:[]),...(maxS>=4?[["4S","4S"]]:[])]}/>
 <Select label="Required Sockets" value={pending.socket} onChange={v=>setPending({...pending,socket:v as Filters["socket"]})} opts={[["any","Any"],["1","1"],...(maxS>=2?[["2","2"]]:[]),...(maxS>=4?[["4","4"]]:[])]}/>
 <button onClick={()=>setFilters(pending)} style={{width:"100%",padding:9,border:0,borderRadius:4,background:"linear-gradient(180deg,#0878ff,#0758d8)",color:"white",fontWeight:700,marginTop:8}}>Apply Filters</button>
 </div></Panel>
}