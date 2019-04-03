// Portal Deployment StatefulSet DaemonSet CronJob Base tpl Class

export const templateDom = [
  {
    id: 'create-template',
    text: 'TEMPLATE.CREATE_TMP',
    child: [
      {
        id: 'release-message',
        text: 'TEMPLATE.RELEASE_MESSAGE'
      },
      {
        id: 'update-strategy',
        text: 'TEMPLATE.UPDATE_STRATEGY'
      }
    ]
  }
];

export const containerDom = {
  id: 'container-config',
  text: 'TEMPLATE.CONTAINER_CONFIG',
  child: [
    {
      id: 'image-config',
      text: 'TEMPLATE.IMAGE_CONFIG'
    },
    {
      id: 'environment-var',
      text: 'TEMPLATE.ENVIRONMENT_VAR'
    },
    {
      id: 'readiness-check',
      text: 'TEMPLATE.READINESS_PROBE'
    },
    {
      id: 'liveness-check',
      text: 'TEMPLATE.LIVENESS_PROBE_CHECK'
    },
    {
      id: 'life-cycle',
      text: 'TEMPLATE.LIFE_CYCLE'
    }
  ]
};

export const CronjobTemplateDom = [
  {
    id: 'create-tmp',
    text: 'CRONJOB.CREATE_TMP',
    child: [
      {
        id: 'release-message',
        text: 'TEMPLATE.RELEASE_MESSAGE'
      },
      {
        id: 'config',
        text: 'CRONJOB.CONFIG'
      }
    ]
  }
];

export const CronjobContainerDom = {
  id: 'container-config',
  text: 'TEMPLATE.CONTAINER_CONFIG',
  child: [
    {
      id: 'image-config',
      text: 'TEMPLATE.IMAGE_CONFIG'
    },
    {
      id: 'environment-var',
      text: 'TEMPLATE.ENVIRONMENT_VAR'
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
    if (dom.id === 'container-config') {
      dom.text = this.containers[i].name ? this.containers[i].name : 'TEMPLATE.CONTAINER_CONFIG';
    }
    dom.id += i ? i : '';
    dom.child.forEach(item => {
      item.text = item.text;
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
