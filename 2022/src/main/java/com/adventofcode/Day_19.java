package com.adventofcode;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

// Couldnt get part two under 1s, takes about 7s;
public class Day_19 extends SolverBase {
    public static void main(String[] args) { (new Day_19()).run(); }
    
    protected SolutionPair solve(String input) {
        String[] spl = input.split(System.lineSeparator());

        int partOneSol = 0;
        for (int i = 0; i < spl.length; i++) {
            int max = getMaxGeodes(new BluePrint(spl[i]), 24);
            partOneSol += (i+1)*max;
        }

        int partTwoSol = 1;
        for (int i = 0; i < 3; i++) {
            int max = getMaxGeodes(new BluePrint(spl[i]), 32);
            partTwoSol *= max;
        }
        return new SolutionPair(partOneSol, partTwoSol);
    }


    public int getMaxGeodes(BluePrint bl, int timeRun) {
        List<State> current = new ArrayList<>();
        current.add(new State());

        AtomicInteger MaxMin = new AtomicInteger();
        while (!current.isEmpty()) {
            current = current
                    .stream()
                    .flatMap(x -> x.getNextStates(bl).stream())
                    .filter(x ->
                        {
                            // Evil side effects
                            int minHere = x.minimumGeodesAt(timeRun, bl);
                            if (minHere > MaxMin.get()) {
                                MaxMin.set(minHere);
                            }
                            return x.time < timeRun;
                        })
                    .filter(x -> x.maximumGeodesAt(timeRun, bl) > MaxMin.get())
                    .toList();
        }
        return MaxMin.get();
    }
}

class State {
    public int oreRobots = 1;
    public int oreCount = 0;
    public int clayRobots = 0;
    public int clayCount = 0;
    public int obsidianCount = 0;
    public int obsidianRobots = 0;
    public int geodeRobots = 0;
    public int geodeCount = 0;
    public int time = 0;

    public List<State> getNextStates(BluePrint bluePrint) {
        List<State> states = new ArrayList<>();

        {   // stateToMakeOreRobot
            int oreDeficit = bluePrint.oreRobotOreCost - this.oreCount;
            int timeToMake = 1;
            if (oreDeficit > 0) {
                timeToMake = oreDeficit / this.oreRobots + 1;
                if (oreDeficit % this.oreRobots != 0) timeToMake++;
            }
            State newState = this.getThisAtTime(timeToMake);
            newState.oreCount -= bluePrint.oreRobotOreCost;
            newState.oreRobots++;
            states.add(newState);
        }

        {   // stateToMakeClayRobot
            int oreDeficit = bluePrint.clayRobotOreCost - this.oreCount;
            int timeToMake = 1;
            if (oreDeficit > 0) {
                timeToMake = oreDeficit / this.oreRobots + 1;
                if (oreDeficit % this.oreRobots != 0) timeToMake++;
            }
            State newState = this.getThisAtTime(timeToMake);
            newState.oreCount -= bluePrint.clayRobotOreCost;
            newState.clayRobots++;
            states.add(newState);
        }

        if (this.clayRobots == 0) return states;

        {   // stateToMakeObsidianRobot
            int oreDeficit = bluePrint.obsidianRobotOreCost - this.oreCount;
            int clayDeficit = bluePrint.obsidianRobotClayCost - this.clayCount;
            int timeToMake = 1;
            if (oreDeficit > 0 || clayDeficit > 0) {
                timeToMake = oreDeficit / this.oreRobots + 1;
                if (oreDeficit % this.oreRobots != 0) timeToMake++;

                int timeToCollectClay = clayDeficit / this.clayRobots + 1;
                if (clayDeficit % this.clayRobots != 0) timeToCollectClay++;

                if (timeToCollectClay > timeToMake) timeToMake = timeToCollectClay;
            }

            State newState = this.getThisAtTime(timeToMake);
            newState.oreCount -= bluePrint.obsidianRobotOreCost;
            newState.clayCount -= bluePrint.obsidianRobotClayCost;
            newState.obsidianRobots++;
            states.add(newState);
        }

        if (this.obsidianRobots == 0) return states;

        {
            int oreDeficit = bluePrint.geodeRobotOreCost - this.oreCount;
            int obsidianDeficit = bluePrint.geodeRobotObsidianCost - this.obsidianCount;
            int timeToMake = 1;
            if (oreDeficit > 0 || obsidianDeficit > 0) {
                timeToMake = oreDeficit / this.oreRobots + 1;
                if (oreDeficit % this.oreRobots != 0) timeToMake++;

                int timeToCollectObsidian = obsidianDeficit / this.obsidianRobots + 1;
                if (obsidianDeficit % this.obsidianRobots != 0) timeToCollectObsidian++;

                if (timeToCollectObsidian > timeToMake) timeToMake = timeToCollectObsidian;
            }

            State newState = this.getThisAtTime(timeToMake);
            newState.oreCount -= bluePrint.geodeRobotOreCost;
            newState.obsidianCount -= bluePrint.geodeRobotObsidianCost;
            newState.geodeRobots++;
            states.add(newState);
        }
        return states;
    }

