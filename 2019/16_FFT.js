const input = get_input();
const basePattern = [0, 1, 0, -1];

solvePartOne();
solvePartTwo();

function solvePartOne() {
  let next = input;
  for (let i = 0; i < 100; i++) {
    next = calculateNextPhase(next);
  }
  console.log("Part one:", next.slice(0, 8).join(""));

  function calculateNextPhase(old) {
    const nextPhase = [];

    for (let i = 0; i < old.length; i++) {
      let sum = 0;
      for (let j = 0; j < old.length; j++) {
        const multiplier =
          basePattern[Math.floor((j + 1) / (i + 1)) % basePattern.length];
        if (multiplier) sum += old[j] * multiplier;
      }
      nextPhase.push(Math.abs(sum) % 10);
    }
    return nextPhase;
  }
}

function solvePartTwo() {
  const offset = parseInt(input.slice(0, 7).join(""));

  if (offset <= (input.length * 10000) / 2)
    throw new Error("Input cannot be solved by this method");
  throw new Error("Not implemented");
}

function get_input() {
  return "59727310424796235189476878806940387435291429226818921130171187957262146115559932358924341808253400617220924411865224341744614706346865536561788244183609411225788501102400269978290670307147139438239865673058478091682748114942700860895620690690625512670966265975462089087644554004423208369517716075591723905075838513598360188150158989179151879406086757964381549720210763972463291801513250953430219653258827586382953297392567981587028568433943223260723561880121205475323894070000380258122357270847092900809245133752093782889315244091880516672127950518799757198383131025701009960944008679555864631340867924665650332161673274408001712152664733237178121872"
    .split("")
    .map((a) => parseInt(a));
}
