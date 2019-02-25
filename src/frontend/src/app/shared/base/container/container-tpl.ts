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

export class ContainerTpl {
  kubeResource: any = {};

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
