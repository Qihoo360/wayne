// 判断某对象为空..返回true 否则 false
import { configKeyApiNameGenerateRule, defaultApiNameGenerateRule } from './shared.const';

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
 * @param item
 * @returns  boolean
 */
export function isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

/**
 * Deep merge two objects.
 * refer to https://stackoverflow.com/questions/27936772/how-to-deep-merge-instead-of-shallow-merge
 * @param target
 * @param ...sources
 */
export function mergeDeep(target, ...sources) {
  if (!sources.length) {
    return target;
  }
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (let key in source) {
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

