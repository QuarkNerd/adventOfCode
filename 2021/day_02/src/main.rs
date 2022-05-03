use Action::*;
use std::ops::Add;

fn main() {
    let actions = include_str!("input").lines().map(str::parse).map(|x| x.unwrap());

    let mut pos = Position {
        x: 0,
        daim: 0,
        real_depth: 0
    };

    for act in actions {
        pos = pos + act;
    };
    println!("Part one: {}", pos.x*pos.daim);
    println!("Part two: {}", pos.x*pos.real_depth);
}

enum Action {
    Forward(u32),
    Down(u32),
    Up(u32)
}

impl std::str::FromStr for Action {
    type Err = &'static str;
    fn from_str(s: &str) -> Result<Self, Self::Err> {
        let mut iter = s.split(" ");
        let action = iter.next().unwrap();
        let value = iter.next().unwrap().parse().unwrap();

        match action {
            "forward" => Ok(Forward(value)),
            "down" => Ok(Down(value)),
            "up" => Ok(Up(value)),
            _ => Err("Unexpected string")
        }
    }
}

struct Position {
    x: u32,
    daim: u32,
    real_depth: u32,
}

impl Add<Action> for Position {
    type Output = Self;
    fn add(self, rhs: Action) -> Position {
        
        match rhs {
            Forward(v) => Position {
                x: self.x + v,
                real_depth: self.real_depth + v*self.daim,
                daim: self.daim
            },
            Down(v) => Position {
                daim: self.daim + v,
                ..self
            },
            Up(v) => Position {
                daim: self.daim - v,
                ..self
            }
        }
    }
}
