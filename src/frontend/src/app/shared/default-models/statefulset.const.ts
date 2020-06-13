export const defaultStatefulset = `{
    "apiVersion": "apps/v1",
    "kind": "StatefulSet",
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
