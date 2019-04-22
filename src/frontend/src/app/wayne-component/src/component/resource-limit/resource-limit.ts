export const defaultResources: Resources = {
  cpuLimit: 12,
  cpuRequestLimitPercent: 50,
  memoryLimit: 64,
  memoryRequestLimitPercent: 100,
  replicaLimit: 32,
};

export class Resources {
  cpuLimit: number;
  cpuRequestLimitPercent: number;
  memoryLimit: number;
  memoryRequestLimitPercent: number;
  replicaLimit: number;

  constructor() {
    Object.keys(defaultResources).forEach(item => {
      this[item] = defaultResources[item];
    });
  }
}
