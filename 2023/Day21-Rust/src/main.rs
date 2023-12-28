use std::collections::HashSet;

fn main() {
    use std::time::Instant;
    let now = Instant::now();

    let input = include_str!("input").lines();
    let rocks: HashSet<(i64, i64)> = input.clone().enumerate().flat_map(|(i, row)| 
        row.chars()
            .enumerate()
            .filter(|(_, loc)| loc == &'#')
            .map(|(j, _)| (j as i64, i as i64))
            .collect::<Vec<_>>()
    ).collect();

    println!("Part one: {}", countPlots(&rocks, (65, 65), 64));

    // Part two can be sped up with alternative methods, counting diamonds
    let yOfX0 = countPlots(&rocks, (65, 65), 65) as i64;
    let yOfX1 = countPlots(&rocks, (65, 65), 65 + 131) as i64;
    let yOfX2 = countPlots(&rocks, (65, 65), 65 + 131*2) as i64;

    let x = 202300;
    let c = yOfX0;
    let a = (yOfX2 - 2*yOfX1 + c)/2;
    let b = yOfX1 - a - c;

    println!("Part two: {}", a*x*x + b*x + c);
}

fn modu(dividend: i64, divisor: i64) -> i64 {
    if dividend < 0 {divisor + dividend%divisor} else {dividend%divisor}
}

fn countPlots(rocks: &HashSet<(i64, i64)>, initial: (i64, i64), steps: i64) -> usize {
    let mut visited: HashSet<(i64, i64)> = HashSet::new();
    let mut current: HashSet<(i64, i64)> = vec![initial].into_iter().collect();

    if steps%2 == 1 {
        current = current.into_iter().flat_map(|(j, i)| 
            [(j + 1, i), (j - 1, i), (j, i + 1), (j, i - 1)]
        )
        .filter(|(j, i)| !rocks.contains(&(modu(*j, 131),modu(*i, 131))))
        .collect()
    }

    for n in 0..steps/2 {
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
    visited.len()
}
