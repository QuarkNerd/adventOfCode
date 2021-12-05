use regex::Regex;
use std::cmp::max;

fn main() {
    let re = Regex::new(r"(\d+),(\d+) -> (\d+),(\d+)").unwrap();
    let mut grid = vec![vec![0u16; 1000]; 1000];

    let (perp , diagonals):(_,Vec<_>) = include_str!("input").lines().
        map(|s| {
            let caps = re.captures(s).unwrap();
            [caps.get(1).map_or("", |m| m.as_str()).parse::<i16>().unwrap(), caps.get(2).map_or("", |m| m.as_str()).parse().unwrap(), caps.get(3).map_or("", |m| m.as_str()).parse().unwrap(), caps.get(4).map_or("", |m| m.as_str()).parse().unwrap()]
        })
        .partition(|[x0,y0,x1,y1]| x1 == x0 || y0 == y1);
        
    perp.into_iter().for_each(|[x0,y0,x1,y1]| {
        for (x,y) in range2d(x0 as i16, x1 as i16, y0 as i16, y1 as i16) {
            grid[x as usize][y as usize] += 1;
        };
    });
    println!("Part one: {}", grid.iter().flatten().filter(|x| x > &&1).count());
    
    diagonals.into_iter().for_each(|[x0,y0,x1,y1]| {
        for (x,y) in range2d(x0, x1, y0, y1) {
            grid[x as usize][y as usize] += 1;
        };
    });
    println!("Part two: {}", grid.iter().flatten().filter(|x| x > &&1).count());
}

fn range2d(x0: i16, x1: i16, y0: i16, y1: i16) -> impl Iterator<Item = (i16, i16)>
{
    let x_diff = x1 - x0;
    let y_diff = y1 - y0;
    let x_direction = if x_diff != 0 { x_diff.signum() } else { 0 };
    let y_direction = if y_diff != 0 { y_diff.signum() } else { 0 };
    let len = max(x_diff.abs(), y_diff.abs());
    (0..=len).map(move |s| (x0 + s*x_direction, y0 + s*y_direction))
}
