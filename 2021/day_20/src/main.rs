use std::{collections::{HashMap, HashSet}, cmp::{min, max}};

fn main() {
    let mut input = include_str!("input").lines();
    let code = input.next().unwrap();
    input.next();
    let hash_map: HashMap<(i32, i32), char> = input.enumerate().flat_map(|(i, row)| 
        row.chars().enumerate().map(|(j, pixel)| ((j as i32, i as i32),pixel)).collect::<Vec<_>>()
    ).collect();
    let mut state = (hash_map, '.');
    
    // println!("{}\r\n\r\n", fmt(&state));
    for _ in 0..50 {
        state = step(state, code);
        // println!("{}\r\n\r\n", fmt(&state));
        //println!("{}", fmt(&state));
    }
    println!("{}", state.0.into_iter().filter(|(x, y)| y == &'#').count());
}

fn step(state: (HashMap<(i32, i32), char>, char), code: &str) -> (HashMap<(i32, i32), char>, char) {
    let (min_x, max_x, min_y, max_y) = state.0.iter().fold((i32::MAX, i32::MIN, i32::MAX, i32::MIN), |acc, (coor, _)| {
        (min(coor.0, acc.0), max(coor.0, acc.1), min(coor.1, acc.2), max(coor.1, acc.3))
    });

    let mut newState = HashMap::new();
    for x in min_x-1..=max_x+1 {
        for y in min_y-1..=max_y+1 {
            let bin_string: String = [
                (x - 1, y - 1), ( x, y - 1), (x + 1, y - 1),
                (x - 1, y), (x, y), (x + 1, y),
                (x - 1, y + 1), ( x, y + 1), (x + 1, y + 1),
            ].into_iter().map(|coor| {
                let cell = state.0.get(&coor);
                if cell.is_none() {
                   if state.1 == '#' {return "1"} else {return "0"};
                }
                let cell = cell.unwrap();
                if cell == &'#' {return "1"} else {return "0"};
            }).collect();

            let intval = usize::from_str_radix(&bin_string, 2).unwrap();
            let a = code.chars().nth(intval).unwrap();
            // if code.chars().nth(intval) == Some('#') {
                newState.insert((x,y), a);
            // }
        };

    };
    
    (newState,  if state.1 == '#' {'.'} else {'#'})
    // newState
}

    // fn fmt(a: &HashMap<(i32, i32), char>) -> String {
    //     let (min_x, max_x, min_y, max_y) = a.iter().filter(|(_, pixel)| pixel == &&'#').fold((i32::MAX, i32::MIN, i32::MAX, i32::MIN), |acc, (coor, _)| {
    //         (min(coor.0, acc.0), max(coor.0, acc.1), min(coor.1, acc.2), max(coor.1, acc.3))
    //     });
    
    //     let mut display = vec![vec![" "; (max_x - min_x) as usize + 1]; (max_y - min_y) as usize + 1];
    //     for (x, y) in a.iter() {
    //         display[(y - min_y) as usize][(x - min_x) as usize] = "#";
    //     }
    //     format!("{}", display.into_iter().map(|s| s.join("")).collect::<Vec<_>>().join("\n"))
    // }