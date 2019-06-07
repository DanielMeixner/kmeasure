const k8s = require('@kubernetes/client-node');
const request = require('request');

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const opts = {};
kc.applyToRequest(opts);

var ns = process.env.METER_NAMESPACE;
var debug = process.env.METER_DEBUG | false;
var podname = process.env.METER_PODNAME;
var interval = process.env.METER_INTERVAL | 3000;
var timeInSeconds = process.env.METER_TIME | 30;

var maxLoops = timeInSeconds / (interval / 1000);
var loopCount = 0;
DoMeasure();
var result = {};
var sumMem=0;
var sumCpu=0;
console.log("kmeter starts measuring " + ns  +"//"+ podname +" for " + timeInSeconds + "seconds. Please be patient.");

function DoMeasure() {
    
    request.get(`${kc.getCurrentCluster().server}/apis/metrics.k8s.io/v1beta1/namespaces/${ns}/pods/${podname}`, opts,
        (error, response, body) => {
            if (error) {
                console.log(`error: ${error}`);
            }
            if (response) {
                if (debug) console.log(`statusCode: ${response.statusCode}`);
            }
            var count = 0;

            var lgs = JSON.parse(body);
            if (debug) console.log(lgs);
            var cs = lgs.containers;

            // loop through all containers
            cs.forEach(element => {
                var cpu = element.usage.cpu;
                var mem = element.usage.memory;
                if (debug) console.log(mem + " " + cpu);

                var mi = mem.replace("m", "");
                var ci = cpu.replace("Ki", "");

                // single container
                if(!result[element.name])
                {
                    result[element.name]= {};
                    result[element.name].sumMem=0;
                    result[element.name].sumCpu=0;
                }
                result[element.name].sumMem += parseInt(mi);
                result[element.name].sumCpu += parseInt(ci);

                // total sum
                sumMem += parseInt(mi);
                sumCpu += parseInt(ci);
            });

            if (loopCount++ < maxLoops) {
                setTimeout(DoMeasure, interval);
            }
            else {

                // container values
                cs.forEach(element => {                    
                    var cAvgCpu= result[element.name].sumCpu / loopCount;
                    var cAvgMem= result[element.name].sumMem / loopCount;
                    result[element.name]={};
                    result[element.name].averageMemory=cAvgMem;
                    result[element.name].averageCpu=cAvgCpu;
                });

                // totals
                result.namespace = ns;
                result.podName = podname;
                result.averageCpu = sumCpu / loopCount;
                result.averageMemory = sumMem / loopCount;
                result.meterTime = timeInSeconds;
                result.meterFinishedTime = Date.now();

                
                console.log(JSON.stringify(result));
                console.log("kmeter finished measuring " + ns  +"//"+ podname +" ...");
                process.exit();
            }
        });
}






