// 判断某对象为空..返回true 否则 false
import { configKeyApiNameGenerateRule, defaultApiNameGenerateRule } from './shared.const';
import { KubePod } from './model/v1/kubernetes/kubepod';

export const isEmpty = function (obj: any): boolean {
  if (obj === false) {
    return false;
  }
  if (obj === 0) {
    return false;
  }
  return (obj == null || obj === '');
};
// 判断某对象不为空..返回true 否则 false
export const isNotEmpty = function (obj: any): boolean {
  return !isEmpty(obj);
};

export const isArrayNotEmpty = function (obj: any): boolean {
  return obj != null && obj.length > 0;
};

export const isArrayEmpty = function (obj: any): boolean {
  return !isArrayNotEmpty(obj);
};

/**
 * Simple object check.
 * @returns  boolean
 */
export function isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

/**
 * Deep merge two objects.
 * refer to https://stackoverflow.com/questions/27936772/how-to-deep-merge-instead-of-shallow-merge
 */
export function mergeDeep(target, ...sources) {
  if (!sources.length) {
    return target;
  }
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        if (isObject(source[key])) {
          if (!target[key]) {
            Object.assign(target, {[key]: {}});
          }
          mergeDeep(target[key], source[key]);
        } else {
          Object.assign(target, {[key]: source[key]});
        }
      }
    }
  }

  return mergeDeep(target, ...sources);
}


export class ApiNameGenerateRule {
  static config(globalConfig: string, appMetaData: string): string {
    // this.authService.config[configKeyApiNameGenerateRule]
    let apiNameGenerateRule = globalConfig ?
      globalConfig : defaultApiNameGenerateRule;
    if (appMetaData) {
      const metaData = JSON.parse(appMetaData);
      if (metaData[configKeyApiNameGenerateRule]) {
        apiNameGenerateRule = metaData[configKeyApiNameGenerateRule];
      }
    }

    return apiNameGenerateRule;
  }

  static generateName(config: string, apiName: string, appName: string): string {
    if (config === defaultApiNameGenerateRule) {
      return appName + '-' + apiName;
    }
    return apiName;
  }
}

export class ResourceUnitConvertor {
  static cpuCoreValue(cpu: string): number {
    if (!cpu) {
      return 0;
    }
    if (cpu.toString().indexOf('m') > -1) {
      return parseFloat(cpu) / 1000;
    }
    return parseFloat(cpu);
  }

  static memoryGiValue(memory: string): number {
    if (!memory) {
      return 0;
    }
    if (memory.toString().indexOf('Gi') > -1) {
      return parseFloat(memory);
    }
    if (memory.toString().indexOf('Mi') > -1) {
      return parseFloat(memory) / 1024;
    }
    if (memory.toString().indexOf('Ki') > -1) {
      return parseFloat(memory) / (1024 * 1024);
    }
    if (memory.toString().indexOf('m') > -1) {
      return parseFloat(memory) / (1024 * 1024 * 1024 * 1000);
    }

    return parseFloat(memory);
  }

}

export class KubePodUtil {
  // getPodStatus returns the pod state
  static getPodStatus(pod: KubePod): string {
    // Terminating
    if (pod.metadata.deletionTimestamp) {
      return 'Terminating';
    }

    // not running
    if (pod.status.phase !== 'Running') {
      return pod.status.phase;
    }

    let ready = false;
    let notReadyReason = '';
    for (const c of pod.status.conditions) {
      if (c.type === 'Ready') {
        ready = c.status === 'True';
        notReadyReason = c.reason;
      }
    }

    if (pod.status.reason) {
      return pod.status.reason;
    }

    if (notReadyReason) {
      return notReadyReason;
    }

    if (ready) {
      return 'Running';
    }

    // Unknown?
    return 'Unknown';
  }
}

