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
}