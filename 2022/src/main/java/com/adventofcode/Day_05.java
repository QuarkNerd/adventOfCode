package com.adventofcode;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Stack;
import java.util.stream.Collectors;

public class Day_05 extends SolverBase {
    public static void main(String[] args) { (new Day_05()).run(); }

    public SolutionPair solve(String input) {
        String[] spl = input.split(System.lineSeparator() + System.lineSeparator());

        SupplyStacks stacksPartOne = new SupplyStacks(spl[0]);
        SupplyStacks stacksPartTwo = stacksPartOne.clone();

        Arrays.stream(spl[1].split(System.lineSeparator())).forEach(ins -> {
            String[] instructionSplit = ins.split(" ");

            int from = Integer.parseInt(instructionSplit[3]);
            int to = Integer.parseInt(instructionSplit[5]);
            int num = Integer.parseInt(instructionSplit[1]);

            stacksPartOne.shiftIndividually(from, to, num);
            stacksPartTwo.shiftTogether(from, to, num);
        });


        return new SolutionPair(stacksPartOne.getTopBoxes(), stacksPartTwo.getTopBoxes());
    }

    class SupplyStacks {

        private final List<List<Character>> stacks;

        SupplyStacks(String str) {
            List<String> spl = Util.split(str, System.lineSeparator());

            stacks = new ArrayList<>();
            int stackCount = (spl.get(0).length()+1)/4;
            for (int stackNum = 0; stackNum < stackCount; stackNum++) {
                List<Character> stack = new ArrayList<>();

                int stackPosition = stackNum*4 + 1;
                for (int i = spl.size() - 2; i >= 0; i--) {
                    Character box = spl.get(i).charAt(stackPosition);
                    if (box == ' ') break;
                    stack.add(0, box);
                }

                stacks.add(stack);
            }
        }

        SupplyStacks(List<List<Character>> stacks) {
            this.stacks = stacks;
        }

        public SupplyStacks clone() {
            return new SupplyStacks(Util.cloneRecursively(this.stacks));
        }

        public void shiftIndividually(int from, int to, int count) {
            List<Character> fromStack = stacks.get(from - 1);
            List<Character> toStack = stacks.get(to - 1);

            for (int _i = 0; _i < count; _i ++) toStack.add(0, fromStack.remove(0));
        }

        public void shiftTogether(int from, int to, int count) {
            List<Character> fromStack = stacks.get(from - 1);
            List<Character> toStack = stacks.get(to - 1);

            for (int i = 0; i < count; i ++) toStack.add(0, fromStack.remove(count - i - 1));
        }

        public String getTopBoxes() {
            return stacks.stream().map(st -> st.get(0)).map(Object::toString).collect(Collectors.joining());
        }
    }
}
