package com.adventofcode;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class Day_18 extends SolverBase {
    public static void main(String[] args) { (new Day_18()).run(); }

    protected SolutionPair solve(String input) {
        HashSet<String> f = new HashSet<>();
        int count = 0;//countExternalSides(Util.split(input, System.lineSeparator()));

        int[] max = new int[3];

        for (String line: input.split(System.lineSeparator())) {
            int[] xyz = Arrays.stream(line.split(",")).mapToInt(Integer::valueOf).toArray();

            for (int i = 0; i < 3; i++) {
                if (xyz[i] > max[i]) {
                    max[i] = xyz[i];
                }
            }

            count+=6;
            long a = getConnected(xyz).stream().filter(con -> f.contains(
                    con[0] + "," + con[1] + "," + con[2])).count();
            count -= 2*a;
            f.add(line);
        }

        Set<String> bfsVisited = new HashSet<>();
        List<int[]> current = new ArrayList<>();
        current.add(new int[]{1,1,1});
        bfsVisited.add("1,1,1");

        while (!current.isEmpty()) {
//            bfsVisited.addAll(current.stream().map(this::c).toList());

            List<int[]> newCurrent = new ArrayList<>();

            for (int[] node: current) {
                List<int[]> con = getConnected(node).stream().filter(
                        x -> {
                            for (int i = 0; i < 3; i++) {
                                if (x[i] < 0 || x[i] > 20) return false;
                            }

                            String cc = c(x);
                            boolean b = !bfsVisited.contains(cc);
                            boolean a = !f.contains(cc);

                            return b && a;
                        }).toList();

                bfsVisited.addAll(con.stream().map(this::c).toList());
                newCurrent.addAll(con);
            }

            current = newCurrent;

//            current = current.stream().flatMap(x -> getConnected(x).stream()).filter
        }

        Set<String> pocketed = new HashSet<>();

        for (int x = 0; x < 21; x++) {
            for (int y = 0; y < 21; y++) {
                for (int z = 0; z < 21; z++) {
                    String cube = x + "," + y + "," + z;
                    if (!bfsVisited.contains(cube) && !f.contains(cube)) pocketed.add(cube);
                }
            }
        }

        int ggg = countExternalSides(pocketed);



        return new SolutionPair(count, count - ggg);
    }

    private List<int[]> getConnected(int[] cube) {
        List<int[]> connected = new ArrayList<>();
        int[] pp = new int[] {-1,1};
        for (int dx: pp) {
            int x = cube[0] + dx;
            connected.add(new int[] {x, cube[1], cube[2]});
        }
        for (int dy: pp) {
            int y = cube[1] + dy;
            connected.add(new int[] {cube[0], y, cube[2]});
        }
        for (int dz: pp) {
            int z = cube[2] + dz;
            connected.add(new int[] {cube[0], cube[1], z});
        }
        return connected;
    }

    public String c(int[] c) {
        return c[0] + "," + c[1] + "," +c[2];
    }

    public int countExternalSides(Collection<String> cubes) {
        HashSet<String> f = new HashSet<>();
        int count = 0;

        int[] max = new int[3];

        for (String line: cubes) {
            int[] xyz = Arrays.stream(line.split(",")).mapToInt(Integer::valueOf).toArray();

            for (int i = 0; i < 3; i++) {
                if (xyz[i] > max[i]) {
                    max[i] = xyz[i];
                }
            }

            count+=6;
            long a = getConnected(xyz).stream().filter(con -> f.contains(
                    con[0] + "," + con[1] + "," + con[2])).count();
            count -= 2*a;
            f.add(line);
        }
        return count;
    }
}
