export class Time {
  Time: Date;

  constructor(init?: Time) {
    if (!init) { return; }
    if (init.Time) { this.Time = new Date(init.Time as any); }
  }


  static emptyObject(): Time {
    const result = new Time();
    result.Time = null;
    return result;
  }

}
export class ObjectMeta {
  name: string;
  namespace: string;
  labels?: { [key: string]: string };
  annotations?: { [key: string]: string };
  creationTimestamp: Time;

}

export class NamespaceList {
  objectMeta: ObjectMeta;
  status: string;
}
