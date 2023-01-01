package com.adventofcode;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.function.ToLongFunction;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class Day_11 extends SolverBase {
    public static void main(String[] args) { (new Day_11()).run(); }

    public SolutionPair solve(String input) {
        EvilLuggageTroop troopPartOne = EvilLuggageTroop.parse(input, false);
        for(int i = 0; i < 20; i++) {
            troopPartOne.processLuggage();
        }
        EvilLuggageTroop troopPartTwo = EvilLuggageTroop.parse(input, true);
        for(int i = 0; i < 10000; i++) {
            troopPartTwo.processLuggage();
        }
        return new SolutionPair(troopPartOne.getMonkeyBusinessLevel(), troopPartTwo.getMonkeyBusinessLevel());
    }

    static class EvilLuggageTroop {
        private final LuggageMonkey[] monkeys;
        private final long moduloStress;
        private final boolean isPartTwo;

        public static EvilLuggageTroop parse(String definition, boolean isPartTwo) {
            LuggageMonkey[] monkeys = Arrays.stream(definition.split(System.lineSeparator() + System.lineSeparator()))
                    .map(LuggageMonkey::parse)
                    .toArray(LuggageMonkey[]::new);
            EvilLuggageTroop troop = new EvilLuggageTroop(monkeys, isPartTwo);
            for(LuggageMonkey monkey: monkeys) {
                monkey.setTroop(troop);
            }
            return troop;
        }

        public void throwLuggage(long worryLevel, int monkeyNum) {
            monkeys[monkeyNum].catchLuggage(worryLevel);
        }

        public void processLuggage() {
            for(LuggageMonkey monkey: monkeys) {
                monkey.processLuggage();
            }
        }

        public long getMonkeyBusinessLevel() {
            Integer[] counts = Arrays.stream(this.monkeys).map(LuggageMonkey::getProcessCount).toArray(Integer[]::new);
            Arrays.sort(counts, Collections.reverseOrder());
            return (long)counts[0] * (long)counts[1];
        }

        public long reduceStress(long stress) {
            return isPartTwo ? stress % moduloStress : stress / 3;
        }

        private EvilLuggageTroop(LuggageMonkey[] monkeys, boolean isPartTwo) {
            this.monkeys = monkeys;
            this.isPartTwo = isPartTwo;
            this.moduloStress = Arrays.stream(monkeys).map(LuggageMonkey::getDivisor).reduce(1,(x,y)->x*y);
        }
    }

    static class LuggageMonkey {
        private final List<Long> items;
        private final ToLongFunction<Long> operation;
        private final int divisor;
        private final int targetIfTrue;
        private final int targetIfFalse;
        private int processCount = 0;

        private EvilLuggageTroop troop;

        public void setTroop(EvilLuggageTroop troop) {
            this.troop = troop;
        }

        public int getProcessCount() {
            return processCount;
        }

        public int getDivisor() {
            return divisor;
        }

        public static LuggageMonkey parse(String definition) {
            String[] spl = definition.split(System.lineSeparator());

            List<Long> items = new ArrayList<>();
            Matcher itemsMatcher = numbersPattern.matcher(spl[1]);
            while (itemsMatcher.find()) {
                items.add(Long.valueOf(itemsMatcher.group()));
            }

            ToLongFunction<Long> op = parseOperation(spl[2]);

            Matcher divisorMatcher = numbersPattern.matcher(spl[3]);
            divisorMatcher.find();
            int divisor = Integer.parseInt(divisorMatcher.group());

            Matcher targetIfTrueMatcher = numbersPattern.matcher(spl[4]);
            targetIfTrueMatcher.find();
            int targetIfTrue = Integer.parseInt(targetIfTrueMatcher.group());

            Matcher targetIfFalseMatcher = numbersPattern.matcher(spl[5]);
            targetIfFalseMatcher.find();
            int targetIfFalse = Integer.parseInt(targetIfFalseMatcher.group());
            return new LuggageMonkey(items, op, divisor, targetIfTrue, targetIfFalse);
        }

        public void catchLuggage(long item) {
            this.items.add(item);
        }

        public void processLuggage() {
            while (this.items.size() > 0) {
                this.processCount++;

                Long item = this.items.remove(0);
                item = this.operation.applyAsLong(item);
                item = this.troop.reduceStress(item);

                if (item % this.divisor == 0) {
                    this.troop.throwLuggage(item, targetIfTrue);
                } else {
                    this.troop.throwLuggage(item, targetIfFalse);
                }
            }
        }

        private static final Pattern numbersOrOldPattern = Pattern.compile("(old|\\d+)");
        private static final Pattern operatorPattern = Pattern.compile("[*+]");
        private static final Pattern numbersPattern = Pattern.compile("\\d+");
        private static ToLongFunction<Long> parseOperation(String opLine) {
            Matcher inputMatcher = numbersOrOldPattern.matcher(opLine);
            inputMatcher.find();
            Integer first = Util.safeParseInteger(inputMatcher.group());
            inputMatcher.find();
            Integer second = Util.safeParseInteger(inputMatcher.group());

            Matcher opMatcher = operatorPattern.matcher(opLine);
            opMatcher.find();

            if (opMatcher.group().equals("+")) {
                return (x) -> (first == null ? x : first) + (second == null ? x : second);
            }
            return (x) -> (first == null ? x : first) * (second == null ? x : second);
        }

        private LuggageMonkey(List<Long> items, ToLongFunction<Long> operation, int divisor, int targetIfTrue, int targetIfFalse) {
            this.items = items;
            this.operation = operation;
            this.divisor = divisor;
            this.targetIfTrue = targetIfTrue;
            this.targetIfFalse = targetIfFalse;
        }
    }

}
