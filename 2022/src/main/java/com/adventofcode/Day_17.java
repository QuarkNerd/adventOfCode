package com.adventofcode;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.stream.IntStream;

public class Day_17 extends SolverBase {
    public static void main(String[] args) { (new Day_17()).run(); }

    // bottom left corner is 0,0
//    Set<String> set= new HashSet<>();

    public SolutionPair solve(String input) {
//        input = ">>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>";
//        1514285714288
//        1000000000000
        String[] spl = input.split("");
        long rocksAtRest = 0;

        int step = 0;
        Set<Node> posRest = new HashSet<>();
        Map<String, long[]> shapemem = new HashMap<>();
        int highestRock = -1;
//        boolean once = false;
        // highestRock / rocksAtREst
        long oldRocksAtRest = 0;
        String store = null;
//        Long qq = null;
        while (rocksAtRest < 2022)  {


            int x = 2;
            int y = highestRock + 4;

            if (rocksAtRest > oldRocksAtRest && rocksAtRest%5 == 0 && rocksAtRest%1715 == 1000000000000L%1715 ) {
                String h = getTopThreeLines(posRest, highestRock);

//                if (store == null) {
//                    store = h;
//                    qq = (long)highestRock;
//                } else if (store == h){
//                    System.out.println(((long)highestRock - qq) + ": highestRock");
//                    qq = (long)highestRock;
//                }

                long[] qq = shapemem.get(h);
//
//                2041770: highestRock
//                2690: dif
//                1301700: rocksAtRest
//                1715: dif
                if (qq != null) {
                    System.out.println(highestRock + ": highestRock");
//                    System.out.println(qq[0] + ": highestRock");
                    System.out.println(highestRock - qq[0] + ": dif");

                    System.out.println(rocksAtRest + ": rocksAtRest");
//                    System.out.println(qq[1] + ": rocksAtRest");
                    System.out.println(rocksAtRest - qq[1] + ": dif");
                }

                oldRocksAtRest = rocksAtRest;

                shapemem.put(h, new long[] {highestRock, rocksAtRest});
            }

            Set<Node> rock = getRock(2, highestRock + 4, true);
            while (true) {
                String nextMovement = spl[step];
                step = (step+1)%spl.length;

                int newX;
                if (nextMovement.equals(">")) {
                    newX = x +1;
                } else {
                    newX = x-1;
                }

                Set<Node> potentialRock = getRock(newX, y, false);

                if (!potentialRock.stream().anyMatch(r -> posRest.contains(r) || r.x < 0 || r.x >= 7)) {
                    rock = potentialRock;
                    x=newX;
                }

                y--;

                Set<Node> potentialRockTwo = getRock(x, y, false);

                if (potentialRockTwo.stream().anyMatch(r -> posRest.contains(r) || r.y < 0)) {
                    posRest.addAll(rock);
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

                rock = potentialRockTwo;
            }
        }
        int finalHighestRock1 = highestRock;
        IntStream.range(0,7).forEach(xo ->
        {
            System.out.println(posRest.contains(new Node(xo, finalHighestRock1)));
        });
        return new SolutionPair(
                highestRock + 1,
                null
        );
    }

    public static int rockNum = -1;
    public static Set<Node> getRock(int x, int y, boolean next) {
        if (next) {
            rockNum++;
        }

        HashSet<Node> rock = new HashSet<>();
        switch (rockNum % 5) {
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

//        String[] rocks = new String[] {"####",
//
//.#.
//###
//.#.
//
//..#
//..#
//###
//
//#
//#
//#
//#
//
//##
//##

    private String getTopThreeLines(Set<Node> posRest, int highestRock) {
//        int tttt = 0;
        String st = "";
        for (int i = 0; i < 7*14; i++) {
            int x = i%7;
            int y = highestRock - i/7;

            st += posRest.contains(new Node(x, y)) ? "#" : " ";
        }
        return st;
    }
}

