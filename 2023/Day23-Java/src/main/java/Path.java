import java.util.HashSet;
import java.util.Set;

public class Path {
    private Set<Coor> past;
    private Coor mostRecent;
    private Integer length;

    public Path(Coor initial) {
        this.past = new HashSet<>();
        this.length = 0;
        this.mostRecent = initial;
    }

    private Path(Coor mostRecent, Set<Coor> past, Integer length) {
        this.past = past;
        this.length = length;
        this.mostRecent = mostRecent;
    }

    public Coor getMostRecent() {
        return this.mostRecent;
    }

    public boolean canAddNode(Coor node) {
        return !this.past.contains(node) && this.mostRecent != node;
    }

    public Path getNewWith(Coor next, int dist) {
        var past = new HashSet<>(this.past);
        past.add(this.mostRecent);
        return new Path(next, past, this.length + dist);
    }

    public int getLength() {
        return this.length;
    }

    public boolean equals(Object o) {
        if (o == this) return true;
        if (!(o instanceof Path)) return false;
        var other = (Path) o;
        return other.past.equals(this.past) && other.mostRecent.equals(this.mostRecent);
    }

    public final int hashCode() {
        int result = 17;
//        result = 31 * result + this.length;
        result = 31 * result + this.mostRecent.hashCode();
        result = 31* result * this.past.hashCode();
        return result;
    }
}
