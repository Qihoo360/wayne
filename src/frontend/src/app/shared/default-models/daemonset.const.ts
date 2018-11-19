export const defaultDaemonSet = `{
    "apiVersion": "extensions/v1beta1",
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
