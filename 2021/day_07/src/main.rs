fn main() {
    let mut state: Vec<i64> = include_str!("input").split(',').map(|st| st.parse().unwrap()).collect();
    state.sort();

    let fuel_cost: i64 = [state[state.len()/2], state[state.len()/2 - 1]].into_iter().map(|target| {
        state.iter().map(|x| (target - x).abs()).sum()
    }).min().unwrap();
    println!("Part one: {}", fuel_cost);
    
    let fuel_cost: i64 = state.iter().map(|target| {
        state.iter().map(|x| {
            let diff = (x - target).abs();
            ((diff+1)*diff)/2
        }).sum()
    }).min().unwrap();

    println!("Part two: {}", fuel_cost);
}
