use std::{collections::HashMap, cmp::{min, max}};

fn main() {
    let mut input = include_str!("input").lines();
    let code = input.next().unwrap();
    input.next();
    let hash_map: HashMap<(i32, i32), bool> = input.enumerate().flat_map(|(i, row)| 
        row.chars().enumerate().map(|(j, pixel)| ((j as i32, i as i32),pixel == '#')).collect::<Vec<_>>()
    ).collect();

    let mut s = State {
        map: hash_map,
        rest: false
    };

    for _ in 0..2 {
        s.step(code);
    }
    println!("Part one: {}", s.map.iter().filter(|(_, y)| **y).count());
    for _ in 0..48 {
        s.step(code);
    }
    println!("Part two: {}", s.map.into_iter().filter(|(_, y)| *y).count());
}

struct State {
    map: HashMap<(i32, i32), bool>,
    rest: bool
}

impl State {
    fn step(&mut self, code: &str) {
        let range = self.map.iter().fold((i32::MAX, i32::MIN, i32::MAX, i32::MIN), |acc, (coor, _)| {
            (min(coor.0, acc.0), max(coor.0, acc.1), min(coor.1, acc.2), max(coor.1, acc.3))
        });
        
        self.map = get_coordinates_range(range).map(|(x,y)| {
            let bin_string: String = [
                (x - 1, y - 1), ( x, y - 1), (x + 1, y - 1),
                (x - 1, y), (x, y), (x + 1, y),
                (x - 1, y + 1), ( x, y + 1), (x + 1, y + 1),
                ].into_iter().map(|coor| {
                    let cell = self.map.get(&coor);
                    let cell_value = if cell.is_some() { *cell.unwrap() } else { self.rest };
                    if cell_value {return "1"} else {return "0"};
                }).collect();
                
            let intval = usize::from_str_radix(&bin_string, 2).unwrap();
            ((x,y), &code[intval..intval+1] == "#")
        }).collect();
        
        if &code[0..1] == "#" {   
            self.rest = !self.rest;
        }
    }
}

fn get_coordinates_range(range: (i32, i32, i32, i32)) -> impl Iterator<Item=(i32, i32)> {
    let (min_x, max_x, min_y, max_y) = range;
    (min_x-1..=max_x+1).flat_map(move |x| {
        (min_y-1..=max_y+1).map(move |y| {
            (x,y)
        })
    })
}