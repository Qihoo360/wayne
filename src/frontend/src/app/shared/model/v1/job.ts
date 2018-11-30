import { KubeJob } from './kubernetes/job';

export class Job {
  kubeJob: KubeJob;
  cluster: string;
}
