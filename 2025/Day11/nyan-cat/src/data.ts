import * as d3 from "d3";

function getData(stringInp) {
  return ForceGraph(getNodesAndLinks(stringInp));
}

function ForceGraph({ nodes, links }) {
  const forceNode = d3.forceManyBody().distanceMax(500);
  const forceLink = d3
    .forceLink(links)
    .id((d) => d.id)
    .distance(80);

  d3.forceSimulation(nodes)
    .force("link", forceLink)
    .force("charge", forceNode)
    .force("center", d3.forceCenter());

  return { nodes, links };
}
function getNodesAndLinks(stringInp) {
  const input = stringInp
    .trim()
    .split(/\r?\n/)
    .map((line) => line.split(": "))
    .map(([ins, outs]) => [ins.trim(), outs.split(" ")]);
  console.log(input);
  const nodes = [...new Set(input.flatMap((a) => [a[0], ...a[1]]))].map(
    (id) => ({ id }),
  );
  const links = input.flatMap((a) =>
    a[1].map((out) => ({ source: a[0].trim(), target: out.trim() })),
  );
  return { nodes, links };
}

export default getData;
