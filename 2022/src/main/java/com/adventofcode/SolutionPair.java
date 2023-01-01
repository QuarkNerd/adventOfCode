package com.adventofcode;

public record SolutionPair(Object partOne, Object partTwo) {

    public void print() {
        System.out.println("Part one: " + this.partOne.toString());
        System.out.println("Part Two: " + this.partTwo.toString());
    }
}
