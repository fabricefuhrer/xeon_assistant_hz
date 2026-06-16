"use client";
import React, { useMemo, useState } from "react";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Tooltip } from "recharts";

const cpuCatalog = [
  { sku: "6315P", family: "Xeon 6300", codename: "Raptor Lake", coreType: "P-core", cores: 4, maxTurboGHz: 5.2, baseGHz: 2.8, cacheMB: 12, tdpW: 55, costUsd: 199, chips: 1, specInt2017: 41.6, maxScalability: "1S" },
  { sku: "6325P", family: "Xeon 6300", codename: "Raptor Lake", coreType: "P-core", cores: 4, maxTurboGHz: 5.2, baseGHz: 3.5, cacheMB: 12, tdpW: 55, costUsd: 253, chips: 1, specInt2017: 50.9, maxScalability: "1S" },
  { sku: "6333P", family: "Xeon 6300", codename: "Raptor Lake", coreType: "P-core", cores: 6, maxTurboGHz: 4.7, baseGHz: 3.1, cacheMB: 18, tdpW: 65, costUsd: 287, chips: 1, specInt2017: 71.1, maxScalability: "1S" },
  { sku: "6337P", family: "Xeon 6300", codename: "Raptor Lake", coreType: "P-core", cores: 6, maxTurboGHz: 5.3, baseGHz: 3.5, cacheMB: 18, tdpW: 80, costUsd: 337, chips: 1, specInt2017: 75.8, maxScalability: "1S" },
  { sku: "6349P", family: "Xeon 6300", codename: "Raptor Lake", coreType: "P-core", cores: 6, maxTurboGHz: 5.7, baseGHz: 3.6, cacheMB: 18, tdpW: 95, costUsd: 455, chips: 1, specInt2017: 79.2, maxScalability: "1S" },
  { sku: "6353P", family: "Xeon 6300", codename: "Raptor Lake", coreType: "P-core", cores: 8, maxTurboGHz: 5.4, baseGHz: 2.7, cacheMB: 24, tdpW: 65, costUsd: 383, chips: 1, specInt2017: 84.4, maxScalability: "1S" },
  { sku: "6357P", family: "Xeon 6300", codename: "Raptor Lake", coreType: "P-core", cores: 8, maxTurboGHz: 5.4, baseGHz: 3.0, cacheMB: 24, tdpW: 80, costUsd: 500, chips: 1, specInt2017: 96.6, maxScalability: "1S" },
  { sku: "6369P", family: "Xeon 6300", codename: "Raptor Lake", coreType: "P-core", cores: 8, maxTurboGHz: 5.7, baseGHz: 3.3, cacheMB: 24, tdpW: 95, costUsd: 545, chips: 1, specInt2017: 98.8, maxScalability: "1S" },

  { sku: "6505P", family: "Xeon 6500", codename: "Granite Rapids", coreType: "P-core", cores: 12, maxTurboGHz: 4.1, baseGHz: 2.2, cacheMB: 48, tdpW: 150, costUsd: 435, chips: 2, specInt2017: 286, maxScalability: "2S" },
  { sku: "6507P", family: "Xeon 6500", codename: "Granite Rapids", coreType: "P-core", cores: 8, maxTurboGHz: 4.3, baseGHz: 3.5, cacheMB: 48, tdpW: 150, costUsd: 551, chips: 2, specInt2017: 210, maxScalability: "2S" },
  { sku: "6511P", family: "Xeon 6500", codename: "Granite Rapids", coreType: "P-core", cores: 16, maxTurboGHz: 4.2, baseGHz: 2.3, cacheMB: 72, tdpW: 150, costUsd: 640, chips: 1, specInt2017: 195, maxScalability: "1S" },
  { sku: "6515P", family: "Xeon 6500", codename: "Granite Rapids", coreType: "P-core", cores: 16, maxTurboGHz: 3.8, baseGHz: 2.3, cacheMB: 72, tdpW: 150, costUsd: 515, chips: 2, specInt2017: 373, maxScalability: "2S" },
  { sku: "6517P", family: "Xeon 6500", codename: "Granite Rapids", coreType: "P-core", cores: 16, maxTurboGHz: 4.2, baseGHz: 3.2, cacheMB: 72, tdpW: 190, costUsd: 850, chips: 2, specInt2017: 388, maxScalability: "2S" },
  { sku: "6520P", family: "Xeon 6500", codename: "Granite Rapids", coreType: "P-core", cores: 24, maxTurboGHz: 4.0, baseGHz: 2.4, cacheMB: 144, tdpW: 210, costUsd: 950, chips: 2, specInt2017: 522, maxScalability: "2S" },
  { sku: "6521P", family: "Xeon 6500", codename: "Granite Rapids", coreType: "P-core", cores: 24, maxTurboGHz: 4.1, baseGHz: 2.6, cacheMB: 144, tdpW: 225, costUsd: 900, chips: 1, specInt2017: 296, maxScalability: "1S" },
  { sku: "6527P", family: "Xeon 6500", codename: "Granite Rapids", coreType: "P-core", cores: 24, maxTurboGHz: 4.2, baseGHz: 3.0, cacheMB: 144, tdpW: 255, costUsd: 1910, chips: 2, specInt2017: 592, maxScalability: "2S" },
  { sku: "6530P", family: "Xeon 6500", codename: "Granite Rapids", coreType: "P-core", cores: 32, maxTurboGHz: 4.1, baseGHz: 2.3, cacheMB: 144, tdpW: 225, costUsd: 1800, chips: 2, specInt2017: 706, maxScalability: "2S" },

  { sku: "6710E", family: "Xeon 6700", codename: "Sierra Forest", coreType: "E-core", cores: 64, maxTurboGHz: 3.2, baseGHz: 2.4, cacheMB: 96, tdpW: 205, costUsd: 1181, chips: 2, specInt2017: 695, maxScalability: "2S" },
  { sku: "6714P", family: "Xeon 6700", codename: "Granite Rapids", coreType: "P-core", cores: 8, maxTurboGHz: 4.3, baseGHz: 4.0, cacheMB: 48, tdpW: 165, costUsd: 2250, chips: 2, specInt2017: 210, maxScalability: "2S" },
  { sku: "6724P", family: "Xeon 6700", codename: "Granite Rapids", coreType: "P-core", cores: 16, maxTurboGHz: 4.3, baseGHz: 3.6, cacheMB: 72, tdpW: 210, costUsd: 2467, chips: 2, specInt2017: 402, maxScalability: "2S" },
  { sku: "6728P", family: "Xeon 6700", codename: "Granite Rapids", coreType: "P-core", cores: 24, maxTurboGHz: 4.1, baseGHz: 2.7, cacheMB: 144, tdpW: 210, costUsd: 1450, chips: 4, specInt2017: 1120, maxScalability: "4S" },
  { sku: "6731E", family: "Xeon 6700", codename: "Sierra Forest", coreType: "E-core", cores: 96, maxTurboGHz: 3.1, baseGHz: 2.2, cacheMB: 96, tdpW: 250, costUsd: 1209, chips: 1, specInt2017: 493, maxScalability: "1S" },
  { sku: "6731P", family: "Xeon 6700", codename: "Granite Rapids", coreType: "P-core", cores: 32, maxTurboGHz: 4.1, baseGHz: 2.5, cacheMB: 144, tdpW: 245, costUsd: 1700, chips: 1, specInt2017: 371, maxScalability: "1S" },
  { sku: "6736P", family: "Xeon 6700", codename: "Granite Rapids", coreType: "P-core", cores: 36, maxTurboGHz: 4.1, baseGHz: 2.0, cacheMB: 144, tdpW: 205, costUsd: 2400, chips: 2, specInt2017: 735, maxScalability: "2S" },
  { sku: "6737P", family: "Xeon 6700", codename: "Granite Rapids", coreType: "P-core", cores: 32, maxTurboGHz: 4.0, baseGHz: 2.9, cacheMB: 144, tdpW: 270, costUsd: 2750, chips: 2, specInt2017: 749, maxScalability: "2S" },
  { sku: "6738P", family: "Xeon 6700", codename: "Granite Rapids", coreType: "P-core", cores: 32, maxTurboGHz: 4.2, baseGHz: 2.9, cacheMB: 144, tdpW: 270, costUsd: 3500, chips: 4, specInt2017: 1460, maxScalability: "4S" },
  { sku: "6740E", family: "Xeon 6700", codename: "Sierra Forest", coreType: "E-core", cores: 96, maxTurboGHz: 3.2, baseGHz: 2.4, cacheMB: 96, tdpW: 250, costUsd: 1331, chips: 2, specInt2017: 979, maxScalability: "2S" },
  { sku: "6740P", family: "Xeon 6700", codename: "Granite Rapids", coreType: "P-core", cores: 48, maxTurboGHz: 3.8, baseGHz: 2.1, cacheMB: 288, tdpW: 270, costUsd: 2700, chips: 2, specInt2017: 972, maxScalability: "2S" },
  { sku: "6745P", family: "Xeon 6700", codename: "Granite Rapids", coreType: "P-core", cores: 32, maxTurboGHz: 4.3, baseGHz: 3.1, cacheMB: 336, tdpW: 300, costUsd: 3048, chips: 2, specInt2017: 785, maxScalability: "2S" },
  { sku: "6746E", family: "Xeon 6700", codename: "Sierra Forest", coreType: "E-core", cores: 112, maxTurboGHz: 2.7, baseGHz: 2.0, cacheMB: 96, tdpW: 250, costUsd: 1230, chips: 2, specInt2017: 1020, maxScalability: "2S" },
  { sku: "6748P", family: "Xeon 6700", codename: "Granite Rapids", coreType: "P-core", cores: 48, maxTurboGHz: 4.1, baseGHz: 2.5, cacheMB: 192, tdpW: 300, costUsd: 10049, chips: 4, specInt2017: 2010, maxScalability: "4S" },
  { sku: "6756E", family: "Xeon 6700", codename: "Sierra Forest", coreType: "E-core", cores: 128, maxTurboGHz: 2.6, baseGHz: 1.8, cacheMB: 96, tdpW: 225, costUsd: 1747, chips: 2, specInt2017: 1100, maxScalability: "2S" },
  { sku: "6760P", family: "Xeon 6700", codename: "Granite Rapids", coreType: "P-core", cores: 64, maxTurboGHz: 3.8, baseGHz: 2.2, cacheMB: 320, tdpW: 330, costUsd: 3600, chips: 2, specInt2017: 1250, maxScalability: "2S" },
  { sku: "6761P", family: "Xeon 6700", codename: "Granite Rapids", coreType: "P-core", cores: 64, maxTurboGHz: 3.9, baseGHz: 2.5, cacheMB: 336, tdpW: 350, costUsd: 3600, chips: 1, specInt2017: 663, maxScalability: "1S" },
  { sku: "6766E", family: "Xeon 6700", codename: "Sierra Forest", coreType: "E-core", cores: 144, maxTurboGHz: 2.7, baseGHz: 1.9, cacheMB: 108, tdpW: 250, costUsd: 2217, chips: 2, specInt2017: 1240, maxScalability: "2S" },
  { sku: "6767P", family: "Xeon 6700", codename: "Granite Rapids", coreType: "P-core", cores: 64, maxTurboGHz: 3.9, baseGHz: 2.4, cacheMB: 336, tdpW: 350, costUsd: 4450, chips: 2, specInt2017: 1300, maxScalability: "2S" },
  { sku: "6768P", family: "Xeon 6700", codename: "Granite Rapids", coreType: "P-core", cores: 64, maxTurboGHz: 3.9, baseGHz: 2.4, cacheMB: 336, tdpW: 330, costUsd: 12226, chips: 4, specInt2017: 2490, maxScalability: "4S" },
  { sku: "6780E", family: "Xeon 6700", codename: "Sierra Forest", coreType: "E-core", cores: 144, maxTurboGHz: 3.0, baseGHz: 2.2, cacheMB: 108, tdpW: 330, costUsd: 2354, chips: 2, specInt2017: 1350, maxScalability: "2S" },
  { sku: "6781P", family: "Xeon 6700", codename: "Granite Rapids", coreType: "P-core", cores: 80, maxTurboGHz: 3.8, baseGHz: 2.0, cacheMB: 336, tdpW: 350, costUsd: 4000, chips: 1, specInt2017: 745, maxScalability: "1S" },
  { sku: "6787P", family: "Xeon 6700", codename: "Granite Rapids", coreType: "P-core", cores: 86, maxTurboGHz: 3.8, baseGHz: 2.0, cacheMB: 336, tdpW: 350, costUsd: 4300, chips: 2, specInt2017: 1540, maxScalability: "2S" },
  { sku: "6788P", family: "Xeon 6700", codename: "Granite Rapids", coreType: "P-core", cores: 86, maxTurboGHz: 3.8, baseGHz: 2.0, cacheMB: 336, tdpW: 350, costUsd: 14520, chips: 4, specInt2017: 2910, maxScalability: "4S" }
];

