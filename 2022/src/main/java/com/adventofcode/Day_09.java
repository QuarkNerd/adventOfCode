package com.adventofcode;

import java.util.HashSet;

public class Day_09 extends SolverBase {
    public static void main(String[] args) { (new Day_09()).run(); }

    public SolutionPair solve(String input) {
        HashSet<String> partOne = new HashSet<>();
        HashSet<String> partTwo = new HashSet<>();

        Rope rope = new Rope(10);

        for (String ins: input.split(System.lineSeparator())) {
            String[] spl = ins.split(" ");

            Direction dir = Direction.fromCode(spl[0]);
            int count = Integer.parseInt(spl[1]);

            for (int _i = 0; _i < count; _i++) {
                rope.moveHead(dir);
                partOne.add(rope.getKnotAt(1).toString());
                partTwo.add(rope.getKnotAt(9).toString());
            }
        }

        return new SolutionPair(partOne.size(), partTwo.size());
    }

    class Rope {
        public Vector[] knots;

        Rope(int size) {
            knots = new Vector[size];
            for(int i = 0; i < knots.length ; i++) {
                knots[i] = new Vector(0,0);
            }
        }

        public void moveHead(Direction direction) {
            switch (direction) {
                case Right:
                    knots[0].translateMut(1, 0);
                    break;
                case Left:
                    knots[0].translateMut(-1, 0);
                    break;
                case Up:
                    knots[0].translateMut(0, 1);
                    break;
                case Down:
                    knots[0].translateMut(0, -1);
                    break;
            }

            for (int i=0; i < knots.length - 1; i++) {
                Vector segmentHead = knots[i];
                Vector segmentTail = knots[i + 1];

                if (segmentHead.getDistanceSquared(segmentTail) >= 4) {
                    Vector diff = segmentHead.subtract(segmentTail);
                    diff.reduceToSignMut();
                    segmentTail.translateMut(diff);
                }
            }
        }

        public Vector getKnotAt(int n) {
            return knots[n];
        }
    }

    class Vector {
        private int x;
        private int y;

        Vector(int x, int y) {
            this.x = x;
            this.y = y;
        }

        public void translateMut(int dx, int dy) {
            this.x += dx;
            this.y += dy;
        }

        public void translateMut(Vector other) {
            translateMut(other.x, other.y);
        }

        public int getDistanceSquared(Vector other) {
            double distSquared = Math.pow(this.x - other.x, 2) +  Math.pow(this.y - other.y, 2);
            return (int)Math.round(distSquared);
        }

        public Vector subtract(Vector other) {
            return new Vector(this.x - other.x, this.y - other.y);
        }

        public void reduceToSignMut() {
            this.x = Integer.signum(x);
            this.y = Integer.signum(y);
        }

        public String toString() {
            return this.x + "," + this.y;
        }
    }
}