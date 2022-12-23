package com.adventofcode;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class Day_23 extends SolverBase {
    public static void main(String[] args) {
        (new Day_23()).run();
    }

    static Direction[] dirOrder = new Direction[] {
        Direction.Up, Direction.Down, Direction.Left, Direction.Right
    };

    public SolutionPair solve(String input) {
        String[] spl = input.split(System.lineSeparator());
        Set<Node> elves = new HashSet<>();
        for (int i = 0; i < spl.length; i++) {
            String[] spaces = spl[i].split("");
            for (int j = 0; j < spaces.length; j++) {
                if (spaces[j].equals("#")) elves.add(new Node(j,i));
            }
        }

        int partOne = 0;
        int partTwo = 0;

        for (int round = 0; round < 1000; round++) {
            Map<Node, List<Node>> currentByProposedPositions = new HashMap();

            for (Node elf: elves) {
                Set<EightWayDirection> freeSquares = getFreeSquares(elves, elf);

                if (freeSquares.size() == 8) {
                    currentByProposedPositions.put(elf, List.of(elf));
                    continue;
                }
                boolean added = false;
                for (int directionNum = 0; directionNum < 4; directionNum++) {
                    Direction directionToCheck = dirOrder[(directionNum+round)%4];
                    if (checkDirection(freeSquares, directionToCheck)) {
                        Node newElf = new Node(elf.x + directionToCheck.getXChange(), elf.y + directionToCheck.getYChange());

                        currentByProposedPositions.putIfAbsent(newElf, new ArrayList<>());
                        currentByProposedPositions.get(newElf).add(elf);
                        added = true;
                        break;
                    }
                }
                if (!added) currentByProposedPositions.put(elf, List.of(elf));
            }

            boolean anyMove = false;
            elves = new HashSet<>();
            for (Map.Entry<Node, List<Node>> entry: currentByProposedPositions.entrySet()) {
                List<Node> value = entry.getValue();
                if (value.size() == 1) {
                    if (!entry.getKey().equals(value.get(0))) {anyMove = true;}
                    elves.add(entry.getKey());
                } else {
                    elves.addAll(value);
                }
            }
            if (!anyMove) {
                partTwo = round+1;
                break;
            }
            if (round == 9) {
                int minX = 1000;
                int maxX = -1000;
                int minY = 1000;
                int maxY = -1000;

                for (Node e: elves) {
                    if (e.x > maxX) maxX = e.x;
                    if (e.x < minX) minX = e.x;
                    if (e.y > maxY) maxY = e.y;
                    if (e.y < minY) minY = e.y;
                }

                partOne = (1+ maxY - minY)*(1+ maxX - minX) - elves.size();
            }
        }

        return new SolutionPair(partOne,partTwo);
    }

    private Set<EightWayDirection> getFreeSquares(Set<Node> allElves, Node elf) {
        return Stream.of(EightWayDirection.UpLeft, EightWayDirection.Up, EightWayDirection.UpRight, EightWayDirection.Left, EightWayDirection.Right, EightWayDirection.DownLeft, EightWayDirection.Down, EightWayDirection.DownRight)
//                .map(x -> !allElves.contains(getNeighbor(elf, x)))
                .filter(x -> !allElves.contains(getNeighbor(elf, x))).collect(Collectors.toSet());
    }

//    private boolean checkAll(Set<Node> allElves, Node elf) {
//        return Stream.of(EightWayDirection.UpLeft, EightWayDirection.Up, EightWayDirection.UpRight, EightWayDirection.Left, EightWayDirection.Right, EightWayDirection.DownLeft, EightWayDirection.Down, EightWayDirection.DownRight)
//                .noneMatch(x -> allElves.contains(getNeighbor(elf, x)));
//    }

    private boolean checkDirection(Set<EightWayDirection> freeSquares, Direction dir) {
        Stream<EightWayDirection> locationsToCheck = switch (dir) {
            case Up -> Stream.of(EightWayDirection.UpLeft,EightWayDirection.Up, EightWayDirection.UpRight);
            case Right -> Stream.of(EightWayDirection.UpRight, EightWayDirection.Right, EightWayDirection.DownRight);
            case Down -> Stream.of(EightWayDirection.DownLeft, EightWayDirection.Down, EightWayDirection.DownRight);
            case Left -> Stream.of(EightWayDirection.UpLeft, EightWayDirection.Left, EightWayDirection.DownLeft);
        };

        return locationsToCheck.allMatch(freeSquares::contains);
    }

//    private boolean checkDirection(Set<Node> allElves, Node elf, Direction dir) {
//        Stream<EightWayDirection> locationsToCheck = switch (dir) {
//            case Up -> Stream.of(EightWayDirection.UpLeft,EightWayDirection.Up, EightWayDirection.UpRight);
//            case Right -> Stream.of(EightWayDirection.UpRight, EightWayDirection.Right, EightWayDirection.DownRight);
//            case Down -> Stream.of(EightWayDirection.DownLeft, EightWayDirection.Down, EightWayDirection.DownRight);
//            case Left -> Stream.of(EightWayDirection.UpLeft, EightWayDirection.Left, EightWayDirection.DownLeft);
//        };
//
//        return locationsToCheck.noneMatch(diri -> allElves.contains(getNeighbor(elf, diri)));
//    }

    private Node getNeighbor(Node elf, EightWayDirection direction) {
        return switch (direction) {
            case UpLeft -> new Node(elf.x-1, elf.y-1);
            case Up -> new Node(elf.x, elf.y-1);
            case UpRight -> new Node(elf.x+1, elf.y -1);
            case Right -> new Node(elf.x+1, elf.y);
            case Left -> new Node(elf.x-1, elf.y);
            case DownLeft -> new Node(elf.x-1, elf.y+1);
            case Down -> new Node(elf.x, elf.y+1);
            case DownRight -> new Node(elf.x+1, elf.y +1);
        };
    }

    private enum EightWayDirection {
        UpLeft,
        Up,
        UpRight,
        Right,
        DownRight,
        Down,
        DownLeft,
        Left
    }
}
