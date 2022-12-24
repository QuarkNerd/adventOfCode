package com.adventofcode;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

public class Day_17 extends SolverBase {
    public static void main(String[] args) { (new Day_17()).run(); }

    public SolutionPair solve(String input) {
        String[] spl = input.split("");
        long rocksAtRest = 0;
        int step = 0;
        Set<Node> restingRockPositions = new HashSet<>();
        Map<String, long[]> shapeMemory = new HashMap<>();
        int highestRock = -1;
        long oldRocksAtRest = 0;
        int partOne = 0;
        long partTwo = 0;
        while (true)  {
            int x = 2;
            int y = highestRock + 4;

            // Part Two calculations in this if block
            if (rocksAtRest > oldRocksAtRest && rocksAtRest%5 == 0) {
                String h = getTopFifteenLines(restingRockPositions, highestRock);

                if (shapeMemory.containsKey(h)) {
                    long[] previousOccurance = shapeMemory.get(h);
                    long previousRocksAtRest = previousOccurance[1];

                    long diff = rocksAtRest - previousRocksAtRest;

                    if (rocksAtRest % diff == 1000000000000L % diff) {
                        long heightDiff = highestRock - previousOccurance[0];
                        long heightToAdd = ((1000000000000L - rocksAtRest) / diff) * heightDiff;
                        partTwo = highestRock + heightToAdd + 1;
                        break;
                    }
                }

                shapeMemory.put(h, new long[] {highestRock, rocksAtRest});
            }

            Set<Node> rock = getRock(2, highestRock + 4, rocksAtRest%5);

            // follow the latest block
            while (true) {
                String nextMovement = spl[step];
                step = (step+1)%spl.length;

                int newX;
                if (nextMovement.equals(">")) {
                    newX = x +1;
                } else {
                    newX = x-1;
                }

                Set<Node> potentialPosition = getRock(newX, y, rocksAtRest%5);

                if (!potentialPosition.stream().anyMatch(r -> restingRockPositions.contains(r) || r.x < 0 || r.x >= 7)) {
                    rock = potentialPosition;
                    x=newX;
                }


                y--;

                Set<Node> potentialPositionTwo = getRock(x, y, rocksAtRest%5);

                if (potentialPositionTwo.stream().anyMatch(r -> restingRockPositions.contains(r) || r.y < 0)) {
                    restingRockPositions.addAll(rock);
                    rocksAtRest++;

                    for(Node n: rock) {
                        if (n.y > highestRock) {
                            highestRock = n.y;
                        }
                        if (highestRock + 1 == 94642857143L) {
                            throw new RuntimeException("Say what");
                        }
                    }
                    break;
                }

                rock = potentialPositionTwo;
            }

            if (rocksAtRest == 2022) {
                partOne = highestRock + 1;
            }
        }

        return new SolutionPair(
                partOne,
                partTwo
        );
    }

    public static Set<Node> getRock(int x, int y, long rockNum) {
        HashSet<Node> rock = new HashSet<>();
        switch ((int)rockNum) {
            case 0:
                rock.add(new Node(x, y));
                rock.add(new Node(x + 1, y));
                rock.add(new Node(x + 2, y));
                rock.add(new Node(x + 3, y));
                return rock;
            case 1:
                rock.add(new Node(x, y + 1));
                rock.add(new Node(x + 1, y + 2));
                rock.add(new Node(x + 1, y + 1));
                rock.add(new Node(x + 1, y));
                rock.add(new Node(x + 2, y + 1));
                return rock;
            case 2:
                rock.add(new Node(x, y));
                rock.add(new Node(x + 1, y));
                rock.add(new Node(x + 2, y));
                rock.add(new Node(x + 2, y + 1));
                rock.add(new Node(x + 2, y + 2));
                return rock;
            case 3:
                rock.add(new Node(x, y));
                rock.add(new Node(x, y + 1));
                rock.add(new Node(x, y + 2));
                rock.add(new Node(x, y + 3));
                return rock;
            case 4:
                rock.add(new Node(x, y));
                rock.add(new Node(x + 1, y + 1));
                rock.add(new Node(x + 1, y));
                rock.add(new Node(x, y + 1));
                return rock;
        }
        throw new RuntimeException("No rock");
    }

    private String getTopFifteenLines(Set<Node> posRest, int highestRock) {
        String st = "";
        for (int i = 0; i < 7*15; i++) {
            int x = i%7;
            int y = highestRock - i/7;

            st += posRest.contains(new Node(x, y)) ? "#" : " ";
        }
        return st;
    }
}
