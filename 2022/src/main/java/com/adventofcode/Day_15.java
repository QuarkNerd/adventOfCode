package com.adventofcode;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Stream;

public class Day_15 extends SolverBase {
    public static void main(String[] args) { (new Day_15()).run(); }

    public SolutionPair solve(String input) {
        List<DataPoint> dataPointList = Arrays.stream(input.split(System.lineSeparator())).map(x -> new DataPoint(x)).toList();
        return new SolutionPair(solvePartOne(dataPointList), solvePartTwo(dataPointList));
    }

    private static long solvePartOne(List<DataPoint> dataPointList) {
        int yPartOne = 2000000;
        Set<Integer> partOnePoints = new HashSet<>();

        for (DataPoint dataPoint: dataPointList) {
            int distX = dataPoint.dist - Math.abs(dataPoint.sensor.y - yPartOne);
            if (distX < 0) {
                continue;
            }

            for (int x=dataPoint.sensor.x - distX; x <= dataPoint.sensor.x + distX; x++) {
                if (x != dataPoint.beacon.x || yPartOne != dataPoint.beacon.y) partOnePoints.add(x);
            }
        }
        return partOnePoints.size();
    }

    private static long solvePartTwo(List<DataPoint> dataPointList) {
        for (int i = 0; i < dataPointList.size(); i++) {
            DataPoint pointOne = dataPointList.get(i);
            for (int j = 1; j < dataPointList.size(); j++) {
                List<Node> intersectionPoints = pointOne.getBlobsAroundIntersections(dataPointList.get(j));
                for (Node interPoint: intersectionPoints) {
                    if (interPoint.x < 0 || interPoint.x > 4000000 || interPoint.y < 0 || interPoint.y > 4000000) continue;

                    boolean isPossible = true;
                    for (DataPoint dataPoint : dataPointList) {
                        if (!dataPoint.isPossible(interPoint.x, interPoint.y)) {
                            isPossible = false;
                            break;
                        }
                    }

                    if (isPossible) {
                        return (long)interPoint.x*4000000 + (long)interPoint.y;
                    }
                }
            }
        }
        return 0;
    }

    // returns null if none
    // assumes gradients of 1 and -1
    // could be sped up by filtering to see if intersection is in range
    private static Double[] getLineIntersection(
            Node negativeLineNode,
            Node positiveLineNode) {

        double theoreticalX = (positiveLineNode.x - positiveLineNode.y + negativeLineNode.x + negativeLineNode.y)/2;

        double y = theoreticalX - positiveLineNode.x + positiveLineNode.y;
        return new Double[] {theoreticalX, y};
    }

    // takes a point in space. If the point is at a whole number, returns the 9 nodes that centre it
    // if the point is at 1/2 point, returns the 16 nodes centring it
    private static Stream<Node> getOneOutNodesAroundPoint(Double[] point) {
        int x = (int) Math.floor(point[0]);
        int y = (int) Math.floor(point[1]);

        List<Node> points = new ArrayList<>();

        points.add(new Node(x - 1, y - 1));
        points.add(new Node(x, y - 1));
        points.add(new Node(x + 1, y - 1));
        points.add(new Node(x - 1, y));
        points.add(new Node(x, y));
        points.add(new Node(x + 1, y));
        points.add(new Node(x - 1, y + 1));
        points.add(new Node(x, y + 1));
        points.add(new Node(x + 1, y + 1));

        if (point[0]%1 != 0.) {
            points.add(new Node(x - 1, y - 2));
            points.add(new Node(x, y-2));
            points.add(new Node(x + 1 , y - 2));
            points.add(new Node(x + 2, y - 2));
            points.add(new Node(x + 2, y - 1));
            points.add(new Node(x + 2, y));
            points.add(new Node(x + 2, y + 1));
        }

        return points.stream();
    }

    static class DataPoint {
        public final Node sensor;
        public final Node beacon;

        public final int dist;

        public boolean isPossible(int x, int y) {
            int dist = Math.abs(this.sensor.x - x) + Math.abs(this.sensor.y - y);
            return dist > this.dist;
        }

        private static final Pattern numbersPattern = Pattern.compile("-?\\d+");
        DataPoint(String inp) {
            Matcher inputMatcher = numbersPattern.matcher(inp);
            inputMatcher.find();
            int sensorX = Integer.parseInt(inputMatcher.group());
            inputMatcher.find();
            int sensorY = Integer.parseInt(inputMatcher.group());
            this.sensor = new Node(sensorX, sensorY);

            inputMatcher.find();
            int beaconX = Integer.parseInt(inputMatcher.group());
            inputMatcher.find();
            int beaconY = Integer.parseInt(inputMatcher.group());
            this.beacon = new Node(beaconX, beaconY);

            this.dist = Math.abs(this.sensor.x - this.beacon.x) + Math.abs(this.sensor.y - this.beacon.y);
        }

        private List<Node> getBlobsAroundIntersections(DataPoint other) {
            Corners thisCorners = this.getCorners();
            Corners otherCorners = other.getCorners();

            return Stream.of(
                getLineIntersection(thisCorners.Top, otherCorners.Top),
                getLineIntersection(otherCorners.Top, thisCorners.Top),
                getLineIntersection(thisCorners.Bottom, otherCorners.Bottom),
                getLineIntersection(otherCorners.Bottom, thisCorners.Bottom),
                getLineIntersection(thisCorners.Top, otherCorners.Bottom),
                getLineIntersection(otherCorners.Bottom, thisCorners.Top),
                getLineIntersection(thisCorners.Bottom, otherCorners.Top),
                getLineIntersection(otherCorners.Top, thisCorners.Bottom)
            ).filter(Objects::nonNull)
            .flatMap(Day_15::getOneOutNodesAroundPoint).toList();
        }

        private Corners getCorners() {
            return new Corners(
                new Node(this.sensor.x, this.sensor.y - this.dist),
                new Node(this.sensor.x, this.sensor.y + this.dist)
            );
        }
    }

    static class Corners {
        public final Node Top;
        public final Node Bottom;

        Corners(Node top, Node bottom) {
            Top = top;
            Bottom = bottom;
        }
    }
}
