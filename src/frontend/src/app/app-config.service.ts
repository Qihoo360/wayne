import {Injectable} from '@angular/core';
import 'rxjs/add/operator/toPromise';

import {AppConfig} from './app-config';

/**
 * Declare service to handle the bootstrap options
 *
 *
 * @export
 * @class GlobalSearchService
 */
@Injectable()
export class AppConfigService {
  //Store the application configuration
  private configurations: AppConfig = new AppConfig();

  constructor() {
  }

  public getConfig(): AppConfig {
    return this.configurations;
  }

}
