use std::cmp::{min, max};
use regex::Regex;

fn main() {
    let input = include_str!("input");
    let (x_start, x_end, y_start, y_end) = get_target_limits(input);
    let possible_velocities =  get_possible_velocities(x_start, x_end, y_start, y_end);
    
    let valid_velocities: Vec<_> = possible_velocities.filter(|&(mut vx,mut vy)| {
        let mut x = 0;
        let mut y = 0;
    
        while ((x_end - x).signum() == vx.signum() || (x <= x_end && x >= x_start) ) &&
              (y >= y_start || vy > 0) {
            x += vx;
            y += vy;
            if vx != 0 { vx -= vx.signum() };
            vy -= 1;
    
            if x >= x_start && x<=x_end && y>= y_start && y <= y_end {
                return true
            };
        };
    
        return false;
    }).collect();

    let count = valid_velocities.len();
    let largest_vy = valid_velocities.into_iter().max_by(
        |(_, y1), (_, y2)| y1.cmp(y2)
    ).unwrap().1;

    println!("Part one: {}", largest_vy*(largest_vy+1)/2);
    println!("Part two: {}", count);
}

fn get_target_limits(input: &str) -> (i64, i64, i64, i64) {
    let regex_str = r"target area: x=(?P<x_start>-?\d+)\.\.(?P<x_end>-?\d+), y=(?P<y_start>-?\d+)\.\.(?P<y_end>-?\d+)";
    let re : Regex = Regex::new(regex_str).unwrap();
    let caps = re.captures(input).unwrap();

    let x_start: i64 = caps.name("x_start").unwrap().as_str().parse().unwrap();
    let y_start: i64 = caps.name("y_start").unwrap().as_str().parse().unwrap();
    let x_end: i64 = caps.name("x_end").unwrap().as_str().parse().unwrap();
    let y_end: i64 = caps.name("y_end").unwrap().as_str().parse().unwrap();

    (x_start, x_end, y_start, y_end)
}

fn get_possible_velocities(x_start: i64, x_end: i64, y_start: i64, y_end: i64) -> impl Iterator<Item=(i64, i64)> {
    let x_min = min(x_start,0);
    let x_max = max(x_end,0);

    let y_lim = max(y_start.abs(), y_end.abs());

    (x_min..=x_max).map(move |x| (-y_lim..=y_lim).map(|y| (x,y)).collect::<Vec<_>>()).flatten()
}