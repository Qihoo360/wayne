import { Component, Input, OnInit } from '@angular/core';
import { GlobalState } from '../../../../shared/global.state';

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

  showView = GlobalState.node.showResource;
  ready = {
    title: `Node 就绪`,
    name: '使用量',
    tooltip: '',
    data: []
  };
  schedulable = {
    title: 'Node 可调度',
    name: '可调度',
    tooltip: '',
    data: []
  };
  cpu = {
    title: 'CPU 使用',
    name: '使用量',
    tooltip: '',
    data: []
  };
  memory = {
    title: 'Memory 使用',
    name: '使用量',
    tooltip: '',
    data: []
  };

  setCpu(cpuSummary: Summary) {
    this.cpu.title = `CPU 使用 (${cpuSummary.Used}/${cpuSummary.Total}核)`;
    this.cpu.tooltip = `${cpuSummary.Used} / ${cpuSummary.Total} (核)`;
    this.cpu.data = [parseInt((cpuSummary.Used / cpuSummary.Total) * 100 + '', 10)];
  }

  setMemory(memorySummary: Summary) {
    this.memory.title = `内存使用 (${memorySummary.Used}/${memorySummary.Total}G)`;
    this.memory.tooltip = `${memorySummary.Used} / ${memorySummary.Total} (G)`;
    this.memory.data = [parseInt((memorySummary.Used / memorySummary.Total) * 100 + '', 10)];
  }

  setNode(nodeSummary: NodeSummary) {
    this.ready.title = `Node 就绪 (${nodeSummary.Ready}/${nodeSummary.Total})`;
    this.schedulable.title = `Node 可调度 (${nodeSummary.Schedulable}/${nodeSummary.Total})`;
    this.ready.tooltip = `${nodeSummary.Ready} / ${nodeSummary.Total}`;
    this.ready.data = [parseInt((nodeSummary.Ready / nodeSummary.Total) * 100 + '', 10)];
    this.schedulable.tooltip = `${nodeSummary.Schedulable} / ${nodeSummary.Total}`;
    this.schedulable.data = [parseInt((nodeSummary.Schedulable / nodeSummary.Total) * 100 + '', 10)];
  }

  changeShow() {
    this.showView = !this.showView;
    GlobalState.node.showResource = this.showView;
  }

  constructor() {
  }

  ngOnInit() {
  }
}
