package com.adventofcode;

import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

public class Day_01 extends SolverBase {
    public static void main(String[] args) { (new Day_01()).run("Day_01"); }

    public SolutionPair solve(String input) {
        List<String> split = Util.split(input, System.lineSeparator() + System.lineSeparator());

        List<Integer> threeHighest = split.stream()
                .map(Day_01::getTotalCalories)
                .sorted(Comparator.reverseOrder())
                .limit(3)
                .collect(Collectors.toList());

        return new SolutionPair(
                threeHighest.get(0),
                threeHighest.stream().reduce(0, (a, b) -> a + b));
    }

    private static Integer getTotalCalories(String calorieBlock) {
        return Arrays.stream(calorieBlock.split(System.lineSeparator())).map(Integer::valueOf).reduce(0, (a, b) -> a + b);
    }
}
