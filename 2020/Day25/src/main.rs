fn main() {
    let input = get_input();
    let mut a = 1;
    for _ in 0..get_loop_size(7, input.0) {
        a = step(input.1, a);
    }
    println!("{}", a);
}

fn get_loop_size(subject: u64, public_key: u64) -> u64 {
    let mut i = 0;
    let mut value = 1;

    while value != public_key {
        value = (value*subject)%20201227;
        i +=1;
    }

    i
}

fn step(value: u64, subject: u64) -> u64 {
    (value*subject)%20201227
}

fn get_input() -> (u64, u64) {
    let inp: Vec<_> = INPUT.split('\n').map(|x| x.parse::<u64>().unwrap()).collect();
    (inp[0], inp[1])
}

static INPUT: &str = "1614360
7734663";