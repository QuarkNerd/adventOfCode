const input = getInput();
const reactionList = input.split(",,");
const ingredientsHash = {};
reactionList.forEach(reaction => {
  const [ingredientList, aggregate] = reaction.split(" => ");
  const [aggregateQuantity, aggregateMaterial] = aggregate.split(" ");
  ingredientsHash[aggregateMaterial] = {
    quantity: parseFloat(aggregateQuantity),
    ingredients: ingredientList.split(", ").map(ingredient => {
      const [ingredientQuantity, ingredientMaterial] = ingredient.split(" ");
      return {
        quantity: parseFloat(ingredientQuantity),
        ingredient: ingredientMaterial
      };
    }, {})
  };
});

console.log(ingredientsHash);

solvePartOne();
function solvePartOne() {
  console.log(getOreQuantity("FUEL"));
}

function getOreQuantity(aggregate) {
  if (aggregate === "ORE") {
    return 1;
  }

  return ingredientsHash[aggregate].reduce((totalQuantity, current) => {
    totalQuantity += Math.ceil(
      current.quantity * getOreQuantity(current.ingredient)
    );

    return totalQuantity;
  }, 0);
}

function getInput() {
  return `9 ORE => 2 A,,8 ORE => 3 B,,7 ORE => 5 C,,3 A, 4 B => 1 AB,,5 B, 7 C => 1 BC,,4 C, 1 A => 1 CA,,2 AB, 3 BC, 4 CA => 1 FUEL`;
}
