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

    static public HashMap<String, Integer> pressures = new HashMap<>();
    static public DualKeyMap<String, Integer> directDuration = new DualKeyMap<>();
    static public HashMap<String, List<String>> connection = new HashMap<>();

    public static void main(String[] args) {
        (new Day_16()).run();
    }

    public SolutionPair solve(String input) {
        parseInputToGenerateConnectionsAndPressures(input);
        generateAndSaveDirectConnectionMap();

        List<Route> activeRoutes = new ArrayList<>();
        activeRoutes.add(Route.fromNode("AA"));

        Set<String> allNodes = pressures.keySet();
        int maxPressurePartOne = 0;
        Map<Set<String>, Integer> finalPossiblePressuresPartTwo = new HashMap();

        while (!activeRoutes.isEmpty()) {
            List<Route> nextActiveRoutes = new ArrayList<>();
            for (Route route : activeRoutes) {

                List<Route> toAdd = new ArrayList<>();
                for (String node : allNodes) {
                    if (!route.canVisit(node, 30)) continue;
                    toAdd.add(route.add(node));
                }
                nextActiveRoutes.addAll(toAdd);

                if (toAdd.isEmpty()) {
                    int routePressure = route.calculatePressureAt(30);
                    if (routePressure > maxPressurePartOne) {
                        maxPressurePartOne = routePressure;
                    }
                }

                long nextRoutesPartTwo = toAdd.stream().filter(x -> x.timeTaken <= 26).count();
                if (nextRoutesPartTwo == 0) {
                    Set<String> set = route.getAllNodes();
                    Integer currentValue = finalPossiblePressuresPartTwo.getOrDefault(set, null);
                    int routePressure = route.calculatePressureAt(26);
                    if (currentValue == null || currentValue < routePressure) {
                        finalPossiblePressuresPartTwo.put(set, routePressure);
                    }
                }

            }
            activeRoutes = nextActiveRoutes;
        }

        int partTwoMaxPressure = 0;
        List<Set<String>> sortedRoutes = finalPossiblePressuresPartTwo
                .entrySet()
                .stream()
                .sorted((x,y) -> x.getValue() > y.getValue() ? -1: 1)
                .map(x -> x.getKey())
                .collect(Collectors.toList());
        while (!sortedRoutes.isEmpty()) {
            Set<String> routeA = sortedRoutes.remove(0);
            int routePressureA = finalPossiblePressuresPartTwo.get(routeA);

            if (routePressureA < partTwoMaxPressure) break;

            for (Set<String> routeB: sortedRoutes) {
                boolean overlap = routeB.stream().anyMatch(x -> routeA.contains(x) && !x.equals("AA"));
                int total = routePressureA + finalPossiblePressuresPartTwo.get(routeB);

                if (!overlap) {
                    if (total > partTwoMaxPressure) {
                        partTwoMaxPressure = total;
                    }
                    break;
                }
            }
        }

        return new SolutionPair(maxPressurePartOne, partTwoMaxPressure);
    }

    private void parseInputToGenerateConnectionsAndPressures(String input) {
        Pattern numbersPattern = Pattern.compile("-?\\d+");
        Pattern tunnelPattern = Pattern.compile("[A-Z][A-Z]+");

        for (String tunnelString : input.split(System.lineSeparator())) {
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
    }

    private void generateAndSaveDirectConnectionMap() {
        List<String> cavesToMap = pressures.keySet().stream().collect(Collectors.toList());

        while (!cavesToMap.isEmpty()) {
            int connectedCount = 0;
            String start = cavesToMap.remove(0);
            HashSet<String> current = new HashSet<>();
            current.add(start);
            HashSet<String> visited = new HashSet<>();
            visited.add(start);
            int steps = 0;

            while (cavesToMap.size() != connectedCount) {
                steps++;

                HashSet<String> newCurrent = new HashSet<>();
                for (String cur : current) {
                    for (String connected : connection.get(cur)) {
                        if (visited.contains(connected)) continue;
                        newCurrent.add(connected);
                        visited.add(connected);

                        if (cavesToMap.contains(connected)) {
                            connectedCount++;
                            directDuration.put(start, connected, steps);
                        }
                    }
                    current = newCurrent;
                }

            }
        }
    }

    static class Route {
        static public Route fromNode(String node) {
            List<String> path = new ArrayList<>();
            path.add(node);
            return new Route(path, 0);
        }

        public final int timeTaken;

        public String getCurrentNode() {
            return this.path.get(this.path.size() - 1);
        }

        public Route add(String node) {
            List<String> clonedPath = new ArrayList(this.path);
            clonedPath.add(node);

            int newTime = this.timeTaken + Day_16.directDuration.get(node, this.getCurrentNode()) + 1;
            return new Route(clonedPath, newTime);
        }

        public Set<String> getAllNodes() {
            return this.path.stream().collect(Collectors.toSet());
        }

        public boolean canVisit(String node, int time) {
            if (this.path.contains(node)) return false;
            int totalTimeTaken = this.timeTaken + Day_16.directDuration.get(this.getCurrentNode(), node) + 1;
            int timeRemaining = time - totalTimeTaken;
            return timeRemaining > 0;
        }

        public int calculatePressureAt(int time) {
            int totalPressure = 0;
            int currentTime = 0;

            for (int i = 0; i < this.path.size() - 1; i++) {
                int pressure = Day_16.pressures.get(this.path.get(i + 1));
                currentTime += Day_16.directDuration.get(this.path.get(i + 1), this.path.get(i)) + 1;
                totalPressure += (time - currentTime) * pressure;
            }
            return totalPressure;
        }

        private final List<String> path;

        private Route(List<String> path, int timeTaken) {
            this.path = path;
            this.timeTaken = timeTaken;
        }
    }
}
