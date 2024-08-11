using MathNet.Numerics.LinearAlgebra;
using MathNet.Numerics.LinearAlgebra.Double;

// x_n + t * dx_n = x + t * dx. Where x_n /dx_n are the x position and the x velocity of the nth hailstone. d/dx same for throwing stone
// Mix with same for y, eliminate t
// Use another stone to elimnate terms with multiple variable (sdt, ydx)
// Use more stones to create set of 4 equations with 4 unknowns, solve with matricies
// repeat with x and z

double min = 200000000000000;
double max = 400000000000000;

string readText = File.ReadAllText("./input");

Hailstone[] stones = readText.Split(new string[] { Environment.NewLine }, StringSplitOptions.None).Select(Hailstone.fromString).ToArray();

int g = 0;
for (int i = 0; i < stones.Length; i++)
{
    Hailstone one = stones[i];
    for (int j = i + 1; j < stones.Length; j++)
    {
        Hailstone two = stones[j];
        Coor? inter = one.getXYintersection(two);
        if (inter == null) continue;
        double tone = one.getTAtx(inter.val[Axis.X]);
        double ttwo = two.getTAtx(inter.val[Axis.X]);
        if (min < inter.val[Axis.X] && min < inter.val[Axis.Y] && inter.val[Axis.X] < max && inter.val[Axis.Y] < max && tone > 0 && ttwo > 0)
        {
            g++;
        }
    }
}

Console.WriteLine("Part one: " + g);

Vector<Double> result = resultt(stones, Axis.X, Axis.Y, 0);
Vector<Double> result2 = resultt(stones, Axis.Y, Axis.Z, 0);

var dx = (long)result[0];
var dy = (long)result[2];
var dz = (long)result2[2];

// These are initial guesses due to double precison and MathNet not being compatible with long or decimal
var x = (long)result[1];
var y = (long)result[3];
var z = (long)result2[3];

for (long testX = x - 1000; testX < x + 1000; testX++) 
{
    long time = (((long)stones[0].postion[Axis.X] - testX)/(dx - (long)stones[0].velocity[Axis.X]));

    long potentialY = (long)stones[0].postion[Axis.Y] + ((long)stones[0].velocity[Axis.Y] - dy)*time;
    long potentialZ =  (long)stones[0].postion[Axis.Z] + ((long)stones[0].velocity[Axis.Z] - dz)*time;

    var found = true;
    foreach(Hailstone stone in stones) {
        long tim = (((long)stone.postion[Axis.X] - testX)/(dx - (long)stone.velocity[Axis.X]));
        long alternateY = (long)stone.postion[Axis.Y] + ((long)stone.velocity[Axis.Y] - dy)*tim;
        long alternateZ =  (long)stone.postion[Axis.Z] + ((long)stone.velocity[Axis.Z] - dz)*tim;

        if (Math.Abs(potentialY - alternateY) > 10 || Math.Abs(potentialZ - ewZ) > 10 ) {
            found = false;
        }
    }

    if (found) {
        Console.WriteLine("Part two: " + (testX + newY + newZ));
        break;
    }
}

static Vector<Double> resultt(Hailstone[] stones, Axis axis1, Axis axis2, int baseStone) {

    double[] first = matrixRow(stones[baseStone], stones[1], axis1, axis2);
    double[] second = matrixRow(stones[baseStone], stones[2], axis1, axis2);
    double[] third = matrixRow(stones[baseStone], stones[3], axis1, axis2);
    double[] fourth = matrixRow(stones[baseStone], stones[4], axis1, axis2);

    Matrix<double> M = DenseMatrix.OfArray(new double[,] {
        {first[0], first[1], first[2], first[3]},
        {second[0], second[1], second[2], second[3]},
        {third[0], third[1], third[2], third[3]},
        {fourth[0], fourth[1], fourth[2], fourth[3]},
    });

    Vector<Double> V = DenseVector.OfArray([
        vElement(stones[baseStone], stones[1], axis1, axis2),
        vElement(stones[baseStone], stones[2], axis1, axis2),
        vElement(stones[baseStone], stones[3], axis1, axis2),
        vElement(stones[baseStone], stones[4], axis1, axis2),
    ]);

    return M.Inverse() * V;
}

static double[] matrixRow(Hailstone stone1, Hailstone stone2, Axis axis1, Axis axis2)
{
    return [
        stone1.postion[axis2] - stone2.postion[axis2],
      - stone1.velocity[axis2] + stone2.velocity[axis2],
      - stone1.postion[axis1] + stone2.postion[axis1],
        stone1.velocity[axis1] - stone2.velocity[axis1],
    ];
}

static double vElement(Hailstone stone1, Hailstone stone2, Axis axis1, Axis axis2) {
    return vElementPart(stone2, axis1, axis2) - vElementPart(stone1, axis1, axis2);
}

static double vElementPart(Hailstone stone, Axis axis1, Axis axis2) {
    return stone.postion[axis1]*stone.velocity[axis2] - stone.postion[axis2]*stone.velocity[axis1];
}

class Coor
{
    readonly public Dictionary<Axis, double> val = new Dictionary<Axis, double>();

    public double this[Axis axis]
    {
        get => val[axis];
    }

    public Coor(double x, double y, double z)
    {
        this.val[Axis.X] = x;
        this.val[Axis.Y] = y;
        this.val[Axis.Z] = z;
    }

    public static Coor fromString(string str)
    {
        double[] values  = str
            .Split(new string[] { ", " }, StringSplitOptions.None)
            .Select(double.Parse).ToArray();
        return new Coor(values[0], values[1], values[2]);
    }
}

class Hailstone
{
    readonly public Coor postion;
    readonly public Coor velocity;
    
    public double mOfXy
    {
        get
        {
            return velocity.val[Axis.Y] / velocity.val[Axis.X];
        }
    }

    public double cOfXy
    {
        get
        {
            return postion.val[Axis.Y] - mOfXy * postion.val[Axis.X];
        }
    }

    Hailstone(Coor postion, Coor velocity)
    {
        this.postion = postion;
        this.velocity = velocity;
    }

    public static Hailstone fromString(string str)
    {
        Coor[] values = str
            .Split(new string[] { " @ " }, StringSplitOptions.None)
            .Select(Coor.fromString).ToArray();
        return new Hailstone(values[0], values[1]);
    }

    public double getTAtx(double x)
    {
        return (x - postion.val[Axis.X]) / velocity.val[Axis.X];
    }

    public Coor? getXYintersection(Hailstone other)
    {
        double xratio = velocity.val[Axis.X] / other.velocity.val[Axis.X];
        double yratio = velocity.val[Axis.Y] / other.velocity.val[Axis.Y];
        if (xratio.Equals(yratio))
        {
            return null;
        }
        double x = (cOfXy - other.cOfXy) / (other.mOfXy - mOfXy);
        double y = mOfXy * x + cOfXy;
        return new Coor(x, y, 0);
    }
}

enum Axis
{
    X,
    Y,
    Z,
}
