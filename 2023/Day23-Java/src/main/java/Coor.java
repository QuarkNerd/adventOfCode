public class Coor {
    public final int x;
    public final int y;

    public Coor(int x, int y) {
        this.x = x;
        this.y = y;
    }

    public boolean equals(Object o) {
        if (o == this) return true;
        if (!(o instanceof Coor)) return false;
        Coor other = (Coor) o;
        return other.x == this.x && other.y == this.y;
    }

    public final int hashCode() {
        int result = 17;
        result = 31 * result + this.x;
        result = 31 * result + this.y;
        return result;
    }

    @Override
    public String toString() {
        return "Coor{" +
                "x=" + x +
                ", y=" + y +
                '}';
    }
}
