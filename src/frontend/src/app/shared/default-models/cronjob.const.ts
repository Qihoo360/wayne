export const defaultCronJob = `{
  "metadata": {
    "name": "",
    "labels": {}
  },
  "spec": {
    "jobTemplate": {
      "metadata": {
        "labels": {
        }
      },
      "spec": {
        "template": {
          "metadata": {
            "labels": {
            }
          },
          "spec": {
            "restartPolicy":"Never",
            "containers": []
          }
        }
      }
    },
    "concurrencyPolicy": "Allow",
    "schedule": "*/1 * * * *"
  }
}`;