    public int minimumGeodesAt(int t, BluePrint bl) {
        return geodeCount + (t - time) * geodeRobots;
    }

    public int maximumGeodesAt(int finalTime, BluePrint bl) {
        // Calculation based on infinite ore
        int clayCount = this.clayCount;
        int clayRobots = this.clayRobots;
        int geodeCount = this.geodeCount;
        int geodeRobots = this.geodeRobots;
        int obsidianRobots = this.obsidianRobots;
        int obsidianCount = this.obsidianCount;
        for (int t = time + 1; t <= finalTime; t++) {
            geodeCount += geodeRobots;
            obsidianCount += obsidianRobots;
            clayCount += clayRobots;

            if (obsidianCount > bl.geodeRobotObsidianCost) {
                geodeRobots++;
            } else if (clayCount > bl.obsidianRobotClayCost){
                obsidianRobots++;
            } else {
                clayRobots++;
            }
        }
        return geodeCount;
    }

    private State getThisAtTime(int t) {
        State copy = new State();
        copy.time = this.time + t;

        copy.oreCount = oreRobots * t + oreCount;
        copy.oreRobots = oreRobots;

        copy.clayCount = clayRobots * t + clayCount;
        copy.clayRobots = clayRobots;

        copy.obsidianCount = obsidianCount + obsidianRobots * t;
        copy.obsidianRobots = obsidianRobots;

        copy.geodeCount = geodeRobots * t + geodeCount;
        copy.geodeRobots = geodeRobots;

        return copy;
    }
}

class BluePrint {
    public final int oreRobotOreCost;
    public final int clayRobotOreCost;
    public final int obsidianRobotOreCost;
    public final int obsidianRobotClayCost;
    public final int geodeRobotOreCost;
    public final int geodeRobotObsidianCost;

    private static final Pattern numbersPattern = Pattern.compile("-?\\d+");
    BluePrint(String inp) {
        Matcher inputMatcher = numbersPattern.matcher(inp);
        inputMatcher.find();
        inputMatcher.find();
        this.oreRobotOreCost = Integer.parseInt(inputMatcher.group());
        inputMatcher.find();
        this.clayRobotOreCost = Integer.parseInt(inputMatcher.group());
        inputMatcher.find();
        this.obsidianRobotOreCost = Integer.parseInt(inputMatcher.group());
        inputMatcher.find();
        this.obsidianRobotClayCost = Integer.parseInt(inputMatcher.group());
        inputMatcher.find();
        this.geodeRobotOreCost = Integer.parseInt(inputMatcher.group());
        inputMatcher.find();
        this.geodeRobotObsidianCost = Integer.parseInt(inputMatcher.group());
    }
}
