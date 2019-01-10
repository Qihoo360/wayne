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
  node = {
    title: 'Node 使用概况',
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
    this.node.data = [
      {
        title: 'Ready',
        data: [
          {
            name: 'Ready',
            value: nodeSummary.Ready
          },
          {
            name: '其他',
            value: nodeSummary.Total - nodeSummary.Ready
          }
        ]
      },
      {
        title: '可调度',
        data: [
          {
            name: '可调度',
            value: nodeSummary.Schedulable
          },
          {
            name: '其他',
            value: nodeSummary.Total - nodeSummary.Schedulable
          }
        ]
      }
    ];
  }
  changeShow() {
    this.showView = !this.showView;
    GlobalState.node.showResource = this.showView;
  }
  constructor() { }

  ngOnInit() {
  }
}
