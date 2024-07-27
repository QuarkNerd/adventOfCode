public enum Tile {
    Path('.'),
    Forest('#'),
    NorthSlope('^'),
    EastSlope('>'),
    SouthSlope('v'),
    WestSlope('<');

    private final char name;

    Tile(char name) {
        this.name = name;
    }

    public static Tile fromValue(int cha) {
        for (Tile tile : values()) {
            if (tile.name == cha) {
                return tile;
            }
        }
        throw new RuntimeException("Fail");
    }
}