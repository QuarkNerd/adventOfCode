fn main() {
    let list = include_str!("input").lines().map(|st| u16::from_str_radix(st, 2).unwrap()).collect();

    println!("Part Two: {}", part_one(&list));
    println!("Part Two: {}", part_two(&list));
}

fn part_one(list: &Vec<u16>) -> u64 {
    let mut counts = vec![0; 12];
    for num in list {
        for i in 0..counts.len() {
            counts[i] += nth_bit_in(num, i as u16);
        }
    }; 

    let mut gamma_rate = 0;
    let mut epsilon_rate = 0;

    let half_vol = (list.len()/2) as u16;
    println!("{:?}", counts);
    for i in 0..counts.len() {
        if counts[i] > half_vol {
            gamma_rate += 1 << i;
        } else {
            epsilon_rate += 1 << i;
        }
    }

    gamma_rate * epsilon_rate
}

fn part_two(list: &Vec<u16>) -> u64 {
    (get_co2_scrubber_rating(&list) as u64) * (get_oxygen_scrubber_rating(&list) as u64)
}

fn get_oxygen_scrubber_rating(list: &Vec<u16>) -> u16 {
    filter_by_common_bits(list, true)
}

fn get_co2_scrubber_rating(list: &Vec<u16>) -> u16 {
    filter_by_common_bits(list, false)
}

fn filter_by_common_bits(list: &Vec<u16>, choose_common: bool) -> u16 {
    let mut list = list.to_owned();
    for i in (0..12).rev() {
        list = filter_by_common_bit(&list, i, choose_common);
        if list.len() == 1 {
            break;
        }
    }
    list[0]
}

// Default bit is 1 when choose_common is true
fn filter_by_common_bit(list: &Vec<u16>, bit: u16, choose_common: bool) -> Vec<u16> {
    let (one,zero):(_,Vec<_>) = list
        .into_iter()
        .partition(|x| nth_bit_in(x, bit) == 1);
    if choose_common {
        if zero.len() > one.len() { return zero; }
        return one
    }
    if one.len() < zero.len() { return one; }
    zero
    }

fn nth_bit_in(num: &u16, n: u16) -> u16 {
    if num & (1 << n) != 0 {
        return 1
    }; 
    0
}
