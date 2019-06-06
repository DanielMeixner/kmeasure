# What is kmeasure
This is a container which is supposed to run on a k8s cluster and measures resource consumption of pods. This might help to figure out useful values for resource quotas.

# Usage
Check the sample.yaml.
Provide the name of the pod to measure & the namespace.
Set the time (in seconds) for how long to measure (e.g. 60 for 60 seconds).
Set the interval time in milliseconds (e.g. 5000).

Run the pod in your cluster. It will query the K8s metric server api to get these values so the perf of the measured pod is not affected.

# where the heck is this container?
You can find a built container image on docker hub danielmeixner/kmeasure

