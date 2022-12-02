package com.adventofcode;

public class SolutionPair {
    private Object partOne;
    private Object partTwo;

    SolutionPair(Object partOne, Object partTwo) {
        this.partOne = partOne;
        this.partTwo = partTwo;
    }

    public void print() {
        System.out.println("Part one: " + this.partOne.toString());
        System.out.println("Part Two: " + this.partTwo.toString());
    }
}
