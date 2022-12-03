package com.adventofcode;

import java.util.List;

public class Day_02 extends SolverBase {
    public static void main(String[] args) { (new Day_02()).run(); }

    public SolutionPair solve(String input) {
        List<String> lines = Util.split(input, System.lineSeparator());

        Cache<String, Integer> cacheRoundOne = new Cache<>(Day_02::scoreRoundPartOne);
        Cache<String, Integer> cacheRoundTwo = new Cache<>(Day_02::scoreRoundPartTwo);

        return new SolutionPair(
                Util.mapSum(lines, cacheRoundOne::get),
                Util.mapSum(lines, cacheRoundTwo::get)
        );
    }

    public static int scoreRoundPartOne(String round) {
        String[] split = round.split( " ");
        Item them = Item.fromCode(split[0]);
        Item me = Item.fromCode(split[1]);
        Outcome outcome = me.against(them);
        return me.getScore() + outcome.getScore();
    }

    private static int scoreRoundPartTwo(String round) {
        String[] split = round.split( " ");
        Item them = Item.fromCode(split[0]);
        Outcome outcome = Outcome.fromCode(split[1]);
        Item me = Item.getDesiredItem(outcome, them);
        return me.getScore() + outcome.getScore();
    }

    enum Item {
        Rock(1), Paper(2), Scissors(3);

        private int numVal;

        Item(int numVal) {
            this.numVal = numVal;
        }

        public int getNumVal(){
            return this.numVal;
        }

        public int getScore() {
            return numVal;
        }

        public Outcome against(Item opponent) {
            return Outcome.valueOf(this.numVal - opponent.getNumVal());
        }

        public static Item getDesiredItem(Outcome desiredOutcome, Item opponent) {
            return Item.valueOf(opponent.getNumVal() + desiredOutcome.getNumVal());
        }

        public static Item fromCode(String code) {
            switch (code) {
                case "A":
                case "X":
                    return Item.Rock;
                case "B":
                case "Y":
                    return Item.Paper;
                case "C":
                case "Z":
                    return Item.Scissors;
                default:
                    throw new RuntimeException("Invalid code: " + code);
            }
        }

        public static Item valueOf(int value) {
            value = Math.floorMod(value, 3);
            switch (value) {
                case 1:
                    return Item.Rock;
                case 2:
                    return Item.Paper;
                case 0:
                    return Item.Scissors;
                default:
                    throw new RuntimeException("Unreachable code");
            }
        }
    }

    enum Outcome {
        Lose(-1), Draw(0), Win(1);

        private int numVal;

        Outcome(int numVal) {
            this.numVal = numVal;
        }

        public int getNumVal(){
            return this.numVal;
        }

        public int getScore() {
            return (numVal + 1) * 3;
        }

        public static Outcome fromCode(String code) {
            switch (code) {
                case "X":
                    return Outcome.Lose;
                case "Y":
                    return Outcome.Draw;
                case "Z":
                    return Outcome.Win;
                default:
                    throw new RuntimeException("Invalid code: " + code);
            }
        }

        public static Outcome valueOf(int value) {
            value = Math.floorMod(value, 3);
            switch (value) {
                case 1:
                    return Outcome.Win;
                case 2:
                    return Outcome.Lose;
                case 0:
                    return Outcome.Draw;
                default:
                    throw new RuntimeException("Unreachable code");
            }
        }
    }
}
