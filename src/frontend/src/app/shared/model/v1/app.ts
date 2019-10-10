import { Namespace } from './namespace';

export class App {
  id: number;
  name: string;
  namespace: Namespace;
  metaData: string;
  metaDataObj: {};
  description: string;
  user: string;
  deleted: boolean;
  createTime: Date;
  namespaceId?: number;

  constructor() {
    this.namespace = new Namespace();
  }

  static emptyObject(): App {
    const result = new App();
    result.namespace = Namespace.emptyObject();
    result.createTime = null;
    return result;
  }
}
