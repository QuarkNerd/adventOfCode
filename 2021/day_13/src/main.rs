use core::fmt;
use std::{collections::HashSet, cmp::{min, max}};

fn main() {
    let mut input = include_str!("input").split("\r\n\r\n");
    let mut paper: Paper = input.next().unwrap().parse().unwrap();
    
    let mut folds = input.next().unwrap().lines().map(|s| {
        let line = s.split(" ").last().unwrap();
        let mut split = line.split("=");

        (split.next().unwrap(), split.next().unwrap().parse::<i32>().unwrap())
    });

    paper.fold(folds.next().unwrap());
    println!("Part one: {}", paper.count_dots());

    for line in folds { paper.fold(line); }

    println!("Part two: \n {}", paper);
}

struct Paper(HashSet<(i32, i32)>);

impl Paper {
    fn count_dots(&self) -> usize {
        self.0.len()
    }

    fn fold(&mut self, line: (&str, i32)) {
        // How to make into_iter() work here
        self.0 = self.0.iter().map(|(x,y)| {
            match line.0 {
                "x" => (fold(*x, line.1), *y),
                "y" => (*x, fold(*y, line.1)),
                _ => panic!("dfasda")
            }
        }).collect();
    }
}

impl fmt::Display for Paper {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        let (min_x, max_x, min_y, max_y) = self.0.iter().fold((i32::MAX, i32::MIN, i32::MAX, i32::MIN), |acc, coor| {
            (min(coor.0, acc.0), max(coor.0, acc.1), min(coor.1, acc.2), max(coor.1, acc.3))
        });
    
        let mut display = vec![vec![" "; (max_x - min_x) as usize + 1]; (max_y - min_y) as usize + 1];
        for (x, y) in self.0.iter() {
            display[(y - min_y) as usize][(x - min_x) as usize] = "#";
        }
        write!(f, "{}", display.into_iter().map(|s| s.join("")).collect::<Vec<_>>().join("\n"))
    }
}

impl std::str::FromStr for Paper {
    type Err = &'static str;
    
    fn from_str<'a>(s: &'a str) -> Result<Self, Self::Err> {
        Ok(Self(s.lines().map(|s| {
            let mut split = s.split(",");
            (split.next().unwrap().parse::<i32>().unwrap(), split.next().unwrap().parse::<i32>().unwrap())
        }).collect()))
    }
}

fn fold(position: i32, line: i32) -> i32 {
    if position > line { return 2*line - position; }
    position
}