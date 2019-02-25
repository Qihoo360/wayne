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

}