const workloads = [
  { value: "tower", label: "Tower" },
  { value: "hpc", label: "HPC" },
  { value: "cae", label: "CAE" },
  { value: "modeling and simulation", label: "Modeling and Simulation" },
  { value: "web-microservices", label: "Web & Microservices" },
  { value: "cloud-native", label: "Cloud-Native" },
  { value: "consumer digital services", label: "Consumer Digital Services" },
  { value: "application dev ops", label: "Application Dev Ops" },
  { value: "database-analytics", label: "Database & Analytics" },
  { value: "ai", label: "AI" },
  { value: "infrastructure-storage", label: "Infrastructure & Storage" },
  { value: "networking", label: "Networking" },
  { value: "edge", label: "Edge" }
];

const servers = [
  { value: "any", label: "Any server", formFactor: "Mixed", sockets: 0, maxRamTb: 16, memoryType: "DDR5 6400", pCore: true, eCore: true },
  { value: "sr630-v4", label: "ThinkSystem SR630 V4", formFactor: "1U", sockets: 2, maxRamTb: 8, memoryType: "DDR5 6400", pCore: true, eCore: true },
  { value: "sr650-v4", label: "ThinkSystem SR650 V4", formFactor: "2U", sockets: 2, maxRamTb: 8, memoryType: "DDR5 6400", pCore: true, eCore: false },
  { value: "sr680a-v4", label: "ThinkSystem SR680a V4", formFactor: "8U", sockets: 2, maxRamTb: 4, memoryType: "DDR5 6400", pCore: true, eCore: false },
  { value: "sr850-v4", label: "ThinkSystem SR850 V4", formFactor: "2U", sockets: 4, maxRamTb: 16, memoryType: "DDR5 6400", pCore: true, eCore: false },
  { value: "sr860-v4", label: "ThinkSystem SR860 V4", formFactor: "2U", sockets: 4, maxRamTb: 16, memoryType: "DDR5 6400", pCore: true, eCore: false },
  { value: "st50-v3", label: "ThinkSystem ST50 V3", formFactor: "Tower", sockets: 1, maxRamTb: 0.125, memoryType: "DDR4", pCore: true, eCore: false }
];

