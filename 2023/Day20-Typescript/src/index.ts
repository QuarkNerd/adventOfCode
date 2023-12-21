import fs from "fs";

const BROADCASTER = "broadcaster";

enum PulseType {
    High = "High",
    Low = "Low"
}

interface Pulse {
    pulseType: PulseType;
    from: string;
    to: string;
}

let partTwoTarget = "";
const modules = getModules();

let lowCount = 0;
let highCount = 0;
let i = 1;
const periodHash: {[name: string]: number} = {};
while (true) {
  const queue: Pulse[] = [{
    from: "button",
    to: "broadcaster",
    pulseType: PulseType.Low
  }];

  while (queue.length !== 0) {
    const pulse = queue.shift() as Pulse;
    pulse.pulseType === PulseType.Low ? lowCount++ : highCount++;
    if (pulse.to === partTwoTarget && !periodHash[pulse.from]) {
        periodHash[pulse.from] = pulse.pulseType === PulseType.Low ? 0 : i;
    }
    if (!(pulse.to in modules)) continue;
    const newPulses = modules[pulse.to].process(pulse);
    queue.push(...newPulses);
  }

  if (i === 1000) {
    console.log("Part one:", lowCount*highCount)
  }

  if (Object.values(periodHash).every(x => x > 0)) {
    console.log("Part two:", calculateLCM(Object.values(periodHash)));
    break;
  }

  i++;
}

// Part two assumes that the module that outputs to rx is conjuction
// and all modules that output to it have independent cyclic pattern for outputing High pulses

function getModules(): {[name: string]: Module} {
    const input = fs.readFileSync("input").toString('utf8').split("\r\n");
    const moduleToOutputs: {[name: string]: string[]} = {}
    for (let line of input) {
        const split = line.split(" -> ");
        moduleToOutputs[split[0]] = split[1].split(", ");
    }
    const nameToModule: {[name: string]: Module} = {};
    for (let [id, outputs] of Object.entries(moduleToOutputs)) {
        const name = id.substring(1);
        switch (id[0]) {
            case "%":
                nameToModule[name] = getFlipFlopModule(name, outputs);
                break;
            case "&":
                const inputs = Object.entries(moduleToOutputs)
                    .filter(([_, outputs]) => outputs.includes(name))
                    .map(([na, _]) => na.substring(1));
                nameToModule[name] = getConjuctionModule(name, outputs, inputs);
                break;
            default:
                nameToModule[BROADCASTER] = getBroadcastModule(BROADCASTER, outputs);
                break;
        }
    }
    return nameToModule;
}

function getFlipFlopModule(name: string, outputs: string[]): Module {
    let isOn = false;
    return {
        process: (pulse: Pulse) => {
            if (pulse.pulseType === PulseType.High) return [];
            isOn = !isOn;
            return outputs.map(out => ({
                from: name,
                to: out,
                pulseType: isOn ? PulseType.High : PulseType.Low
            }))
        }
    }
}

function getConjuctionModule(name: string, outputs: string[], inputs: string[]): Module {
    let mostRecent = Object.fromEntries(
        inputs.map(inp => ([inp, PulseType.Low]))
    );
    if (outputs[0] === "rx") {
        partTwoTarget = name;
    }
    return {
        process: (pulse: Pulse) => {
            mostRecent[pulse.from] = pulse.pulseType;
            const pulseType = Object.values(mostRecent).every(x => x === PulseType.High) ? PulseType.Low : PulseType.High;
            return outputs.map(out => ({
                from: name,
                to: out,
                pulseType
            }))
        }
    }
}

function getBroadcastModule(name: string, outputs: string[]): Module {
    return {
        process: (pulse: Pulse) => {
            return outputs.map(out => ({
                from: name,
                to: out,
                pulseType: pulse.pulseType
            }))
        }
    }
}

function calculateLCM (arr: number[]): number {
   const gcd2 = (a: number, b: number): number => {
      if(!b) return b===0 ? a : NaN;
      return gcd2(b, a%b);
   };

   const lcm2 = (a: number, b: number): number => {
      return a * b / gcd2(a, b);
   }

   let n = 1;
   for(let i = 0; i < arr.length; ++i){
      n = lcm2(arr[i], n);
   }
   return n;
};

interface Module {
    process: (pulse: Pulse) => Pulse[];
}
