import { Component, OnInit, Input } from '@angular/core';
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
  cpu = {
    title: 'CPU 使用概况',
    name: '使用量',
    tooltip: '',
    data: []
  };
  memory = {
    title: 'Memory 使用概况',
    name: '使用量',
    tooltip: '',
    data: []
  };
  ready = {
    title: 'Ready 使用概况',
    name: '使用量',
    tooltip: '',
    data: []
  };
  schedulable = {
    title: 'Node 可调度概况',
    name: '可调度',
    tooltip: '',
    data: []
  };
  setCpu(cpuSummary: Summary) {
    this.cpu.tooltip = `usage/total: ${cpuSummary.Used}/${cpuSummary.Total}`;
    this.cpu.data = [parseInt((cpuSummary.Used / cpuSummary.Total) * 100 + '', 10)];
  }
  setMemory(memorySummary: Summary) {
    this.memory.tooltip = `usage/total: ${memorySummary.Used}/${memorySummary.Total}`;
    this.memory.data = [parseInt((memorySummary.Used / memorySummary.Total) * 100 + '', 10)];
  }
  setNode(nodeSummary: NodeSummary) {
    this.ready.tooltip = `Ready/total: ${nodeSummary.Ready}/${nodeSummary.Total}`;
    this.ready.data = [parseInt((nodeSummary.Ready / nodeSummary.Total) * 100 + '', 10)];
    this.schedulable.tooltip = `可调度/total: ${nodeSummary.Schedulable}/${nodeSummary.Total}`;
    this.schedulable.data = [parseInt((nodeSummary.Schedulable / nodeSummary.Total) * 100 + '', 10)];
  }
  changeShow() {
    this.showView = !this.showView;
    GlobalState.node.showResource = this.showView;
  }
  constructor() { }

  ngOnInit() {
  }
}
