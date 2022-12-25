package com.adventofcode;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class Day_20 extends SolverBase {
    public static void main(String[] args) {
        (new Day_20()).run();
    }

    public SolutionPair solve(String input) {
        List<Number> partOneNumbers = Arrays.stream(input.split(System.lineSeparator()))
                .map(Long::valueOf)
                .map(Number::new)
                .collect(Collectors.toList());

        List<Number> partOneOrderReference = partOneNumbers.stream().toList();

        mix(partOneNumbers, partOneOrderReference);

        List<Number> partTwoNumbers = Arrays.stream(input.split(System.lineSeparator()))
                .map(Long::valueOf)
                .map(x -> x * 811589153)
                .map(Number::new)
                .collect(Collectors.toList());

        List<Number> partTwoOrderReference = partTwoNumbers.stream().toList();

        for (int i = 0; i < 10; i++) {
            mix(partTwoNumbers, partTwoOrderReference);
        }

        return new SolutionPair(getGrooveCoordinates(partOneNumbers), getGrooveCoordinates(partTwoNumbers));
    }
    
    public Long getGrooveCoordinates(List<Number> list) {
        Number Zero = list.stream()
                .filter(x -> x.value == 0)
                .findFirst().get();

        int ind = list.indexOf(Zero);
        
        return  list.get((ind+1000)%list.size()).value +
                list.get((ind+2000)%list.size()).value +
                list.get((ind+3000)%list.size()).value;
    }

    public void mix(List<Number> toMix, List<Number> sequence) {
        Long modVal = Long.valueOf(toMix.size() - 1);
        for (Number n : sequence) {
            int index = toMix.indexOf(n);
            Number val = toMix.remove(index);
            Long newindex = Math.floorMod(index + n.value, modVal);
            toMix.add(Math.toIntExact(newindex), val);
        }
    }

    class Number {
        public Long value;

        Number(Long value) {
            this.value = value;
        }
    }
}
