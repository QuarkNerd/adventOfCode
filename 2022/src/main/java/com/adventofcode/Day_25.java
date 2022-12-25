package com.adventofcode;

import java.util.Arrays;

public class Day_25 extends SolverBase {
    public static void main(String[] args) { (new Day_25()).run(); }

    public SolutionPair solve(String input) {
        String[] lines = input.split(System.lineSeparator());
        long decimal = Arrays.stream(lines).map(this::parseSNAFU).reduce(0L, Long::sum);
        return new SolutionPair(
                convertToSNAFU(decimal), "There is no part two"
        );
    }

    private String convertToSNAFU(long number) {
        String snafu = "";

        while (number !=0) {
            switch ((int) (number%5)) {
                case 4:
                    snafu = "-" + snafu;
                    number += 1;
                    break;
                case 3:
                    snafu = "=" + snafu;
                    number += 2;
                    break;
                case 2:
                    snafu = "2" + snafu;
                    number-=2;
                    break;
                case 1:
                    snafu = "1" + snafu;
                    number -=1;
                    break;
                case 0:
                    snafu = "0" + snafu;
                    break;
            }
            number = number/5;
        }
        return snafu;
    }

    private long parseSNAFU(String snf) {
        String[] digits = snf.split("");

        long decimal = 0;
        for (int i = 0; i < digits.length; i++) {
            int val = switch (digits[digits.length - i - 1]) {
                case "2" -> 2;
                case "1" -> 1;
                case "0" -> 0;
                case "-" -> -1;
                case "=" -> -2;
                default -> throw new RuntimeException("www");
            };
            decimal += val*Math.pow(5, i);
        }
        return decimal;
    }
}
