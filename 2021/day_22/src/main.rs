use std::cmp::{max, min};
use regex::Regex;

fn main() {
    let input:Result<_,_> = include_str!("input").lines().map(str::parse).collect();
    let input: Vec<Action> = input.unwrap();

    let part_one_input = input.iter().filter(|action| {
        action.region.is_inside(Cuboid {
            x: [-50, 50],
            y: [-50, 50],
            z: [-50, 50]
        })
    }).map(|x| *x).collect();
    println!("Part one: {}", count_cubes(part_one_input));
    println!("Part two: {}", count_cubes(input));
}

fn count_cubes(mut instructions: Vec<Action>) -> usize {
    instructions.reverse();
    instructions.iter().enumerate().filter(|(_, x)| x.on).map(|(i, action )| {
        let regions_to_add = instructions[0..i].iter().fold(vec![action.region], |current_regions_to_add, region_to_not_add| 
            current_regions_to_add.into_iter().flat_map(|reg| reg.subtract(region_to_not_add.region)).collect()
        );
        regions_to_add.into_iter().map(|a| a.get_count()).sum::<usize>()
    }).sum()
}

#[derive(Debug, Clone, Copy)]
struct Action {
    on: bool,
    region: Cuboid
}
#[derive(Debug, Clone, Copy)]
struct Cuboid {
    x: [i128; 2],
    y: [i128; 2],
    z: [i128; 2]
}
impl Cuboid {
    fn get_count(&self) -> usize {
        ((1 + self.x[1] - self.x[0])*(1 + self.y[1] - self.y[0])*(1 + self.z[1] - self.z[0])).try_into().unwrap()
    }

    fn is_valid(&self) -> bool {
        self.x[0] <= self.x[1] && self.y[0] <= self.y[1] && self.z[0] <= self.z[1]
    }

    fn is_inside(&self, other: Cuboid) -> bool {
        self.x[0] >= other.x[0] && self.x[1] <= other.x[1] &&
        self.y[0] >= other.y[0] && self.y[1] <= other.y[1] &&
        self.z[0] >= other.z[0] && self.z[1] <= other.z[1]
    }

    // ignores regions of other outside of self
    fn subtract(&self, other: Cuboid) -> Vec<Cuboid>{
        if other.x[0] > self.x[1] || other.x[1] < self.x[0] ||
           other.y[0] > self.y[1] || other.y[1] < self.y[0] ||
           other.z[0] > self.z[1] || other.z[1] < self.z[0] {
               return vec!(*self);
           };

        [
            Cuboid {
                x: [self.x[0], other.x[0] - 1],
                y: [self.y[0], self.y[1]],
                z: [self.z[0], self.z[1]]
            },
            Cuboid {
                x: [other.x[1] + 1, self.x[1]],
                y: [self.y[0], self.y[1]],
                z: [self.z[0], self.z[1]]
            },
            Cuboid {
                x: [max(self.x[0], other.x[0]), min(self.x[1], other.x[1])],
                y: [self.y[0], other.y[0] - 1],
                z: [self.z[0], self.z[1]]
            },
            Cuboid {
                x: [max(self.x[0], other.x[0]), min(self.x[1], other.x[1])],
                y: [other.y[1] + 1, self.y[1]],
                z: [self.z[0], self.z[1]]
            },
            Cuboid {
                x: [max(self.x[0], other.x[0]), min(self.x[1], other.x[1])],
                y: [max(self.y[0], other.y[0]), min(self.y[1], other.y[1])],
                z: [self.z[0], other.z[0] - 1],
            },
            Cuboid {
                x: [max(self.x[0], other.x[0]), min(self.x[1], other.x[1])],
                y: [max(self.y[0], other.y[0]), min(self.y[1], other.y[1])],
                z: [other.z[1] + 1, self.z[1]]
            }
        ].into_iter().filter(|x| x.is_valid()).collect()
    }
}

impl std::str::FromStr for Action {
    type Err = &'static str;
    fn from_str(s: &str) -> Result<Self, Self::Err> {
        let re = Regex::new(r"(on|off) x=(-?\d+)\.\.(-?\d+),y=(-?\d+)\.\.(-?\d+),z=(-?\d+)\.\.(-?\d+)").unwrap();
        let caps = re.captures(s).unwrap();
        let xs = [caps.get(2).unwrap().as_str().parse().unwrap(),  caps.get(3).unwrap().as_str().parse().unwrap()];
        let ys = [caps.get(4).unwrap().as_str().parse().unwrap(),  caps.get(5).unwrap().as_str().parse().unwrap()];
        let zs = [caps.get(6).unwrap().as_str().parse().unwrap(),  caps.get(7).unwrap().as_str().parse().unwrap()];
        Ok(Self {
            on: caps.get(1).unwrap().as_str() == "on",
            region: Cuboid {
                x: [min(xs[0], xs[1]), max(xs[0], xs[1])],
                y: [min(ys[0], ys[1]), max(ys[0], ys[1])],
                z: [min(zs[0], zs[1]), max(zs[0], zs[1])]
            }
        })
    }
}
