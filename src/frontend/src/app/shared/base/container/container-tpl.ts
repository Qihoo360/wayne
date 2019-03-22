// Portal Deployment StatefulSet DaemonSet CronJob Base tpl Class

export const templateDom = [
  {
    id: '创建模版',
    child: [
      {
        id: '发布信息',
      },
      {
        id: '更新策略'
      }
    ]
  }
];

export const containerDom = {
  id: '容器配置',
  child: [
    {
      id: '镜像配置'
    },
    {
      id: '环境变量配置'
    },
    {
      id: '就绪探针'
    },
    {
      id: '存活探针'
    },
    {
      id: '生命周期'
    }
  ]
};

export const CronjobTemplateDom = [
  {
    id: '创建计划任务模版',
    child: [
      {
        id: '发布信息',
      },
      {
        id: '计划任务配置'
      }
    ]
  }
];

export const CronjobContainerDom = {
  id: '容器配置',
  child: [
    {
      id: '镜像配置'
    },
    {
      id: '环境变量配置'
    }
  ]
};

export class ContainerTpl {
  kubeResource: any = {};
  naviList: string;

  constructor(
    private template: any,
    private container: any
  ) {
    this.naviList = JSON.stringify(template);
  }
  // navgation
  get containersLength(): number {
    try {
      return this.kubeResource.spec.template.spec.containers.length;
    } catch (error) {
      return 0;
    }
  }

  get containers(): any {
    try {
      return this.kubeResource.spec.template.spec.containers;
    } catch (error) {
      return [];
    }
  }

  containerNameChange() {
    this.initNavList();
  }

  setContainDom(i) {
    const dom = JSON.parse(JSON.stringify(this.container));
    if (dom.id === '容器配置') {
      dom.text = this.containers[i].name ? this.containers[i].name : '容器配置';
    }
    dom.id += i ? i : '';
    dom.child.forEach(item => {
      item.text = item.id;
      item.id += i ? i : '';
    });
    return dom;
  }

  initNavList() {
    this.naviList = null;
    const naviList = JSON.parse(JSON.stringify(templateDom));
    for (let key = 0; key < this.containersLength; key++) {
      naviList[0].child.push(this.setContainDom(key));
    }
    this.naviList = JSON.stringify(naviList);
  }

  onAddContainerCommand(index: number) {
    if (!this.kubeResource.spec.template.spec.containers[index].command) {
      this.kubeResource.spec.template.spec.containers[index].command = [];
    }
    this.kubeResource.spec.template.spec.containers[index].command.push('');
  }

  onAddContainerArgs(index: number) {
    if (!this.kubeResource.spec.template.spec.containers[index].args) {
      this.kubeResource.spec.template.spec.containers[index].args = [];
    }
    this.kubeResource.spec.template.spec.containers[index].args.push('');
  }

  onDeleteContainerCommand(i: number, j: number) {
    this.kubeResource.spec.template.spec.containers[i].command.splice(j, 1);
  }

  onDeleteContainerArg(i: number, j: number) {
    this.kubeResource.spec.template.spec.containers[i].args.splice(j, 1);
  }

}