const fourSocketSupportedSkus = ["6714P", "6724P", "6728P", "6738P", "6748P", "6768P", "6788P"];
const fourSocketScoredSkus = ["6728P", "6738P", "6748P", "6768P", "6788P"];
const twoSocketSr680aSupportedSkus = ["6740P", "6747P", "6760P", "6767P", "6776P", "6787P"];
const twoSocketSr680aScoredSkus = ["6740P", "6760P", "6767P", "6787P"];
const twoSocketSr650SupportedSkus = ["6505P", "6507P", "6515P", "6517P", "6520P", "6527P", "6530P", "6714P", "6724P", "6736P", "6737P", "6740P", "6745P", "6747P", "6760P", "6767P", "6787P"];
const twoSocketSr650ScoredSkus = [...twoSocketSr650SupportedSkus];
const sr630SupportedSkus = ["6505P", "6507P", "6511P", "6515P", "6517P", "6520P", "6521P", "6527P", "6530P", "6714P", "6724P", "6730P", "6731P", "6732P", "6736P", "6737P", "6740P", "6741P", "6745P", "6747P", "6760P", "6761P", "6767P", "6781P", "6787P", "6710E", "6731E", "6740E", "6746E", "6756E", "6766E", "6780E"];
const sr630ScoredSkus = ["6505P", "6507P", "6515P", "6517P", "6520P", "6527P", "6530P", "6714P", "6724P", "6736P", "6737P", "6740P", "6745P", "6747P", "6760P", "6767P", "6787P", "6710E", "6740E", "6746E", "6756E", "6766E", "6780E"];

const AI_PROGRAM_CPUS = ["6737P", "6740P", "6747P", "6761P", "6767P", "6774P", "6776P"];

const intelWorkloadFit = {
  tower: { p: 1.0, e: 0.0 },
  hpc: { p: 1.0, e: 0.0 },
  "web-microservices": { p: 0.0, e: 1.0 },
  "database-analytics": { p: 0.8, e: 0.8 },
  ai: { p: 1.0, e: 0.0 },
  "infrastructure-storage": { p: 0.8, e: 0.8 },
  networking: { p: 0.8, e: 0.8 },
  edge: { p: 0.8, e: 0.8 }
};

const defaultForm = {
  workload: "database-analytics",
  priority: "balanced",
  licensing: "normal",
  socketCount: "any",
  coreBand: "any",
  serverType: "any",
  serverModel: "any",
  ramFilter: "any",
  onlyAIProgram: false,
  customerNotes: ""
};

function getMaxSockets(cpu) {
  return parseInt(String(cpu.maxScalability).replace("S", ""), 10);
}

function getSystemMetrics(cpu) {
  const sockets = Math.max(1, getMaxSockets(cpu));
  return {
    sockets,
    totalCores: cpu.cores * sockets,
    totalCostUsd: cpu.costUsd * sockets,
    totalTdpW: cpu.tdpW * sockets,
    totalSpecInt2017: cpu.specInt2017,
    specPerDollar: cpu.specInt2017 / (cpu.costUsd * sockets),
    specPerWatt: cpu.specInt2017 / (cpu.tdpW * sockets)
  };
}

function getServerByValue(value) {
  return servers.find((server) => server.value === value) || servers[0];
}

function isTowerCpu(cpu) {
  return cpu.family === "Xeon 6300" && getMaxSockets(cpu) === 1;
}

function isAIProgramEligible(cpu) {
  return AI_PROGRAM_CPUS.includes(cpu.sku);
}

function cpuCompatibleWithServer(cpu, server) {
  if (!server || server.value === "any") return true;

  const isE = cpu.coreType === "E-core";
  const is6300 = cpu.family === "Xeon 6300";
  const cpuSockets = getMaxSockets(cpu);

  if (server.value === "st50-v3") return is6300 && cpuSockets === 1;
  if (is6300) return false;
  if (isE && !server.eCore) return false;
  if (!isE && !server.pCore) return false;

  if (server.sockets === 4) return fourSocketSupportedSkus.includes(cpu.sku) && fourSocketScoredSkus.includes(cpu.sku);
  if (server.value === "sr680a-v4") return cpuSockets === 2 && twoSocketSr680aSupportedSkus.includes(cpu.sku) && twoSocketSr680aScoredSkus.includes(cpu.sku);
  if (server.value === "sr650-v4") return cpuSockets === 2 && twoSocketSr650SupportedSkus.includes(cpu.sku) && twoSocketSr650ScoredSkus.includes(cpu.sku);
  if (server.value === "sr630-v4") return cpuSockets <= 2 && sr630SupportedSkus.includes(cpu.sku) && sr630ScoredSkus.includes(cpu.sku);

  return cpuSockets === server.sockets;
}

function ramFitsServer(server, ramFilter) {
  if (!server || server.value === "any" || ramFilter === "any") return true;
  if (ramFilter === "up-to-8tb") return server.maxRamTb >= 8;
  if (ramFilter === "up-to-16tb") return server.maxRamTb >= 16;
  return true;
}

