package com.adventofcode;

import com.google.common.collect.Lists;

import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.Stack;
import java.util.stream.Collectors;

public class Day_03 extends SolverBase {
    public static void main(String[] args) { (new Day_03()).run(); }

    public SolutionPair solve(String input) {
        List<String> lines = Util.split(input, System.lineSeparator());
        return new SolutionPair(
                Util.mapSum(lines, Day_03::findPriorityAcrossCompartments),
                solvePartTwo(lines)
        );
    }

    private static int solvePartTwo(List<String> input) {
        List<List<String>> batches = Lists.partition(input, 3);
        return Util.mapSum(batches, Day_03::findCommonCharPriority);
    }

    private static int findPriorityAcrossCompartments(String backpack) {
        String s1a = backpack.substring(0, (backpack.length()/2));
        String s1b = backpack.substring(backpack.length()/2);
        return findCommonCharPriority(Arrays.asList(s1a, s1b));
    }

    private static Integer findCommonCharPriority(List<String> strings) {
        Stack<Set<Integer>> charSets = strings
                .stream()
                .map(Day_03::computeSetOfCharCodes)
                .collect(Collectors.toCollection(Stack::new));
        Set<Integer> common = charSets.pop();
        charSets.forEach(set -> common.retainAll(set));
        Integer ch = common.iterator().next();
        return computePriority(ch);
    }

    private static int computePriority(Integer ch) {
        return ch > 96 ? ch - 96 : ch - 38;
    }

    private static Set<Integer> computeSetOfCharCodes(String str) {
        return str.chars()
                .mapToObj(e->e).collect(Collectors.toSet());
    }
}
