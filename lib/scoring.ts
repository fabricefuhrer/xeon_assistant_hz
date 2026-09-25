import type { Cpu, Filters, Workload } from "@/data/types";
import { perfDollar, perfWatt, maxSocketCount, totalCores } from "./metrics";

export function workloadLabel(workload: Workload) {
  const labels: Record<Workload, string> = {
    any: "Optimize Choice", "hpc-ai": "HPC / AI", database: "Database & Analytics",
    web: "Web & Microservices", cloud: "Cloud Native", storage: "Infrastructure & Storage"
  };
  return labels[workload];
}
export function workloadFit(cpu: Cpu, workload: Workload) {
  if (workload === "any") return 1;
  if (workload === "hpc-ai") return cpu.coreType === "P-Cores" ? 1.35 : 0.72;
  if (workload === "database") return cpu.coreType === "P-Cores" ? 1.25 : 0.82;
  if (["web", "cloud"].includes(workload)) return cpu.coreType === "E-Cores" ? 1.28 : 0.88;
  if (workload === "storage") return cpu.tdpW <= 250 ? 1.18 : 0.92;
  return 1;
}
export function scoreCpu(cpu: Cpu, filters: Filters) {
  const spec=cpu.specInt2017, cores=totalCores(cpu), value=perfDollar(cpu), efficiency=perfWatt(cpu), turbo=cpu.maxTurboGHz;
  let score=spec*.55+cores*4+value*120+efficiency*90+turbo*35;
  if (filters.system==="sr250-v3"||filters.system==="st50-v3") {
    score=spec*.45+cpu.cores*18+turbo*45+efficiency*140-cpu.tdpW*.9;
    if(cpu.tdpW<=65) score+=45;
    if(cpu.family==="Xeon E"||cpu.family==="Xeon 6300") score+=40;
  }
  if(filters.workload==="any") score+=value*90+efficiency*60;
  if(filters.workload==="database") score+=cpu.cacheMB*.45+turbo*35+(cpu.coreType==="P-Cores"?90:-40);
  if(filters.workload==="hpc-ai") score+=spec*.32+cores*2.4+turbo*55+(["Extended","Specialised"].includes(cpu.segment)?85:0)+(cpu.coreType==="P-Cores"?130:-120);
  if(filters.workload==="web"||filters.workload==="cloud") score+=cores*7+efficiency*125+(cpu.coreType==="E-Cores"?220:0);
  if(filters.workload==="storage") score+=maxSocketCount(cpu)>=2?85:0;
  return Math.round(score*workloadFit(cpu,filters.workload));
}
export function recommendationReasons(cpu: Cpu, filters: Filters) {
  const r:string[]=[];
  if(filters.workload==="database") r.push("Strong frequency and cache profile for database and analytics workloads.");
  else if(filters.workload==="hpc-ai") r.push("P-Core performance, throughput and turbo are weighted for HPC / AI host workloads.");
  else if(filters.workload==="web"||filters.workload==="cloud") r.push(cpu.coreType==="E-Cores"?"High core density and efficiency align well with scale-out services.":"Strong scale-out option within the compatible platform pool.");
  else if(filters.workload==="storage") r.push("Balanced power, performance and platform scalability for infrastructure workloads.");
  else r.push("Balanced overall fit across performance, value, efficiency and turbo.");
  r.push(`${cpu.segment} commercial segment; ${cpu.maxScalability} maximum CPU scalability.`);
  r.push(`${cpu.cores} ${cpu.coreType} per CPU, ${cpu.maxTurboGHz} GHz max turbo and ${cpu.tdpW}W TDP.`);
  return r;
}