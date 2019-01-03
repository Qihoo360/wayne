import { Component, OnInit, Input } from '@angular/core';

interface Summary {
  Total: number;
  Used: number;
}

interface NodeSummary {
  Total: number;
  Ready: number;
  Schedulable: number;
}

@Component({
  selector: 'node-resource',
  templateUrl: './node-resource.component.html',
  styleUrls: ['./node-resource.component.scss']
})
export class NodeResourceComponent implements OnInit {
  @Input('data')
  set data(value: any) {
    if (value !== undefined) {
      this.setCpu(value.cpuSummary);
      this.setMemory(value.memorySummary);
      this.setNode(value.nodeSummary);
    }
  }
  cpu = {
    title: 'CPU 使用概况',
    name: '使用量',
    max: 0,
    data: []
  };
  memory = {
    title: 'Memory 使用概况',
    name: '使用量',
    max: 0,
    data: []
  };
  node = {
    total: 0,
    ready: 0,
    schedulable: 0
  };
  setCpu(cpuSummary: Summary) {
    this.cpu.max = cpuSummary.Total;
    this.cpu.data = [cpuSummary.Used];
  }
  setMemory(memorySummary: Summary) {
    this.memory.max = memorySummary.Total;
    this.memory.data = [memorySummary.Used];
  }
  setNode(nodeSummary: NodeSummary) {
    this.node.total = nodeSummary.Total;
    this.node.ready = nodeSummary.Ready;
    this.node.schedulable = nodeSummary.Schedulable;
  }
  constructor() { }

  ngOnInit() {
  }
}
