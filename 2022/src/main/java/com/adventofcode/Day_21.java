package com.adventofcode;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

public class Day_21 extends SolverBase {
    public static void main(String[] args) { (new Day_21()).run(); }
    private static String secretHuman = "humn";

    public SolutionPair solve(String input) {
        String[] lines = input.split(System.lineSeparator());

        Map<String, Long> resolvedValues = new HashMap<>();
        Map<String, String[]> operationsMap = new HashMap<>();
        Set<String> unsolvableMonkeys = new HashSet<>();
        Long secretHumanValue = null;
        unsolvableMonkeys.add(secretHuman);

        while (resolvedValues.size() + unsolvableMonkeys.size() < lines.length) {
            for (String line: lines) {
                String[] spl = line.split(": ");
                String monkeyToDefine = spl[0];

                // slower with null check wow
                if (monkeyToDefine.equals(secretHuman)) {
                    secretHumanValue = Long.valueOf(spl[1]);
                    continue;
                };

                if(!resolvedValues.containsKey(monkeyToDefine)) {
                    Integer val = Util.safeParseInteger(spl[1]);
                    if (val != null) {
                        resolvedValues.put(monkeyToDefine, Long.valueOf(val));
                    } else {
                        String[] operation = spl[1].split(" ");
                        operationsMap.put(monkeyToDefine, operation);

                        if(unsolvableMonkeys.contains(operation[0]) ||
                            unsolvableMonkeys.contains(operation[2])) {
                            unsolvableMonkeys.add(monkeyToDefine);
                        }

                        Long valOne = resolvedValues.get(operation[0]);
                        Long valTwo = resolvedValues.get(operation[2]);

                        if (valOne != null && valTwo != null) {
                            double res = calculate(valOne, operation[1], valTwo);
                            resolvedValues.put(monkeyToDefine, Math.round(res));
                        }
                    }
                }
            }
        }

        String[] root = operationsMap.get("root");

        HashMap<String, Double> c = new HashMap<>();
        double v1 = getValue(resolvedValues, operationsMap, Double.valueOf(secretHumanValue), root[0], c);
        double v2 = getValue(resolvedValues, operationsMap, Double.valueOf(secretHumanValue), root[2], c);

        Long partOne = Math.round(calculate(v1, root[1], v2));
        
        double lower = 0.;
        double upper = 3023372036854775807.;
        double testHumanValue;
        while (true) {

            testHumanValue = (lower + upper)/2;
                HashMap<String, Double> cache = new HashMap<>();
                double valOne = getValue(resolvedValues, operationsMap, testHumanValue, root[0], cache);
                double valTwo = getValue(resolvedValues, operationsMap, testHumanValue, root[2], cache);

                double diff = valOne - valTwo;

                if (Math.abs(diff) < 0.000001) {
                    break;
                } else if (diff > 0) {
                    lower = testHumanValue;
                } else if (diff < 0) {
                    upper = testHumanValue;
                }
        }
        
        return new SolutionPair(partOne, Math.round(testHumanValue));
    }

    public double getValue(Map<String, Long> operationsMap, Map<String, String[]> oper, Double humn, String monkey, Map<String, Double> cache)
    {
        if (monkey.equals("humn")) {
            return humn;
        }

        if (operationsMap.containsKey(monkey)) {
            return Double.valueOf(operationsMap.get(monkey));
        }

        if (cache.containsKey(monkey)) {
            return Double.valueOf(cache.get(monkey));
        }

        String[] operation = oper.get(monkey);

        double valOne = getValue(operationsMap, oper, humn, operation[0], cache);
        double valTwo = getValue(operationsMap, oper, humn, operation[2], cache);

        double res = calculate(valOne, operation[1], valTwo);
        cache.put(monkey, res);
        return res;
    }

    public double calculate(double valOne, String operation, double valTwo) {
        switch (operation) {
            case "*":
                return valOne * valTwo;
            case "+":
                return valOne + valTwo;
            case "-":
                return valOne - valTwo;
            case "/":
                return valOne / valTwo;
            default:
                throw new RuntimeException("Invalid operation" + operation);
        }
    }
}
