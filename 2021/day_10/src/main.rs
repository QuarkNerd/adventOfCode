fn main() {
    let input = include_str!("input").lines();
    
    let mut score: u32 = 0;
    let valid_lines = input.filter_map(|line| {
        let mut stack = vec!();
        for char in line.chars() {
            match char {
                '(' | '[' | '{' | '<' => stack.push(char),
                ')' if stack.pop().unwrap() != '(' => {
                        score += 3;
                        return None;
                },
                ']' if stack.pop().unwrap() != '[' => {
                        score += 57;
                        return None;
                },
                '}' if stack.pop().unwrap() != '{' => {
                        score += 1197;
                        return None;
                },
                '>' if stack.pop().unwrap() != '<' => {
                        score += 25137;
                        return None;
                },
                _ => {}
            }
        }
        Some(stack)
    });
        
    let mut score_list: Vec<u64> = valid_lines.map(|line| {
        line.into_iter().rev()
            .fold(0, |mut acc, x| {
                acc *=5;
                acc += match x {
                        '(' => 1,
                        '[' => 2,
                        '{' => 3,
                        '<' => 4,
                        _ => {panic!()}
                    };
                acc
            })
    }).collect();
    score_list.sort();

    println!("Part one: {}", score);
    println!("Part two: {}", score_list[score_list.len()/2]);
}
