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
        "activeDeadlineSeconds": 30,
        "parallelism": 1,
        "completions": 1,
        "backoffLimit": 6,
        "template": {
          "metadata": {
            "labels": {
            }
          },
          "spec": {
            "restartPolicy": "Never",
            "containers": []
          }
        }
      }
    },
    "concurrencyPolicy": "Allow",
    "schedule": "*/1 * * * *",
    "successfulJobsHistoryLimit": 3,
    "failedJobsHistoryLimit": 1
  }
}
`;
