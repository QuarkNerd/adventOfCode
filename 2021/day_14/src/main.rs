use std::collections::HashMap;

fn main() {
    let mut input = include_str!("input").split("\r\n\r\n");

    let start= input.next().unwrap();

    let map: HashMap<_, _> = input.next().unwrap().lines().map(
        |x| {
            let mut spl = x.split(" -> ");
            let mut inp = spl.next().unwrap().chars();
            let input_chars = (inp.next().unwrap(), inp.next().unwrap());
            (input_chars, spl.next().unwrap().chars().next().unwrap())
        }
    ).collect();

    // more diomatic way of folding into hashmap?
    let mut state = start.chars().zip(start.chars().skip(1)).fold(HashMap::new(), 
    |mut acc, x| {
        *acc.entry(x).or_insert(0) += 1 as i64;
        acc
    });

    for _ in 0..10 { state = mutate(state, &map) }
    println!("Part one: {}", calculate_score(&state));

    for _ in 0..30 { state = mutate(state, &map) }
    println!("Part two: {}", calculate_score(&state));
}

fn mutate(state: HashMap<(char, char), i64>, map: &HashMap<(char, char), char>) -> HashMap<(char, char), i64> {
    state.into_iter().fold(HashMap::new(), 
    |mut acc, (old_chars, count)| {
        if let Some(&new_char) = map.get(&old_chars) {
            let pair_one = (old_chars.0, new_char);  
            let pair_two = (new_char, old_chars.1);  
            *acc.entry(pair_one).or_insert(0) += count;
            *acc.entry(pair_two).or_insert(0) += count;
        } else {
            panic!("None mutating pairs not implemented");
        }
            acc
    })
}

fn calculate_score(state: &HashMap<(char, char), i64>) -> i64 {
    let final_counts: Vec<_> = state.iter().fold(HashMap::new(), 
    |mut acc, (chars, count)| {
            *acc.entry(chars.0).or_insert(0) += count;
            *acc.entry(chars.1).or_insert(0) += count;
            acc
    }).into_values().collect();

    let lowest = *final_counts.iter().min().unwrap();
    let highest = final_counts.into_iter().max().unwrap();
    
    (highest + (highest%2) - lowest - (lowest%2))/2
}