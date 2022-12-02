package com.adventofcode;

public abstract class SolverBase {
    protected abstract SolutionPair solve(String input);

    protected void run(String inputFilename) {
        String input = Util.getInput(inputFilename);
        long startTime = System.currentTimeMillis();
        SolutionPair solution = this.solve(input);
        long endTime = System.currentTimeMillis();
        long totalTime = endTime - startTime;

        System.out.println("Execution time in milliseconds: " + totalTime);
        solution.print();
    }
}
