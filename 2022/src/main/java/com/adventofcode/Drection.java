package com.adventofcode;

enum Direction {
    Right, Left, Up, Down;

    public static Direction fromCode(String code) {
        switch (code) {
            case "R":
                return Direction.Right;
            case "L":
                return Direction.Left;
            case "U":
                return Direction.Up;
            case "D":
                return Direction.Down;
            default:
                throw new RuntimeException("Invalid code: " + code);
        }
    }

    public int getXChange() {
        if (this == Right) {
            return 1;
        }
        if (this == Left) {
            return -1;
        }
        return 0;
    }

    public int getYChange() {
        if (this == Up) {
            return -1;
        }
        if (this == Down) {
            return 1;
        }
        return 0;
    }

    public Direction getRotatedRight() {
        switch (this) {
            case Up:
                return Right;
            case Right:
                return Down;
            case Down:
                return Left;
            case Left:
                return Up;
        }
        return null;
    }

    public Direction getRotatedLeft() {
        switch (this) {
            case Up:
                return Left;
            case Right:
                return Up;
            case Down:
                return Right;
            case Left:
                return Down;
        }
        return null;
    }
}