const k8s = require('@kubernetes/client-node');
const request = require('request');

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const opts = {};
kc.applyToRequest(opts);

var ns = process.env.MEASURE_NAMESPACE;
var podname =  process.env.MEASURE_PODNAME;
var interval = process.env.MEASURE_INTERVAL | 3000;
var timeInSeconds = process.env.MEASURE_TIME| 30;

var sumMem = 0;
var sumCpu = 0;
var maxLoops = timeInSeconds / (interval / 1000);
var loopCount = 0;
DoMeasure();

function DoMeasure() {
    
    request.get(`${kc.getCurrentCluster().server}/apis/metrics.k8s.io/v1beta1/namespaces/${ns}/pods/${podname}`, opts,
        (error, response, body) => {
            if (error) {
                console.log(`error: ${error}`);
            }
            if (response) {
                console.log(`statusCode: ${response.statusCode}`);
            }
            var count = 0;
            
            
            var lgs = JSON.parse(body);
            var cs = lgs.containers;
            
            cs.forEach(element => {
                var cpu = element.usage.cpu;
                var mem = element.usage.memory;
                 console.log(mem + " " + cpu);
                var mi = mem.replace("m", "");
                sumMem += parseInt(mi);

                var ci = cpu.replace("Ki", "");
                sumCpu += parseInt(ci);
            });

            if (loopCount++ < maxLoops) {
                setTimeout(DoMeasure, interval);
            }
            else {
                var result={};
                result.namespace=ns;
                result.podname=podname;
                result.averagecpu=sumCpu/loopCount;
                result.averagememory=sumMem/loopCount;
                result.measuretime=timeInSeconds;
                result.measurefinished=Date.now();

                console.log(result);
                console.log(JSON.stringify(result));
                process.exit();
            }
        });    
}






