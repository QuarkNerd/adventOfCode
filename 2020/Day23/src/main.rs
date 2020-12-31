use std::time::{Instant};

#[derive(Debug)]
struct Node {
    value: u32,
    next: Option<Box<Node>>
}

fn main() {
    let INPUT = "469217538";
    let len = INPUT.len();
    
    let mut next_cup_vec = Vec::new();
    next_cup_vec.resize((len+1) as usize, 0);
    let input_vec: Vec<_> = INPUT.chars().map(|x| x.to_string().parse::<u32>().unwrap()).collect();
    
    for i in 0..len {
        if i == len - 1 {
            next_cup_vec[input_vec[i] as usize] = input_vec[0];
        } else {
            next_cup_vec[input_vec[i] as usize] = input_vec[i + 1];
        }
    }
    
    play(&mut next_cup_vec, 100, input_vec[0], 9);
    
    let mut final_arrangement = Vec::new();
    let mut current_cup = 1;
    loop {
        current_cup = next_cup_vec[current_cup as usize];
        if current_cup == 1 {break;}
        final_arrangement.push(current_cup.to_string());
    }; 
    
    
    println!("Part one: {}", final_arrangement.join(""));

    let now = Instant::now();
    
    let mut next_cup_vec = Vec::new();
    next_cup_vec.resize((1000001) as usize, 0);
    for i in 0..(len-1) {
        next_cup_vec[input_vec[i] as usize] = input_vec[i+1];
    };
    
    next_cup_vec[input_vec[len-1] as usize] = (len+1) as u32;
    next_cup_vec[1000000] = input_vec[0];
    
    for i in len+1..1000000 {
        next_cup_vec[i as usize] = (i+1) as u32;
    }
    
    play(&mut next_cup_vec, 10000000, input_vec[0], 1000000);
    
    let one_next = next_cup_vec[1];
    println!("{:?}", now.elapsed());

    println!("Part two: {}", (one_next as u64) * (next_cup_vec[one_next as usize]) as u64);
}

fn play(next_cup_vec: &mut Vec<u32>, iterations: u32, mut current_cup: u32, max_value: u32) {
    for _ in 0..iterations {
        current_cup = step(next_cup_vec, current_cup, max_value); 
    }  
}

fn step(next_cup_vec: &mut Vec<u32>, current_cup: u32, max_value: u32) -> u32 {
    let move_beginning = next_cup_vec[current_cup as usize];
    let move_middle = next_cup_vec[move_beginning as usize];
    let move_end = next_cup_vec[move_middle as usize];
    
    let mut destination_cup = current_cup - 1;
    loop {
        if [move_beginning, move_middle, move_end].contains(&destination_cup) {
            destination_cup = destination_cup - 1;
        } else if destination_cup == 0 {
            destination_cup = max_value;
        } else {
            break;
        }
    }
    
    let destination_cup_next = next_cup_vec[destination_cup as usize];
    next_cup_vec[destination_cup as usize] = move_beginning;
    let new_next = next_cup_vec[move_end as usize];
    next_cup_vec[move_end as usize] = destination_cup_next;
    next_cup_vec[current_cup as usize] = new_next;
    new_next
}