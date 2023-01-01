package com.adventofcode;

import java.util.HashSet;
import java.util.Set;
import java.util.function.Predicate;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class ShortestPathBFS {
        static public <E> Result<E> find(E start, Predicate<E> isEnd, GetConnected<E> getConnected, boolean avoidVisited) {
        long dist = 0;
        Set<E> visited = new HashSet<>();
        Set<E> current = new HashSet<>();
        current.add(start);
        visited.add(start);

            while (!current.isEmpty()) {
                Set<E> next = new HashSet<>();
                for (E node: current) {
                    if (isEnd!= null && isEnd.test(node)) {
                        return new Result<>(dist, true, visited);
                    }


                    Set<E> connected = getConnected.apply(node, dist)
                            .filter(
                                x -> !(avoidVisited && visited.contains(x)) && !next.contains(x)
                            ).collect(Collectors.toSet());

                    visited.addAll(connected);
                    next.addAll(connected);
                }

                current = next;
                dist++;
            }
            return new Result<>(dist, false, visited);
    }
//    return success, return visited, check if node repeating s allowed and take in step function

    static public class Result<E> {
        public final long dist;
        public final boolean success;
        public final Set<E> visited;


        public Result(long dist, boolean success, Set<E> visited) {
            this.dist = dist;
            this.success = success;
            this.visited = visited;
        }
    }

    @FunctionalInterface
    interface GetConnected<E> {
        public Stream<E> apply(E node, long dist);
    }

}
