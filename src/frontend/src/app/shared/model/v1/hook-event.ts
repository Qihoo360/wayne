export class HookEvent {
  key: string;
  name: string;
  description: string;

  constructor(data: Object) {
    this.key = data['key'];
    this.name = data['name'];
    this.description = data['description'];
  }
}

