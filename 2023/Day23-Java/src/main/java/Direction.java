public enum Direction {
    North(-1, 0),
    East(0, 1),
    South(1, 0),
    West(0, -1);

    public final int yChange;
    public final int xChange;

    Direction(int yChange, int xChange) {
        this.yChange = yChange;
        this.xChange = xChange;
    }

    public Direction getOpposite() {
        switch (this) {
            case North:
                return South;
            case South:
                return North;
            case East:
                return West;
            case West:
                return East;
        }
        throw new RuntimeException();
    }
}
