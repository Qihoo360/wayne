export const defaultIngress = `{
  "apiVersion": "extensions/v1beta1",
  "kind": "Ingress",
  "metadata": {
    "name": ""
  },
  "spec": {
    "tls": [
         {
             "hosts": [
                 ""
                     ],
             "secretName": ""
         }
    ],
    "rules": [
      {
        "host": "",
        "http": {
            "paths": [
                {
                     "backend": {
                          "serviceName": "",
                          "servicePort": 80
                     },
                     "path": "/"
                }
            ]
        }
      }
    ]
  }
}`;
