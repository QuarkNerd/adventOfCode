use std::collections::HashSet;
use std::iter::FromIterator;

fn main() {
    use std::time::Instant;
    let now = Instant::now();

    let input = include_str!("input").lines();//.map(str::parse).map(|x| x.unwrap());
    let rocks: HashSet<(i64, i64)> = input.clone().enumerate().flat_map(|(i, row)| 
        row.chars()
            .enumerate()
            .filter(|(_, loc)| loc == &'#')
            .map(|(j, _)| (j as i64, i as i64))
            .collect::<Vec<_>>()
    ).collect();
    let mut current: HashSet<(i64, i64)> = input.enumerate().flat_map(|(i, row)| 
        row.chars()
            .enumerate()
            .filter(|(_, loc)| loc == &'S')
            .map(|(j, _)| (j as i64, i as i64))
            .collect::<Vec<_>>()
    ).collect();
    let mut visited: HashSet<(i64, i64)> = HashSet::new();

    for n in 0..(100/2) {
        visited.extend(&current);
        current = current.into_iter().flat_map(|(j, i)| 
            [(j + 1, i), (j - 1, i), (j, i + 1), (j, i - 1)]
        )
        .filter(|(j, i)| !rocks.contains(&(modu(*j, 131),modu(*i, 131))))
        .flat_map(|(j, i)| 
            [(j + 1, i), (j - 1, i), (j, i + 1), (j, i - 1)]
        )
        .filter(|(j, i)| !rocks.contains(&(modu(*j, 131),modu(*i, 131))))
        .filter(|coor| !visited.contains(coor))
        .collect();
    }
    visited.extend(&current);
    println!("{}", visited.len());

    let elapsed = now.elapsed();
    println!("Elapsed: {:.2?}", elapsed);
}

fn modu(dividend: i64, divisor: i64) -> i64 {
    if dividend < 0 {divisor + dividend%divisor} else {dividend%divisor}
}
// Part two still to be done