export class Cluster {
  id: number;
  name: string;
  master: string;
  metaData: string;
  kubeConfig: string;
  user: string;
  robinUrl: string;
  deleted: boolean;
  status: number;
  description: string;
  createTime: Date;
  checked: boolean;

  constructor(name?: string, checked?: boolean) {
    if (name) {
      this.name = name;
    }
    if (checked) {
      this.checked = checked;
    }
    this.kubeConfig = '{}';
    this.metaData = '{}';
  }
}

export class ClusterMeta {
  constructor(checked?: boolean) {
    this.checked = checked;
    this.value = 0;
  }

  checked: boolean;
  value: number;
}
