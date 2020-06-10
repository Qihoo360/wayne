export const defaultDaemonSet = `{
    "apiVersion": "apps/v1",
    "kind": "DaemonSet",
    "metadata": {
        "labels": {}
    },
    "spec": {
        "selector": {
            "matchLabels": {}
        },
        "template": {
            "metadata": {
                "labels": {}
            },
            "spec": {
                "containers": []
            }
        },
        "updateStrategy": {
            "type": "OnDelete"
        }
    }
}`;
