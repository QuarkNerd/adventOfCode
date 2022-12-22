package com.adventofcode;

import java.util.HashMap;
import java.util.Map;

public class Day_22 extends SolverBase {
    public static void main(String[] args) {
        (new Day_22()).run();
    }

    public SolutionPair solve(String input) {
        String[] spl = input.split(System.lineSeparator() + System.lineSeparator());

        Map<Node, Boolean> hasWallMap = new HashMap<>();
        String[] lines = spl[0].split(System.lineSeparator());

        String[] instructions = parseInstructions(spl[1]);

        for (int i = 0; i < lines.length; i++) {
            String ln = lines[i];
            for (int j = 0; j < ln.length(); j++) {
                char pos = ln.charAt(j);
                if (pos == 35) {
                    hasWallMap.put(new Node(j, i), true);
                } else if (pos == 46) {
                    hasWallMap.put(new Node(j, i), false);
                }
            }
        }

        return new SolutionPair(
                calculatePassword(Day_22::getNextWrap2d, hasWallMap, instructions),
                calculatePassword(Day_22::getNextWrap3d, hasWallMap, instructions)
        );
    }

    private static int calculatePassword(MonkeyMapTraveller traveller, Map<Node, Boolean> hasWallMap, String[] instructionList) {
        State state = new State(new Node(0, 0), Direction.Right);
        state = getNextWrap2d(hasWallMap, state);

        for (String instruction : instructionList) {
            if (instruction.equals("R")) {
                state = new State(state.position, state.direction.getRotatedRight());
                continue;
            }
            if (instruction.equals("L")) {
                state = new State(state.position, state.direction.getRotatedLeft());
                continue;
            }
            int movement = Integer.parseInt(instruction);
            for (int i = 0; i < movement; i++) {
                State potentialNext = traveller.getNextState(hasWallMap, state);
                if (hasWallMap.get(potentialNext.position)) {
                    break;
                }
                state = potentialNext;
            }
        }
        return state.getPassword();
    }

    private static State getNextWrap2d(Map<Node, Boolean> hasWallMap, State state) {
        Node node = state.position;
        do {
            int newX;
            int newY;
            int xChange = state.direction.getXChange();
            int yChange = state.direction.getYChange();
            newX = node.x + xChange;
            newY = node.y + yChange;

            if (node.x >= 150) {
                newX = 0;
            } else if (node.x < 0) {
                newX = 149;
            } else if (node.y >= 200) {
                newY = 0;
            } else if (node.y < 0) {
                newY = 199;
            }
            node = new Node(newX, newY);
        } while (hasWallMap.get(node) == null);
        return new State(node, state.direction);
    }

    private static State getNextWrap3d(Map<Node, Boolean> hasWallMap, State state) {
        Node current = state.position;
        Direction currentDirection = state.direction;
        int newX;
        int newY;
        int xChange = currentDirection.getXChange();
        int yChange = currentDirection.getYChange();
        newX = current.x + xChange;
        newY = current.y + yChange;

        current = new Node(newX, newY);
        if (hasWallMap.get(current) != null) {
            return new State(current, currentDirection);
        }

        if (current.x == 50 && currentDirection == Direction.Right) {
            return new State(
                    new Node(current.y - 100, 149),
                    Direction.Up
            );
        }

        if (current.y == 150 && currentDirection == Direction.Down) {
            return new State(
                    new Node(49, 100 + current.x),
                    Direction.Left
            );
        }

        if (current.x == 100 && currentDirection == Direction.Right) {
            if (current.y > 49 && current.y < 100) {
                return new State(
                        new Node(50 + current.y, 49),
                        Direction.Up
                );
            }
            if (current.y > 99 && current.y < 150) {
                return new State(
                        new Node(149, 149 - current.y),
                        Direction.Left
                );
            }
            return null;
        }

        if (current.y == 50 && currentDirection == Direction.Down) {
            return new State(
                    new Node(99, current.x-50),
                    Direction.Left
            );
        }

        if (current.x == 150 && currentDirection == Direction.Right) {
            return new State(
                    new Node(99, 149-current.y),
                    Direction.Left
            );
        }

        if (current.y == 99 && currentDirection == Direction.Up) {
            return new State(
              new Node(50, 50 + current.x),
              Direction.Right
            );
        }

        if (current.x == 49 && currentDirection == Direction.Left) {
            if (current.y < 50) {
                return new State(
                    new Node(0, 149 - current.y),
                    Direction.Right
                );
            }
            if (current.y < 100) {
                return new State(
                        new Node(current.y - 50, 100),
                        Direction.Down
                );
            }
        }

        if (current.x == -1 && currentDirection == Direction.Left) {
            if (current.y > 99 && current.y < 150) {
                return new State(
                        new Node(50, 149 - current.y),
                        Direction.Right
                );
            }
            if (current.y > 149 && current.y < 200) {
                return new State(
                        new Node(current.y - 100, 0),
                        Direction.Down
                );
            }
        }

        if (current.y == -1 && currentDirection == Direction.Up) {
            if (current.x > 49 && current.x < 100) {
                return new State(
                    new Node(0, 100 + current.x),
                    Direction.Right
                );
            }
            if (current.x > 99 && current.x < 150) {
                return new State(
                        new Node(current.x - 100, 199),
                        Direction.Up
                );
            }
        }

        if (current.y == 200 && currentDirection == Direction.Down) {
            return new State(
                    new Node(current.x + 100, 0),
                    Direction.Down
            );
        }
        return null;
    }

    private static String[] parseInstructions(String instructionLine) {
        instructionLine = instructionLine.replace("R", ",R,");
        instructionLine = instructionLine.replace("L", ",L,");
        return instructionLine.split(",");
    }

    private interface MonkeyMapTraveller {
        State getNextState(Map<Node, Boolean> hasWallMap, State state);
    }

    private static class State {
        public final Node position;
        public final Direction direction;

        State(Node position, Direction direction) {
            this.position = position;
            this.direction = direction;
        }

        public int getPassword() {
            int directionScore = switch (this.direction) {
                case Right -> 0;
                case Down -> 1;
                case Left -> 2;
                case Up -> 3;
            };

            return 1000 * (this.position.y + 1) + 4 * (this.position.x + 1) + directionScore;
        }
    }
}
