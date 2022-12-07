package com.adventofcode;

import java.util.HashMap;
import java.util.List;
import java.util.Stack;

public class Day_07 extends SolverBase {
    public static void main(String[] args) { (new Day_07()).run(); }

    public SolutionPair solve(String input) {
        List<String> lines = Util.split(input, System.lineSeparator());

        Stack<String> directory = new Stack<>();
        HashMap<String, Integer> directorySizes = new HashMap<>();

        int lineCount = lines.size();
        for (int i = 0; i < lineCount; i++) {
            String[] spl = lines.get(i).split(" ");

            if (spl[1].equals("ls") || spl[0].equals("dir")) continue;

            if (spl[1].equals("cd")) {
                if (spl[2].equals("..")) {
                    directory.pop();
                } else {
                    String prevDirectory = directory.empty() ? "" : "." + directory.peek();
                    directory.add(prevDirectory + spl[2]);
                }
                continue;
            }
            Integer fileSize = Integer.valueOf(spl[0]);
            directory.stream().forEach(dir -> {
                directorySizes.compute(dir, (key, prevValue) ->
                        prevValue == null ? fileSize : fileSize + prevValue
                );
            });
        }

        System.out.println(directorySizes.keySet());
        int spaceToClear = 30000000 - (70000000 - directorySizes.get("/"));

        return new SolutionPair(
                directorySizes
                        .values()
                        .stream()
                        .filter(size -> size <= 100000)
                        .reduce(0, Integer::sum),
                directorySizes
                        .values()
                        .stream()
                        .filter(size -> size >= spaceToClear)
                        .min(Integer::compare)
                        .get()
        );
    }

}
