package com.adventofcode;

public class AllDays {
    public static void main(String[] args) {
        long startTime = System.currentTimeMillis();
        (new Day_01()).run();
        (new Day_02()).run();
        (new Day_03()).run();
        (new Day_04()).run();
        (new Day_05()).run();
        (new Day_06()).run();
        (new Day_07()).run();
        (new Day_08()).run();
        (new Day_09()).run();
        (new Day_10()).run();
        (new Day_11()).run();
        (new Day_12()).run();
        (new Day_13()).run();
        (new Day_14()).run();
        (new Day_15()).run();
        (new Day_16()).run();
        (new Day_17()).run();
        (new Day_18()).run();
        (new Day_19()).run();
        (new Day_20()).run();
        (new Day_21()).run();
        (new Day_22()).run();
        (new Day_23()).run();
        (new Day_24()).run();
        (new Day_25()).run();
        long endTime = System.currentTimeMillis();
        long totalTime = endTime - startTime;

        System.out.println("Total execution time in milliseconds: " + totalTime);
    }
}
