import { Component } from '@angular/core';
import { Resources, defaultResources } from './resource-limit';

@Component({
  selector: 'resource-limit',
  templateUrl: './resource-limit.component.html',
  styleUrls: ['./resource-limit.component.scss']
})
export class ResourceLimitComponent {

  resources = new Resources();

  getValue(): Resources {
    return this.resolveValue(this.resources);
  }

  setValue(value?: any): void {
    this.resources = this.resolveValueBack(value);
  }

  resolveValue(value: Resources): Resources {
    const val = { ...value };
    let poststr = '';
    Object.keys(defaultResources).forEach(key => {
      if (key === 'cpuLimit' || key === 'memoryLimit' || key === 'replicaLimit') {
        poststr = '';
      } else {
        poststr = '%';
      }
      val[key] = val[key] ? `${val[key]}${poststr}` : `${defaultResources[key]}${poststr}`;
    });
    return val;
  }

  resolveValueBack(value: any): Resources {
    let val;
    if (value) {
      val = { ...value };
      Object.keys(defaultResources).forEach(key => {
        val[key] = val[key] ? parseInt(val[key], 10) : defaultResources[key];
      });
    } else {
      val = { ...defaultResources };
    }
    return val;
  }

}
