using MathNet.Numerics.LinearAlgebra;
using MathNet.Numerics.LinearAlgebra.Double;
using Microsoft.VisualBasic;
// using MathNet.Numerics.LinearAlgebra.Double;

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

Vector<Double> result = resultt(stones, Axis.X, Axis.Y);
Vector<Double> result2 = resultt(stones, Axis.Y, Axis.Z);

var dx = (long)result[0];
var dy = (long)result[2];
var dz = (long)result2[2];

// These are initial guesses due to double precison and MathNet not being compatible with long or decimal
var x = (decimal)result[1];
var y = (decimal)result[3];
var z = (decimal)result2[3];



for (long testX = (long)x - 1000; testX < (long)x + 1000; testX++) 
{
    decimal time = (decimal)((stones[0].postion[Axis.X] - testX)/(dx - stones[0].velocity[Axis.X]));

    decimal newY = (decimal)stones[0].postion[Axis.Y] + (decimal)(stones[0].velocity[Axis.Y] - dy)*time;
    decimal newZ =  (decimal)stones[0].postion[Axis.Z] + (decimal)(stones[0].velocity[Axis.Z] - dz)*time;


    var found = true;
    foreach(Hailstone stone in stones) {
        decimal tim = (decimal)((stone.postion[Axis.X] - testX)/(dx - stone.velocity[Axis.X]));
        decimal ewY = (decimal)stone.postion[Axis.Y] + (decimal)(stone.velocity[Axis.Y] - dy)*tim;
        decimal ewZ =  (decimal)stone.postion[Axis.Z] + (decimal)(stone.velocity[Axis.Z] - dz)*tim;

        if ((long)newY != (long)ewY || (long)newZ != (long)ewZ ) {
            found = false;

            if (testX == 180391926345104) {
                // Console.WriteLine("Part two Z: " + (testX + newY + newZ).ToString("N8"));
                Console.WriteLine(newY);
                Console.WriteLine(ewY);
                Console.WriteLine(newZ);
                Console.WriteLine(ewZ);
            }
            break;
        }
    }

    if (found) {
        Console.WriteLine("Part two Z: " + (testX + newY + newZ).ToString("N8"));
    }


    // if (testX == 180391926345104) {
    //     Console.WriteLine(time);
    //     Console.WriteLine(newY);
    //     Console.WriteLine(newZ);
    // }

    // if ( Math.Abs(newY - y) <  500 &&  Math.Abs(newZ - z) <  500) {
    //     // Console.WriteLine("Part two Z: " + (testX + newY + newZ).ToString("N8"));
    // } else {
    //     Console.WriteLine("Part two Z: " + (testX + newY + newZ).ToString("N8"));

    // }

    // for (long testY = x - 500; testY < x + 500; testY++) 
    // {
    //     for (long testZ = x - 500; testZ < x + 500; testZ++) 
    //     {
    //         // Console.WriteLine(i);
    //     }       
    // }
}

Console.WriteLine(dx);
Console.WriteLine(x);
Console.WriteLine(dy);
Console.WriteLine(y);
Console.WriteLine(dz);
Console.WriteLine(z);
Console.WriteLine("Part two Z: " + (x + y + z).ToString("N8"));




static Vector<Double> resultt(Hailstone[] stones, Axis axis1, Axis axis2) {
    var BASE = 20;

    double[] first = matrixRow(stones[BASE], stones[1], axis1, axis2);
    double[] second = matrixRow(stones[BASE], stones[2], axis1, axis2);
    double[] third = matrixRow(stones[BASE], stones[3], axis1, axis2);
    double[] fourth = matrixRow(stones[BASE], stones[4], axis1, axis2);

    Matrix<double> M = DenseMatrix.OfArray(new double[,] {
        {first[0], first[1], first[2], first[3]},
        {second[0], second[1], second[2], second[3]},
        {third[0], third[1], third[2], third[3]},
        {fourth[0], fourth[1], fourth[2], fourth[3]},
    });

    Vector<Double> V = DenseVector.OfArray([
        vElement(stones[BASE], stones[1], axis1, axis2),
        vElement(stones[BASE], stones[2], axis1, axis2),
        vElement(stones[BASE], stones[3], axis1, axis2),
        vElement(stones[BASE], stones[4], axis1, axis2),
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
