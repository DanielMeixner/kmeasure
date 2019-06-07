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
{"namespace":"default","podname":"anycode-7dff646747-vz5xj","averagecpu":0,"averagememory":40792.8,"metertime":62,"meterfinished":1559834504300}
```


# where the heck is this container?
You can find a built container image on docker hub danielmeixner/kmeter

