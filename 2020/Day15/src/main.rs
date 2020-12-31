use std::collections::HashMap;

fn main() {
    let array = get_input();
    let array_len = array.len();
    let mut number_to_turn_hash = HashMap::new();

    for i in 0..(array_len - 1) {
        number_to_turn_hash.insert(array[i], (i+1) as u32);
    }
    
    let mut num = array[array_len - 1];
    
    let next_turn = array_len + 1;

    for turn in next_turn..30000000 {
        let next_num = match number_to_turn_hash.get(&num) {
            Some(prev_turn) => turn as u32 - prev_turn,
            None => 0
        };

        if turn == 2020 {
            println!("Part one: {}", num)
        }

        number_to_turn_hash.insert(num, turn as u32);
        num = next_num;
    }
    
    println!("Part two: {}", num);
}

fn get_input() -> Vec<u32> {
    "20,0,1,11,6,3".split(',').map(|x| {
        x.parse::<u32>().unwrap()
    }).collect()
}