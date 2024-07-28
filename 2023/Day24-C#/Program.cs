// See https://aka.ms/new-console-template for more information
using System.IO;

//Console.WriteLine("Hello, World!");
double min = 200000000000000;
double max = 400000000000000;
//double min = 7;
//double max = 27;

string readText = File.ReadAllText("../../../input");
Hailstone[] stones = readText.Split(new string[] { Environment.NewLine }, StringSplitOptions.None).Select(Hailstone.fromString).ToArray();

int g = 0;
for (int i = 0; i < stones.Length; i++)
{
    Hailstone one = stones[i];
    for (int j = i + 1; j < stones.Length; j++)
    {
        //Console.WriteLine(i + " - " + j);
        Hailstone two = stones[j];
        Coor? inter = one.getXYintersection(two);
        if (inter == null) continue;
        double tone = one.getTAtx(inter.val[Axis.X]);
        double ttwo = two.getTAtx(inter.val[Axis.X]);
        if (min < inter.val[Axis.X] && min < inter.val[Axis.Y] && inter.val[Axis.X] < max && inter.val[Axis.Y] < max && tone > 0 && ttwo > 0)
        {
            //Console.WriteLine(i + " - " + j);
            g++;
        }
    }
}
Console.WriteLine(g);
Console.WriteLine(calculateInitialPosition(stones, Axis.X) + calculateInitialPosition(stones, Axis.Y) + calculateInitialPosition(stones, Axis.Z));
Console.WriteLine(calculateInitialPosition(stones, Axis.Y));
Console.WriteLine(calculateInitialPosition(stones, Axis.Z));

//Part two equations were solved by hand

static double calculateInitialPosition(Hailstone[] hailStones, Axis primaryAxis)
{
    Hailstone[] secondEight = new Hailstone[8];
    Array.Copy(hailStones, 8, secondEight, 0, 8);

    return (calculateF(hailStones, primaryAxis) * calculateJ(secondEight, primaryAxis) - calculateF(secondEight, primaryAxis) * calculateJ(hailStones, primaryAxis)) / 
        (calculateF(secondEight, primaryAxis) * calculateI(hailStones, primaryAxis) - calculateF(hailStones, primaryAxis) * calculateI(secondEight, primaryAxis));
}

static double calculateJ(Hailstone[] hailStones, Axis primaryAxis)
{
    Hailstone[] secondFour = new Hailstone[4];
    Array.Copy(hailStones, 4, secondFour, 0, 4);
    Hailstone[] firstTwo = [hailStones[0], hailStones[1]];
    Hailstone[] secondTwo = [hailStones[2], hailStones[3]];
    Hailstone[] thirdTwo = [hailStones[4], hailStones[5]];
    Hailstone[] fourthTwo = [hailStones[6], hailStones[7]];

    return calculateE(hailStones, primaryAxis) * (calculateG(thirdTwo, primaryAxis) - calculateG(fourthTwo, primaryAxis))
        + calculateE(secondFour, primaryAxis) * (calculateG(secondTwo, primaryAxis) - calculateG(firstTwo, primaryAxis));
}


static double calculateI(Hailstone[] hailStones, Axis primaryAxis)
{
    Hailstone[] secondFour = new Hailstone[4];
    Array.Copy(hailStones, 4, secondFour, 0, 4);
    Hailstone[] firstTwo = [hailStones[0], hailStones[1]];
    Hailstone[] secondTwo = [hailStones[2], hailStones[3]];
    Hailstone[] thirdTwo = [hailStones[4], hailStones[5]];
    Hailstone[] fourthTwo = [hailStones[6], hailStones[7]];

    return calculateE(hailStones, primaryAxis) * (calculateH(thirdTwo, primaryAxis) - calculateH(fourthTwo, primaryAxis))
        + calculateE(secondFour, primaryAxis) * (calculateH(secondTwo, primaryAxis) - calculateH(firstTwo, primaryAxis));
}

static double calculateH(Hailstone[] hailStones, Axis primaryAxis)
{
    Axis secondry = primaryAxis == Axis.Y ? Axis.X : Axis.Y;
    return hailStones[1].velocity[secondry] - hailStones[0].velocity[secondry];
}

static double calculateG(Hailstone[] hailStones, Axis primaryAxis)
{
    Axis secondry = primaryAxis == Axis.Y ? Axis.X : Axis.Y;
    Hailstone first = hailStones[0];
    Hailstone second = hailStones[1];
    return first.postion[primaryAxis] * first.velocity[secondry] - second.postion[primaryAxis] * second.velocity[secondry]
        - first.postion[secondry] * first.velocity[primaryAxis] + second.postion[secondry] * second.velocity[primaryAxis];
}

static double calculateF(Hailstone[] hailStones, Axis primaryAxis)
{
    Axis secondry = primaryAxis == Axis.Y ? Axis.X : Axis.Y;
    Hailstone[] secondFour = new Hailstone[4];
    Array.Copy(hailStones, 4, secondFour, 0, 4);
    double E_4 = calculateE(secondFour, primaryAxis);
    double E_0 = calculateE(hailStones, primaryAxis);
    return E_4 * (hailStones[3].postion[secondry] - hailStones[2].postion[secondry] - hailStones[1].postion[secondry] + hailStones[0].postion[secondry]) +
        E_0 * (hailStones[5].postion[secondry] - hailStones[4].postion[secondry] - hailStones[6].postion[secondry] + hailStones[7].postion[secondry]);
}

static double calculateE(Hailstone[] hailStones, Axis axis)
{
    return (hailStones[2].velocity.val[axis] - hailStones[3].velocity.val[axis]) * (hailStones[0].postion.val[axis] - hailStones[1].postion.val[axis]) - 
        (hailStones[0].velocity.val[axis] - hailStones[1].velocity.val[axis]) * (hailStones[2].postion.val[axis] - hailStones[3].postion.val[axis]);
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

    //public Coor getCoorAtX(double x)
    //{
    //    double t = getTAtx(x);
    //    return new Coor(x, postion.val[Axis.Y] + t*velocity.val[Axis.Y], postion.z + t*velocity.z);
    //}

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
            //Console.WriteLine("wwww");

            return null;
        }
        double x = (cOfXy - other.cOfXy) / (other.mOfXy - mOfXy);
        double y = mOfXy * x + cOfXy;
        return new Coor(x, y, 0);
    }

    // same path check
}

enum Axis
{
    X,
    Y,
    Z,
}
