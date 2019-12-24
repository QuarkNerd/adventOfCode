const input = getInput();

solvePartOne();
solvePartTwo();
function solvePartOne() {
  const NUMCARDS = 10007;
  let deck = range(0, NUMCARDS - 1);
  input.forEach(instruction => {
    let [action, parameter] = getInstructionDetails(instruction);
    switch (action) {
      case "deal into new stack":
        deck = newStack(deck);
        break;
      case "cut":
        deck = cutNCards(deck, parameter);
        break;
      case "deal with increment":
        deck = dealWithIncN(deck, parameter);
        break;
    }
  });
  console.log(deck.indexOf(2019));

  function newStack(deck) {
    return deck.reverse();
  }

  function cutNCards(deck, N) {
    size = deck.length;
    return new Array(size)
      .fill(undefined)
      .map((_, i) => deck[(i + N + size) % size]);
  }

  function dealWithIncN(deck, N) {
    size = deck.length;
    newDeck = new Array(size).fill(undefined);
    deck.forEach((value, i) => {
      newDeck[(i * N) % size] = value;
    });
    return newDeck;
  }

  function range(start, end) {
    return new Array(end - start + 1).fill(undefined).map((_, i) => i + start);
  }
}

function solvePartTwo() {
  const iii = 2020;
  let index = 2020;
  const NUMCARDS = 119315717514047;
  for (let i = 0; i < 10000; i++) {
    input.forEach(instruction => {
      let [action, parameter] = getInstructionDetails(instruction);
      switch (action) {
        case "deal into new stack":
          index = newStack(index);
          break;
        case "cut":
          index = cutNCards(index, parameter);
          break;
        case "deal with increment":
          index = dealWithIncN(index, parameter);
          break;
      }
    });
    if (index == iii) {
      console.log(22);
    }
  }
  console.log(index);

  function newStack(index) {
    return NUMCARDS - 1 - index;
  }

  function cutNCards(index, N) {
    return (index - N + NUMCARDS) % NUMCARDS;
  }

  function dealWithIncN(index, N) {
    return (index * N) % size;
  }
}

function getInstructionDetails(instruction) {
  instruction = instruction.trim();
  const regex = /([^\d-]+) (\-?\d+$)/;
  const match = regex.exec(instruction);

  if (match === null) {
    return [instruction, undefined];
  }
  return [match[1], parseFloat(match[2])];
}

function getInput() {
  return `cut -8737
  deal with increment 36
  deal into new stack
  deal with increment 32
  cut -3856
  deal with increment 27
  deal into new stack
  cut 8319
  deal with increment 15
  deal into new stack
  deal with increment 53
  cut 2157
  deal with increment 3
  deal into new stack
  cut 9112
  deal with increment 59
  cut 957
  deal with increment 28
  cut -9423
  deal with increment 51
  deal into new stack
  deal with increment 8
  cut 3168
  deal with increment 16
  cut 6558
  deal with increment 32
  deal into new stack
  cut -8246
  deal with increment 40
  cut 4405
  deal with increment 9
  cut -2225
  deal with increment 36
  cut -5080
  deal with increment 59
  cut -648
  deal with increment 64
  cut -1845
  deal into new stack
  cut -7726
  deal with increment 44
  cut 1015
  deal with increment 12
  cut 960
  deal with increment 30
  deal into new stack
  deal with increment 65
  deal into new stack
  deal with increment 27
  cut 6877
  deal with increment 5
  deal into new stack
  cut -3436
  deal with increment 63
  deal into new stack
  deal with increment 71
  deal into new stack
  deal with increment 7
  cut -9203
  deal with increment 38
  cut 9008
  deal with increment 59
  deal into new stack
  deal with increment 13
  cut 5979
  deal with increment 55
  cut 9483
  deal with increment 65
  cut -9250
  deal with increment 75
  deal into new stack
  cut -1830
  deal with increment 55
  deal into new stack
  deal with increment 67
  cut -8044
  deal into new stack
  cut 8271
  deal with increment 51
  cut 6002
  deal into new stack
  deal with increment 47
  cut 3638
  deal with increment 18
  cut -785
  deal with increment 63
  cut -2460
  deal with increment 25
  cut 5339
  deal with increment 61
  cut -5777
  deal with increment 54
  deal into new stack
  cut 8075
  deal into new stack
  deal with increment 22
  cut 3443
  deal with increment 34
  cut 5193
  deal with increment 3`.split("\n");
}
