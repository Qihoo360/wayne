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
        ],
        "secretName": ""
      }
    ],
    "rules": [
      {
        "host": ""
      }
    ],
    "backend": {
      "serviceName":"",
      "servicePort": 80
    }
  }
}`;
