package com.adventofcode;

import java.util.Arrays;

import static com.adventofcode.Direction.*;

public class Day_08 extends SolverBase {
    public static void main(String[] args) { (new Day_08()).run(); }

    public SolutionPair solve(String input) {
        Forrest forrest = new Forrest(input);
        int forrestDepth = forrest.getDepth();
        int forrestWidth = forrest.getWidth();

        int visibleCount = 0;
        int highestScenicScore = 0;
        for (int x = 0; x < forrestWidth; x++) {
            for (int y = 0; y < forrestDepth; y++) {
                Forrest.Visibility visibilityUp = forrest.getVisibility(x, y, Up);
                Forrest.Visibility VisibilityDown = forrest.getVisibility(x, y, Down);
                Forrest.Visibility VisibilityRight = forrest.getVisibility(x, y, Right);
                Forrest.Visibility VisibilityLeft = forrest.getVisibility(x, y, Left);

                int scenicScore = VisibilityDown.visibleTreeCount *
                        VisibilityLeft.visibleTreeCount *
                        visibilityUp.visibleTreeCount *
                        VisibilityRight.visibleTreeCount;
                if (scenicScore > highestScenicScore) { highestScenicScore = scenicScore; }

                if (visibilityUp.isVisibleFromEdge || VisibilityDown.isVisibleFromEdge ||
                    VisibilityRight.isVisibleFromEdge || VisibilityLeft.isVisibleFromEdge) {
                    visibleCount++;
                }
            }
        }
        return new SolutionPair(visibleCount, highestScenicScore);
    }

    class Forrest {
        private final int[][] trees;

        Forrest(String map) {
            trees = Arrays.stream(map.split(System.lineSeparator()))
                    .map(String::chars)
                    .map(line -> line.toArray())
                    .toArray(int[][]::new);
        }

        public int getDepth() {
            return this.trees.length;
        }

        public int getWidth() {
            return this.trees[0].length;
        }

        public Visibility getVisibility(int x, int y, Direction direction) {
            int currentTreeHeight = trees[y][x];
            int xChange = direction.getXChange();
            int yChange = direction.getYChange();

            int searchX = x + xChange;
            int searchY = y + yChange;
            int count = 0;
            while (
                    0 <= searchX && searchX < this.getWidth() &&
                    0 <= searchY && searchY < this.getDepth()
                    ) {
                count += 1;

                if (trees[searchY][searchX] >= currentTreeHeight) {
                    return new Visibility(count, false);
                }
                searchX += xChange;
                searchY += yChange;
            }
            return new Visibility(count, true);
        }

        class Visibility {
            int visibleTreeCount;
            boolean isVisibleFromEdge;

            Visibility(int visibleTreeCount, boolean visibleFromEdge) {
                this.visibleTreeCount = visibleTreeCount;
                this.isVisibleFromEdge = visibleFromEdge;
            }
        }
    }
}