function getIntelFitScore(cpu, workload) {
  const fit = intelWorkloadFit[workload] || { p: 0.5, e: 0.5 };
  return cpu.coreType === "E-core" ? fit.e : fit.p;
}

function getIntelFitLabel(cpu, workload) {
  const value = getIntelFitScore(cpu, workload);
  if (value >= 0.8) return "Strong Intel fit";
  if (value >= 0.5) return "Moderate Intel fit";
  return "Low Intel fit";
}

function allowedByFilters(cpu, form) {
  if (cpu.family === "Xeon 6300" && form.workload !== "tower") return false;

  if (form.serverType === "tower" || form.workload === "tower") {
    if (!isTowerCpu(cpu)) return false;
  }

  if (form.serverType === "rack-1u") {
    const selectedServer = getServerByValue(form.serverModel);
    if (selectedServer.value !== "sr630-v4") return false;
    if (cpu.tdpW > 350) return false;
  }

  if (form.serverType === "rack-2u" && cpu.cores < 16) return false;

  if (form.serverType === "tower") {
    const selectedServer = getServerByValue(form.serverModel);
    if (selectedServer.value !== "st50-v3") return false;
  }

  if (form.socketCount !== "any") {
    const wanted = parseInt(form.socketCount.replace("S", ""), 10);
    if (getMaxSockets(cpu) !== wanted) return false;
  }

  if (form.coreBand === "4" && cpu.cores !== 4) return false;
  if (form.coreBand === "6" && cpu.cores !== 6) return false;
  if (form.coreBand === "8" && cpu.cores !== 8) return false;
  if (form.coreBand === "16" && cpu.cores !== 16) return false;
  if (form.coreBand === "24" && cpu.cores !== 24) return false;
  if (form.coreBand === "32" && cpu.cores !== 32) return false;
  if (form.coreBand === "48" && cpu.cores !== 48) return false;
  if (form.coreBand === "64" && cpu.cores !== 64) return false;
  if (form.coreBand === "80plus" && cpu.cores < 80) return false;

  const selectedServer = getServerByValue(form.serverModel);
  if (!cpuCompatibleWithServer(cpu, selectedServer)) return false;
  if (!ramFitsServer(selectedServer, form.ramFilter)) return false;
  if (form.licensing === "sensitive" && cpu.cores > 32) return false;
  if (form.onlyAIProgram && !isAIProgramEligible(cpu)) return false;

  return true;
}

function scoreCpu(cpu, form) {
  const m = getSystemMetrics(cpu);
  const is6300 = cpu.family === "Xeon 6300";
  const isE = cpu.coreType === "E-core";
  const is6700 = cpu.family === "Xeon 6700";
  const intelFit = getIntelFitScore(cpu, form.workload);

  let baseScore = 0;
  baseScore += m.specPerDollar * 30;
  baseScore += m.totalSpecInt2017 * 0.05;
  baseScore += m.specPerWatt * 5;
  baseScore += intelFit * 120;

  let priorityScore = 0;

  if (form.priority === "performance") {
    priorityScore += m.totalSpecInt2017 * 1.5;
    priorityScore += cpu.maxTurboGHz * 40;
    priorityScore += m.totalCores * 3;
    if (is6700) priorityScore += 10;
  }

  if (form.priority === "balanced") {
    priorityScore += m.totalSpecInt2017 * 0.5;
    priorityScore += m.specPerDollar * 60;
    priorityScore += m.specPerWatt * 15;
    if (m.totalCores >= 16 && m.totalCores <= 64) priorityScore += 40;
    if (m.totalCostUsd <= 6000) priorityScore += 25;
  }

  if (form.priority === "efficiency") {
    priorityScore += m.specPerWatt * 120;
    priorityScore += m.totalSpecInt2017 * 0.2;
    priorityScore += (1200 - m.totalTdpW) / 10;
    if (m.totalTdpW <= 450) priorityScore += 40;
    if (m.totalCostUsd <= 5000) priorityScore += 20;
  }

  if (form.licensing === "sensitive") {
    if (cpu.cores > 32) return -999999;
    if (cpu.cores <= 24) priorityScore += 80;
  }

  if (form.workload === "tower") {
    if (!is6300) return -999999;
    priorityScore += cpu.maxTurboGHz * 45;
    priorityScore += m.specPerWatt * 40;
  }

  if (form.workload === "hpc") {
    if (isE) return -999999;
    priorityScore += m.totalSpecInt2017 * 0.8;
    priorityScore += m.totalCores * 4;
  }

  if (form.workload === "web-microservices") {
    if (!isE) return -999999;
    priorityScore += m.totalCores * 8;
    priorityScore += m.specPerWatt * 40;
  }

  if (form.workload === "ai") {
    if (isE) return -999999;
    priorityScore += cpu.maxTurboGHz * 60;
    priorityScore += m.totalSpecInt2017 * 0.35;
  }

  if (form.workload === "database-analytics") {
    priorityScore += m.totalSpecInt2017 * 0.3;
    if (m.totalCores >= 16 && m.totalCores <= 64) priorityScore += 30;
    if (m.totalCostUsd <= 6000) priorityScore += 18;
    if (cpu.maxTurboGHz >= 4.0) priorityScore += 16;
  }

  if (form.workload === "infrastructure-storage") {
    if (getMaxSockets(cpu) >= 2) priorityScore += 22;
    if (m.totalCores >= 24 && m.totalCores <= 64) priorityScore += 28;
    if (m.totalTdpW <= 500) priorityScore += 18;
  }

  if (form.workload === "networking") {
    priorityScore += m.totalCores * 2;
    if (getMaxSockets(cpu) >= 2) priorityScore += 16;
    if (m.totalTdpW <= 650) priorityScore += 14;
  }

  if (form.workload === "edge") {
    if (getMaxSockets(cpu) === 1) priorityScore += 20;
    if (m.totalTdpW <= 500) priorityScore += 20;
    if (m.totalCostUsd <= 5000) priorityScore += 16;
  }

  if (form.workload === "ai" && isAIProgramEligible(cpu)) {
    priorityScore += 25;
  }

  return Math.round(baseScore * 0.3 + priorityScore * 0.7);
}

function scoreValue(cpu) {
  const m = getSystemMetrics(cpu);
  return Math.round(m.specPerDollar * 1000 + (m.totalCores <= 64 ? 40 : 0));
}

function scoreEfficiency(cpu) {
  const m = getSystemMetrics(cpu);
  const familyBoost = cpu.family === "Xeon 6500" ? 35 : cpu.family === "Xeon 6300" ? 20 : 0;
  return Math.round(m.specPerWatt * 100 + (1200 - m.totalTdpW) / 5 + familyBoost);
}

function scorePerformance(cpu) {
  const m = getSystemMetrics(cpu);
  return Math.round(m.totalSpecInt2017 + cpu.maxTurboGHz * 120 + m.totalCores * 4);
}

