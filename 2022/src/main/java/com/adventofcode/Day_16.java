package com.adventofcode;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

public class Day_16 extends SolverBase {
    public static void main(String[] args) { (new Day_16()).run(); }

    public SolutionPair solve(String input) {
        HashMap<String, Integer> pressures = new HashMap<>();
        HashMap<String, List<String>> connection = new HashMap<>();

        Pattern numbersPattern = Pattern.compile("-?\\d+");
        Pattern tunnelPattern = Pattern.compile("[A-Z][A-Z]+");

        for (String tunnelString: input.split(System.lineSeparator())) {
            Matcher tunnelMatcher = tunnelPattern.matcher(tunnelString);
            tunnelMatcher.find();
            String tunnel = tunnelMatcher.group();

            List<String> connections = new ArrayList<>();

            while (tunnelMatcher.find()) {
                connections.add(tunnelMatcher.group());
            }

            connection.put(tunnel, connections);

            Matcher numberMatcher = numbersPattern.matcher(tunnelString);
            numberMatcher.find();
            int num = Integer.parseInt(numberMatcher.group());

            if (num > 0 || tunnel.equals("AA")) {
                pressures.put(tunnel, num);
            }

        }

        List<String> bb = pressures.keySet().stream().collect(Collectors.toList());

        DualKeyMap<String, Integer> directDist = new DualKeyMap<>();

        while (!bb.isEmpty()) {
            int connectedCount =0;
            String start = bb.remove(0);
            HashSet<String> current = new HashSet<>();
            current.add(start);
            HashSet<String> visited = new HashSet<>();
            visited.add(start);
            int steps = 0;

            while (bb.size() != connectedCount) {
                steps++;

                HashSet<String> newCurrent = new HashSet<>();
                for (String cur: current) {
                    for(String connected: connection.get(cur)) {
                        if (visited.contains(connected)) continue;
                        newCurrent.add(connected);
                        visited.add(connected);

                        if(bb.contains(connected)) {
                            connectedCount++;
                            directDist.put(start, connected, steps);
                        }
                    }
                    current = newCurrent;
                }

            }
        }

        List<Route> current = new ArrayList<>();
        List<String> path = new ArrayList<>();
        path.add("AA");
        current.add(new Route(path, 0, 0));

        Set<String> all = pressures.keySet();
        Set<Route> finall = new HashSet<>();

        while (current.size() > 0) {
            List<Route> newCurrent = new ArrayList<>();
            for(Route b: current) {
                String latest = b.path.get(b.path.size() - 1);
                List<Route> toAdd = new ArrayList<>();

                for (String node: all) {
                    if (b.path.contains(node)) continue;
                    int dist = b.timeTaken +1 + directDist.get(latest, node);
                    int distRemaining = 30-dist;

                    if (distRemaining <= 0) continue;

                    List<String> cloned = new ArrayList(b.path);
                    cloned.add(node);

                    int pressurePlus = (30 - dist)*pressures.get(node);
                    toAdd.add(new Route(cloned, dist, b.pressure + pressurePlus));
                }


                newCurrent.addAll(toAdd);
                if (toAdd.isEmpty()) {
                    finall.add(b);
                }


            }
            current = newCurrent;
        }


//        int ggg = finall.stream().mapToInt(x -> x.pressure).max().orElseThrow(NoSuchElementException::new);;

        List<Route> o= finall.stream().sorted((a, b) -> a.pressure > b.pressure ? -1 : 1).collect(Collectors.toList());

//        int max = 0;
//        for (int i = 0; i < o.size(); i++) {
//           for (int j = i; j < o.size(); j++) {
//               int finalJ = j;
//               B mmmmmmm = o.get(finalJ);
//               long overlapC = o.get(i).path.stream().filter(
//                       x -> mmmmmmm.path.contains(x)
//               ).count();
//
//               if (overlapC == 1) {
//                   int pres = o.get(i).pressure + mmmmmmm.pressure;
//                   if (pres > max) {
//                       max = pres;
//                   }
//               }
//           }
//        }

        return new SolutionPair(o.get(0).pressure, 0);
    }

    class Route {
        public final List<String> path;
        public int timeTaken;
        public int pressure;


        Route(List<String> path, int timeTaken, int pressure) {
            this.path = path;
            this.timeTaken = timeTaken;
            this.pressure = pressure;
        }

        public void print(){
            System.out.println(path);
            System.out.println(pressure);
        }
    }

    class DualKeyMap<K, V> {
        private Map<K, Map<K, V>> inner;

        DualKeyMap() {
            inner = new HashMap<>();
        }

        public void put(K keyOne, K keyTwo, V value) {

            inner.putIfAbsent(keyOne, new HashMap<>());
            inner.get(keyOne).put(keyTwo, value);
            inner.putIfAbsent(keyTwo, new HashMap<>());
            inner.get(keyTwo).put(keyOne, value);
        }

        public V get(K keyOne, K keyTwo) {
            return inner.get(keyOne).get(keyTwo);
        }
    }

}

//                        .flatMap(x -> {
//                             int dist = directDist.get(latest, x);
//                             int distRemaining = 30-(b.dist + 1 + dist);
//                             if (distRemaining <= 0) {
//                                 return Stream.empty();
//                             }
//
//                            List<String> cloned = new ArrayList(b.path);
//                            cloned.add(x);
//
//                            int pressurePlus = (30 - dist)*pressures.get(x);
////                            newCurrent.add(new B(cloned, dist, b.pressure + pressurePlus));
//
//                             return Stream.of(new B(cloned, dist, b.pressure + pressurePlus));
//                        })
