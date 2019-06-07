# What is kmeter?
This is a container which is supposed to run on a k8s cluster and meters resource consumption of pods. This might help to figure out useful values for resource quotas.

# Usage
Check the sample.yaml.
Provide the name of the pod to meter & the namespace.
Set the time (in seconds) for how long to meter (e.g. 60 for 60 seconds).
Set the interval time in milliseconds (e.g. 5000).
Run the job in your cluster. It will query the K8s metric server api to get these values so the perf of the meterd pod is not affected.

```
kubectl apply -f sample.yaml
```

Then check the logs. Replace the podname with your actual podname.
```
kubectl logs kmeter-sb7gv
```
You'll get something like this:
```
{"countprimes":{"averageMemory":13612,"averageCpu":0},"namespace":"default","podName":"compute-svc-sfs-2","averageCpu":0  Normal  Started    34s   kubelet, aks-agentpool-35562525-3  Started container,"averageMemory":13612,"meterTime":62,"meterFinishedTime":1559900366451}  
```

# where the heck is this container?
You can find a built container image on docker hub danielmeixner/kmeter. Or you can build it yourself.

# My cluster has RBAC enabled. What should I do?
If you have RBAC enabeled make sure your Pod is allowed to query the metrics api. In the examples folder theres a file which creates a "godmode" role for the default user. Take a look as a  starting point. Be careful however and don't use this in your production environment.