function buildRecommendationBadges(cpu, form) {
  const badges = [];
  const m = getSystemMetrics(cpu);
  const selectedServer = getServerByValue(form.serverModel);

  badges.push(getIntelFitLabel(cpu, form.workload));
  badges.push(`${getMaxSockets(cpu)}S CPU`);
  if (form.priority === "efficiency" && m.totalTdpW <= 450) badges.push("Efficiency focused");
  if (form.priority === "balanced" && m.totalCores >= 16 && m.totalCores <= 64) badges.push("Balanced sizing");
  if (form.licensing === "sensitive" && cpu.cores <= 32) badges.push("Licensing friendly");
  if ((form.serverType === "tower" || form.workload === "tower") && cpu.family === "Xeon 6300") badges.push("Tower compliant");
  if (selectedServer.value !== "any") badges.push(`${selectedServer.sockets}S server`);
  if (selectedServer.value !== "any") badges.push(selectedServer.label);

  return badges;
}

function fmtMoney(v) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v);
}

function getDealRisk(cpu, form) {
  const m = getSystemMetrics(cpu);
  let level = "Low";
  let reasons = [];

  if (form.licensing === "sensitive" && cpu.cores > 24) {
    level = "Medium";
    reasons.push("Higher per-core licensing exposure");
  }

  if (form.serverType === "rack-1u" && cpu.tdpW >= 330) {
    level = "Medium";
    reasons.push("High thermal density for 1U profile");
  }

  if (form.workload === "edge" && m.totalTdpW > 500) {
    level = "Medium";
    reasons.push("Higher power profile for edge deployment");
  }

  if (form.priority === "efficiency" && m.totalTdpW > 600) {
    level = "High";
    reasons.push("Conflicts with efficiency priority");
  }

  if (form.workload === "database-analytics" && m.totalCostUsd > 10000) {
    if (level === "Low") level = "Medium";
    reasons.push("Premium cost profile");
  }

  if (!reasons.length) {
    reasons.push("Good alignment with selected workload and constraints");
  }

  return { level, reasons };
}

function getWhyThisCpu(cpu, form) {
  const m = getSystemMetrics(cpu);
  const parts = [];

  if (form.priority === "performance") {
    parts.push(`it prioritizes top-end performance with ${cpu.specInt2017} SPECint and ${cpu.maxTurboGHz} GHz turbo`);
  } else if (form.priority === "efficiency") {
    parts.push(`it prioritizes efficiency with ${m.specPerWatt.toFixed(3)} SPEC/W and ${m.totalTdpW} W total TDP`);
  } else {
    parts.push(`it balances performance and value with ${cpu.specInt2017} SPECint and ${m.specPerDollar.toFixed(3)} SPEC/$`);
  }

  if (form.workload === "hpc") parts.push("it aligns with HPC by staying on P-cores and scaling well on compute-heavy workloads");
  if (form.workload === "web-microservices") parts.push("it aligns with web and microservices density requirements");
  if (form.workload === "ai") parts.push("it supports AI-oriented positioning with strong frequency and P-core alignment");
  if (form.workload === "database-analytics") parts.push("it fits database and analytics scenarios with a strong balance of throughput, cost, and usable core count");
  if (form.workload === "infrastructure-storage") parts.push("it fits infrastructure and storage scenarios with solid multi-socket positioning");
  if (form.workload === "networking") parts.push("it remains suitable for networking scenarios with balanced throughput and platform fit");
  if (form.workload === "edge") parts.push("it keeps a deployment-friendly profile for edge scenarios");
  if (form.workload === "tower") parts.push("it is natively aligned to the tower-only Xeon 6300 path");

  if (isAIProgramEligible(cpu)) {
    parts.push("it is also eligible under the AI Host Node Program, strengthening commercial positioning for AI opportunities");
  }

  return `This CPU was selected because ${parts.join(", ")}.`;
}

function Section({ title, children }) {
  return (
    <div style={{ border: "1px solid #e2e8f0", borderRadius: 16, background: "#fff", padding: 20 }}>
      <h2 style={{ margin: "0 0 16px", fontSize: 20 }}>{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ display: "grid", gap: 6 }}>
      <label style={{ fontSize: 14, fontWeight: 600 }}>{label}</label>
      {children}
    </div>
  );
}

function AIHostNodeProgramBadge() {
  return (
    <span
      style={{
        background: "#2563eb",
        color: "white",
        padding: "2px 6px",
        borderRadius: 6,
        fontSize: 11,
        fontWeight: 600,
        marginLeft: 6,
        whiteSpace: "nowrap"
      }}
    >
      AI Host Node Program Available
    </span>
  );
}

