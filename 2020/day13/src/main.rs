use std::cmp;

fn main() {
    let (earliest_timestamp_to_depart, delta_time_and_bus_frequency_list) = get_input();
    
    let mut min_wait = u64::MAX;
    let mut bus_id =0;

    for bus in &delta_time_and_bus_frequency_list {
        let time = bus.1 - earliest_timestamp_to_depart%bus.1;
        if time < min_wait {
            min_wait = time;
            bus_id = bus.1;
        }
    }

    println!("Part One: {}", min_wait*bus_id);

    
    let mut time =0;
    let mut current_lcm =1;
    
    for thing in delta_time_and_bus_frequency_list {
        while (thing.1 - time%(thing.1))%thing.1 != thing.0%thing.1 {
            time += current_lcm;
            }
            current_lcm = lcm(current_lcm, thing.1);
            
    }
    
    println!("{:?}", time);
}

fn lcm(first: u64, second: u64) -> u64 { 
    first * second / gcd(first, second)
} 

fn gcd(first: u64, second: u64) -> u64 {
    let mut max = first; 
    let mut min = second; 
    if min > max { 
        let val = max; max = min; min = val; 
    } 
    
    loop { 
        let res = max % min; 
        if res == 0 { 
            return min; 
        } 
        max = min;
        min = res; 
    } 
}

fn get_input() -> (u64, Vec<(u64, u64)>) {
    let split: Vec<_> = INPUT.split('\n').collect();
    let earliest_timestamp_to_depart = split[0].parse::<u64>().unwrap();
    let busses: Vec<_>= split[1].split(',').collect();
    
    let mut delta_time_and_bus_frequency_list = Vec::new();
    for (i, a) in busses.iter().enumerate() {
        if a != &"x" {
            delta_time_and_bus_frequency_list.push((i as u64,a.parse::<u64>().unwrap()));
        }
    };
    (earliest_timestamp_to_depart, delta_time_and_bus_frequency_list)
}

static INPUT: &str = "1009310
19,x,x,x,x,x,x,x,x,x,x,x,x,37,x,x,x,x,x,599,x,29,x,x,x,x,x,x,x,x,x,x,x,x,x,x,17,x,x,x,x,x,23,x,x,x,x,x,x,x,761,x,x,x,x,x,x,x,x,x,41,x,x,13";