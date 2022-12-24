package com.adventofcode;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

public class Day_10 extends SolverBase {
    public static void main(String[] args) { (new Day_10()).run(); }

    public SolutionPair solve(String input) {
        List<Integer> xValues = new ArrayList<>();
        xValues.add(1);

        for (String op: input.split(System.lineSeparator())) {
            Integer latestValue = xValues.get(xValues.size() - 1);
            xValues.add(latestValue);
            if (op.equals("noop")) { continue; }
            Integer change = Integer.valueOf(op.split(" ")[1]);
            xValues.add(latestValue + change);
        }
        Integer signalStrength = IntStream.range(0, 6)
                .map(i -> 19 + i*40)
                .map(index -> xValues.get(index) * (index + 1))
                .reduce(0, Integer::sum);

        String draw = "\n" + IntStream.range(0, 240)
            .mapToObj(i -> {
                String symbol = shouldDraw(xValues, i) ? "#" : " ";
                return symbol + (i%40 == 39 ? "\n" : "");
            })
                .collect(Collectors.joining());
        return new SolutionPair(signalStrength, draw);
    }

    public static boolean shouldDraw(List<Integer> xValues, int i) {
        int xPosCrt = i%40;
        int xPosSpr = xValues.get(i);
        return Math.abs(xPosCrt - xPosSpr) < 2;
    }
}