export default function XeonDealAssistant() {
  const handleReportBug = () => {
    const subject = encodeURIComponent("Bug Report - Xeon Deal Assistant");
    const body = encodeURIComponent(`Describe the issue:

Steps to reproduce:
1.
2.
3.

Expected behavior:

Actual behavior:

Additional notes:`);
    window.location.href = `mailto:ffuhrer@lenovo.com?subject=${subject}&body=${body}`;
  };

  const handleExportPdf = () => {
    window.print();
  };

  const [showScoreInfo, setShowScoreInfo] = useState(false);
  const [form, setForm] = useState(defaultForm);

  const ranked = useMemo(() => {
    return cpuCatalog
      .filter((cpu) => allowedByFilters(cpu, form))
      .map((cpu) => ({ ...cpu, score: scoreCpu(cpu, form), aiProgram: isAIProgramEligible(cpu) }))
      .filter((cpu) => cpu.score > -999999)
      .sort((a, b) => b.score - a.score);
  }, [form]);

  const top = ranked[0] || null;
  const alternatives = ranked.slice(1, 4);
  const bestValue = ranked.length ? [...ranked].sort((a, b) => scoreValue(b) - scoreValue(a))[0] : null;
  const bestEfficiency = ranked.length ? [...ranked].sort((a, b) => scoreEfficiency(b) - scoreEfficiency(a))[0] : null;
  const bestPerformance = ranked.length ? [...ranked].sort((a, b) => scorePerformance(b) - scorePerformance(a))[0] : null;

  const radarCandidates = useMemo(() => {
    const items = [bestValue, bestEfficiency, bestPerformance].filter(Boolean);
    const unique = [];
    const seen = new Set();
    for (const cpu of items) {
      if (!seen.has(cpu.sku)) {
        seen.add(cpu.sku);
        unique.push(cpu);
      }
    }
    return unique;
  }, [bestValue, bestEfficiency, bestPerformance]);

  const radarData = useMemo(() => {
    if (!radarCandidates.length) return [];

    const candidatesWithMetrics = radarCandidates.map((cpu) => ({
      cpu,
      metrics: {
        Performance: getSystemMetrics(cpu).totalSpecInt2017,
        Efficiency: getSystemMetrics(cpu).specPerWatt,
        Value: getSystemMetrics(cpu).specPerDollar,
        "Core Density": getSystemMetrics(cpu).totalCores,
        "Commercial Fit": form.workload === "ai" && cpu.aiProgram ? 100 : 60
      }
    }));

    const axes = ["Performance", "Efficiency", "Value", "Core Density", "Commercial Fit"];

    return axes.map((axis) => {
      const values = candidatesWithMetrics.map((x) => x.metrics[axis]);
      const min = Math.min(...values);
      const max = Math.max(...values);
      const point = { metric: axis };

      for (const entry of candidatesWithMetrics) {
        const raw = entry.metrics[axis];
        const normalized = max === min ? 70 : 20 + ((raw - min) / (max - min)) * 80;
        point[entry.cpu.sku] = Math.round(normalized);
      }

      return point;
    });
  }, [radarCandidates, form.workload]);
  const topMetrics = top ? getSystemMetrics(top) : null;
  const selectedServer = getServerByValue(form.serverModel);
  const topRisk = top ? getDealRisk(top, form) : null;
  const topWhy = top ? getWhyThisCpu(top, form) : "";

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", padding: 16, fontFamily: "Arial, sans-serif", color: "#0f172a" }}>
      <style>{`
        select, textarea { width: 100%; border: 1px solid #cbd5e1; border-radius: 8px; padding: 7px 9px; background: white; font-size: 12px; }
        textarea { min-height: 54px; resize: vertical; }
        @media print {
          body { background: white !important; }
          button, textarea, select, .print-hide { display: none !important; }
          .dashboard-shell { max-width: none !important; }
          .ranked-table-wrap { max-height: none !important; overflow: visible !important; }
        }
      `}</style>

      <div className="dashboard-shell" style={{ maxWidth: 1800, margin: "0 auto", display: "grid", gap: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, border: "1px solid #e2e8f0", borderRadius: 16, background: "#fff", padding: "12px 16px" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 24 }}>Intel Xeon 6 Deal Assistant</h1>
            <p style={{ margin: "4px 0 0", color: "#475569", fontSize: 13 }}>Horizontal dashboard view with filters, recommendation, KPIs, alternatives, chart, and ranked list in one screen.</p>
          </div>
          <div className="print-hide" style={{ display: "flex", gap: 8 }}>
            <button onClick={handleExportPdf} style={{ padding: "8px 12px", borderRadius: 10, border: "1px solid #cbd5e1", background: "#0f172a", color: "white", cursor: "pointer", fontWeight: 600 }}>Export PDF</button>
            <button onClick={handleReportBug} style={{ padding: "8px 12px", borderRadius: 10, border: "1px solid #cbd5e1", background: "#ef4444", color: "white", cursor: "pointer", fontWeight: 600 }}>Report Bug</button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "300px minmax(520px, 1.15fr) minmax(520px, 1fr)", gap: 12, alignItems: "stretch" }}>
          <div style={{ border: "1px solid #e2e8f0", borderRadius: 16, background: "#fff", padding: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <h2 style={{ margin: 0, fontSize: 16 }}>Inputs</h2>
              <button onClick={() => setForm(defaultForm)} className="print-hide" style={{ background: "#ef4444", color: "white", border: "none", padding: "6px 10px", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 12 }}>Reset</button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <Field label="Workload">
                <select
                  value={form.workload}
                  onChange={(e) => {
                    const nextWorkload = e.target.value;
                    let nextServerType = form.serverType;
                    let nextServerModel = form.serverModel;
                    let nextCoreBand = form.coreBand;

                    if (nextWorkload === "tower") {
                      nextServerType = "tower";
                      nextServerModel = "st50-v3";
                      if (!["any", "4", "6", "8"].includes(nextCoreBand)) nextCoreBand = "any";
                    }
                    if (nextWorkload !== "tower" && ["4", "6"].includes(nextCoreBand)) nextCoreBand = "any";

                    setForm({ ...form, workload: nextWorkload, serverType: nextServerType, serverModel: nextServerModel, coreBand: nextCoreBand });
                  }}
                >
                  {workloads.map((w) => <option key={w.value} value={w.value}>{w.label}</option>)}
                </select>
              </Field>

              <Field label="Priority">
                <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                  <option value="performance">Performance</option>
                  <option value="balanced">Balanced</option>
                  <option value="efficiency">Efficiency</option>
                </select>
              </Field>

              <Field label="Sockets">
                <select value={form.socketCount} onChange={(e) => setForm({ ...form, socketCount: e.target.value })}>
                  <option value="any">Any</option>
                  <option value="1S">1S</option>
                  <option value="2S">2S</option>
                  <option value="4S">4S</option>
                </select>
              </Field>

              <Field label="Cores">
                <select
                  value={form.coreBand}
                  onChange={(e) => {
                    const nextCoreBand = e.target.value;
                    let nextWorkload = form.workload;
                    let nextServerType = form.serverType;
                    let nextServerModel = form.serverModel;
                    let nextLicensing = form.licensing;

                    if (["4", "6"].includes(nextCoreBand)) {
                      nextWorkload = "tower";
                      nextServerType = "tower";
                      nextServerModel = "st50-v3";
                    }
                    if (nextLicensing === "sensitive" && ["48", "64", "80plus"].includes(nextCoreBand)) nextLicensing = "normal";

                    setForm({ ...form, coreBand: nextCoreBand, workload: nextWorkload, serverType: nextServerType, serverModel: nextServerModel, licensing: nextLicensing });
                  }}
                >
                  <option value="any">Any</option>
                  <option value="4">4 cores</option>
                  <option value="6">6 cores</option>
                  <option value="8">8 cores</option>
                  <option value="16">16 cores</option>
                  <option value="24">24 cores</option>
                  <option value="32">32 cores</option>
                  <option value="48">48 cores</option>
                  <option value="64">64 cores</option>
                  <option value="80plus">80+ cores</option>
                </select>
              </Field>

              <Field label="Server Type">
                <select
                  value={form.serverType}
                  onChange={(e) => {
                    const nextType = e.target.value;
                    let nextServerModel = form.serverModel;
                    let nextWorkload = form.workload;
                    let nextCoreBand = form.coreBand;

                    if (nextType === "tower") {
                      nextServerModel = "st50-v3";
                      nextWorkload = "tower";
                      if (!["any", "4", "6", "8"].includes(nextCoreBand)) nextCoreBand = "any";
                    }
                    if (nextType === "rack-1u") nextServerModel = "sr630-v4";
                    if (nextType !== "tower" && ["4", "6"].includes(nextCoreBand)) nextCoreBand = "any";

                    setForm({ ...form, serverType: nextType, serverModel: nextServerModel, workload: nextWorkload, coreBand: nextCoreBand });
                  }}
                >
                  <option value="any">Any</option>
                  <option value="rack-1u">Rack 1U</option>
                  <option value="rack-2u">Rack 2U</option>
                  <option value="tower">Tower</option>
                </select>
              </Field>

              <Field label="Server Model">
                <select
                  value={form.serverModel}
                  onChange={(e) => {
                    const nextServerModel = e.target.value;
                    let nextServerType = form.serverType;
                    let nextWorkload = form.workload;
                    let nextCoreBand = form.coreBand;

                    if (nextServerModel === "st50-v3") {
                      nextServerType = "tower";
                      nextWorkload = "tower";
                      if (!["any", "4", "6", "8"].includes(nextCoreBand)) nextCoreBand = "any";
                    }
                    if (nextServerModel === "sr630-v4") nextServerType = "rack-1u";
                    if (nextServerModel !== "st50-v3" && ["4", "6"].includes(nextCoreBand)) nextCoreBand = "any";

                    setForm({ ...form, serverModel: nextServerModel, serverType: nextServerType, workload: nextWorkload, coreBand: nextCoreBand });
                  }}
                >
                  {servers.filter((server) => {
                    if (form.workload === "tower") return server.value === "st50-v3";
                    if (form.serverType === "tower") return server.value === "st50-v3";
                    if (form.serverType === "rack-1u") return server.value === "sr630-v4";
                    return true;
                  }).map((server) => <option key={server.value} value={server.value}>{server.label}</option>)}
                </select>
              </Field>

              <Field label="RAM">
                <select value={form.ramFilter} onChange={(e) => setForm({ ...form, ramFilter: e.target.value })}>
                  <option value="any">Any</option>
                  <option value="up-to-8tb">Up to 8TB</option>
                  <option value="up-to-16tb">Up to 16TB</option>
                </select>
              </Field>

              <Field label="Licensing">
                <select
                  value={form.licensing}
                  onChange={(e) => {
                    const nextLicensing = e.target.value;
                    let nextCoreBand = form.coreBand;
                    if (nextLicensing === "sensitive" && !["any", "4", "6", "8", "16", "24", "32"].includes(nextCoreBand)) nextCoreBand = "any";
                    setForm({ ...form, licensing: nextLicensing, coreBand: nextCoreBand });
                  }}
                >
                  <option value="normal">Normal</option>
                  <option value="sensitive">Per-core sensitive</option>
                </select>
              </Field>

              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
                  <input
                    type="checkbox"
                    checked={form.onlyAIProgram}
                    onChange={(e) => setForm({ ...form, onlyAIProgram: e.target.checked })}
                  />
                  Only discount-program eligible CPUs
                </label>
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <Field label="Customer Notes">
                  <textarea value={form.customerNotes} onChange={(e) => setForm({ ...form, customerNotes: e.target.value })} placeholder="Optional notes" />
                </Field>
              </div>
            </div>
          </div>

          <div style={{ border: "1px solid #e2e8f0", borderRadius: 16, background: "#fff", padding: 14, display: "grid", gap: 12 }}>
            <h2 style={{ margin: 0, fontSize: 16 }}>Primary Recommendation</h2>
            {!top ? (
              <div style={{ padding: 16, border: "1px dashed #cbd5e1", borderRadius: 12 }}>No valid CPU found for the current filters.</div>
            ) : (
              <>
                <div style={{ background: "#0f172a", color: "white", borderRadius: 16, padding: 16 }}>
                  <div style={{ fontSize: 12, opacity: 0.8 }}>Recommended CPU</div>
                  <div style={{ fontSize: 30, fontWeight: 800, marginTop: 2 }}>
                    Xeon {top.sku}
                    {top.aiProgram && form.workload === "ai" && <AIHostNodeProgramBadge />}
                  </div>
                  <div style={{ marginTop: 6, fontSize: 13, opacity: 0.9 }}>{top.family} • {top.codename} • {top.coreType} • {top.maxScalability}</div>
                  <div style={{ marginTop: 4, fontSize: 12, opacity: 0.9 }}>Server: {selectedServer.value === "any" ? "Any compatible server" : selectedServer.label} • {selectedServer.formFactor} • {selectedServer.memoryType}</div>
                  <div style={{ marginTop: 8, fontSize: 13, color: topRisk?.level === "High" ? "#fca5a5" : topRisk?.level === "Medium" ? "#fde68a" : "#bbf7d0" }}>Deal Risk: {topRisk?.level}</div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                  {[
                    ["Score", top.score],
                    ["Total cores", topMetrics.totalCores],
                    ["SPECint", top.specInt2017],
                    ["Turbo", `${top.maxTurboGHz} GHz`],
                    ["Total cost", fmtMoney(topMetrics.totalCostUsd)],
                    ["Total TDP", `${topMetrics.totalTdpW} W`],
                    ["SPEC/$", topMetrics.specPerDollar.toFixed(3)],
                    ["SPEC/W", topMetrics.specPerWatt.toFixed(3)]
                  ].map(([label, value]) => (
                    <div key={label} style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: 10, background: "#f8fafc" }}>
                      <div style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.4 }}>{label}</div>
                      <div style={{ fontSize: 16, fontWeight: 700, marginTop: 3 }}>{value}</div>
                    </div>
                  ))}
                </div>

                <div style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: 12, background: "#f8fafc", fontSize: 13, lineHeight: 1.45 }}>
                  <strong>Why this CPU?</strong>
                  <div style={{ marginTop: 4 }}>{topWhy}</div>
                  <div style={{ marginTop: 6, fontSize: 12, color: "#475569" }}>{topRisk?.reasons.join(" • ")}</div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                  {alternatives.map((cpu) => (
                    <div key={cpu.sku} style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: 10 }}>
                      <div style={{ fontSize: 11, color: "#64748b" }}>Alternative</div>
                      <div style={{ fontWeight: 800 }}>Xeon {cpu.sku}</div>
                      <div style={{ fontSize: 12, color: "#475569" }}>{cpu.family} • {cpu.maxScalability}</div>
                      <div style={{ fontSize: 12, marginTop: 5 }}>Score: <strong>{cpu.score}</strong></div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <div style={{ display: "grid", gridTemplateRows: "auto auto 1fr", gap: 12 }}>
            <div style={{ border: "1px solid #e2e8f0", borderRadius: 16, background: "#fff", padding: 14 }}>
              <h2 style={{ margin: "0 0 10px", fontSize: 16 }}>Recommendation Buckets</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                {[
                  { title: "Best Value", cpu: bestValue, metric: bestValue ? `${getSystemMetrics(bestValue).specPerDollar.toFixed(3)} SPEC/$` : "—" },
                  { title: "Best Efficiency", cpu: bestEfficiency, metric: bestEfficiency ? `${getSystemMetrics(bestEfficiency).specPerWatt.toFixed(2)} SPEC/W` : "—" },
                  { title: "Best Performance", cpu: bestPerformance, metric: bestPerformance ? `${bestPerformance.specInt2017} SPECint` : "—" }
                ].map((item) => (
                  <div key={item.title} style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: 10, background: "#f8fafc" }}>
                    <div style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.4 }}>{item.title}</div>
                    {item.cpu ? (
                      <>
                        <div style={{ fontSize: 18, fontWeight: 800, marginTop: 4 }}>Xeon {item.cpu.sku}</div>
                        <div style={{ fontSize: 12, color: "#475569" }}>{item.cpu.family} • {item.cpu.maxScalability}</div>
                        <div style={{ fontSize: 12, marginTop: 6 }}><strong>{item.metric}</strong></div>
                        <div style={{ fontSize: 12 }}>{fmtMoney(getSystemMetrics(item.cpu).totalCostUsd)} • {getSystemMetrics(item.cpu).totalTdpW} W</div>
                      </>
                    ) : (
                      <div style={{ marginTop: 8, color: "#64748b" }}>No option</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {radarCandidates.length >= 2 && (
              <div style={{ border: "1px solid #e2e8f0", borderRadius: 16, background: "#fff", padding: 14 }}>
                <h2 style={{ margin: "0 0 6px", fontSize: 16 }}>3-Way CPU Comparison</h2>
                <div style={{ width: "100%", height: 260 }}>
                  <ResponsiveContainer>
                    <RadarChart data={radarData} outerRadius="70%">
                      <PolarGrid />
                      <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11 }} />
                      <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                      {radarCandidates[0] && <Radar name={radarCandidates[0].sku} dataKey={radarCandidates[0].sku} stroke="#2563eb" fill="#2563eb" fillOpacity={0.2} />}
                      {radarCandidates[1] && <Radar name={radarCandidates[1].sku} dataKey={radarCandidates[1].sku} stroke="#16a34a" fill="#16a34a" fillOpacity={0.2} />}
                      {radarCandidates[2] && <Radar name={radarCandidates[2].sku} dataKey={radarCandidates[2].sku} stroke="#ea580c" fill="#ea580c" fillOpacity={0.2} />}
                      <Tooltip />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            <div style={{ border: "1px solid #e2e8f0", borderRadius: 16, background: "#fff", padding: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <h2 style={{ margin: 0, fontSize: 16 }}>Scoring Logic</h2>
                <button onClick={() => setShowScoreInfo(!showScoreInfo)} className="print-hide" style={{ padding: "5px 10px", borderRadius: 8, border: "1px solid #cbd5e1", background: "#f1f5f9", cursor: "pointer", fontSize: 12 }}>{showScoreInfo ? "Hide" : "Show"}</button>
              </div>
              <div style={{ fontSize: 12, color: "#475569", lineHeight: 1.45 }}>
                {showScoreInfo ? (
                  <ul style={{ margin: 0, paddingLeft: 18 }}>
                    <li>System-level normalization: cores, cost, TDP, SPEC/$, and SPEC/W.</li>
                    <li>Priority changes the weight between performance, value, and efficiency.</li>
                    <li>Workload fit blocks or penalizes poor-fit CPU/core-type combinations.</li>
                    <li>Server model validates socket topology, RAM ceiling, and supported CPU list.</li>
                  </ul>
                ) : (
                  <span>Weighted deal-fit score using system metrics, workload fit, server compatibility, licensing sensitivity, and program eligibility.</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div style={{ border: "1px solid #e2e8f0", borderRadius: 16, background: "#fff", padding: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <h2 style={{ margin: 0, fontSize: 16 }}>Full Ranked List</h2>
            <div style={{ fontSize: 12, color: "#64748b" }}>{ranked.length} matching CPUs</div>
          </div>
          <div className="ranked-table-wrap" style={{ overflow: "auto", maxHeight: 300 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead style={{ position: "sticky", top: 0, zIndex: 1 }}>
                <tr style={{ background: "#e2e8f0" }}>
                  <th style={{ textAlign: "left", padding: 8 }}>#</th>
                  <th style={{ textAlign: "left", padding: 8 }}>SKU</th>
                  <th style={{ textAlign: "left", padding: 8 }}>Family</th>
                  <th style={{ textAlign: "left", padding: 8 }}>Codename</th>
                  <th style={{ textAlign: "left", padding: 8 }}>Cores/socket</th>
                  <th style={{ textAlign: "left", padding: 8 }}>Total cores</th>
                  <th style={{ textAlign: "left", padding: 8 }}>Turbo</th>
                  <th style={{ textAlign: "left", padding: 8 }}>Total TDP</th>
                  <th style={{ textAlign: "left", padding: 8 }}>Total Cost</th>
                  <th style={{ textAlign: "left", padding: 8 }}>SPECint</th>
                  <th style={{ textAlign: "left", padding: 8 }}>SPEC/$</th>
                  <th style={{ textAlign: "left", padding: 8 }}>SPEC/W</th>
                  <th style={{ textAlign: "left", padding: 8 }}>Sockets</th>
                  <th style={{ textAlign: "left", padding: 8 }}>Score</th>
                </tr>
              </thead>
              <tbody>
                {ranked.map((cpu, idx) => (
                  <tr key={cpu.sku} style={{ borderTop: "1px solid #e2e8f0" }}>
                    <td style={{ padding: 8 }}>{idx + 1}</td>
                    <td style={{ padding: 8, fontWeight: 700 }}>Xeon {cpu.sku}{cpu.aiProgram && form.workload === "ai" && <AIHostNodeProgramBadge />}</td>
                    <td style={{ padding: 8 }}>{cpu.family}</td>
                    <td style={{ padding: 8 }}>{cpu.codename}</td>
                    <td style={{ padding: 8 }}>{cpu.cores}</td>
                    <td style={{ padding: 8 }}>{getSystemMetrics(cpu).totalCores}</td>
                    <td style={{ padding: 8 }}>{cpu.maxTurboGHz} GHz</td>
                    <td style={{ padding: 8 }}>{getSystemMetrics(cpu).totalTdpW} W</td>
                    <td style={{ padding: 8 }}>{fmtMoney(getSystemMetrics(cpu).totalCostUsd)}</td>
                    <td style={{ padding: 8 }}>{cpu.specInt2017}</td>
                    <td style={{ padding: 8 }}>{getSystemMetrics(cpu).specPerDollar.toFixed(3)}</td>
                    <td style={{ padding: 8 }}>{getSystemMetrics(cpu).specPerWatt.toFixed(3)}</td>
                    <td style={{ padding: 8 }}>{cpu.maxScalability}</td>
                    <td style={{ padding: 8 }}>{cpu.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
