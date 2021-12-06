use std::collections::VecDeque;

fn main() {
    let mut state = include_str!("input").split(',').map(|st| st.parse().unwrap())
    .fold( VecDeque::from([0; 9]), |mut acc, x: usize| {
        acc[x] += 1;
        acc
    });

    state = update_state(state, 80);
    println!("Part one: {}", state.iter().sum::<u64>());

    state = update_state(state, 256 - 80);
    println!("Part two: {}", state.into_iter().sum::<u64>());
}

fn update_state(mut state: VecDeque<u64>, days: u16) -> VecDeque<u64> {
    for _ in 0..days {
        state.rotate_left(1);
        *state.get_mut(6).unwrap() += *state.get(8).unwrap();
    };
    state
}
