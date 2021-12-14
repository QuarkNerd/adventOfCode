use std::collections::HashMap;

fn main() {
    // let mut start_str: Vec <_> = "SNVVKOBFKOPBFFFCPBSF".split("").filter(|x| !x.is_empty()).collect();
    let mut start= "SNVVKOBFKOPBFFFCPBSF";
    // let mut start: Vec <_> = "NNCB".split("").filter(|x| !x.is_empty()).collect();
    let steps: HashMap<_, _> = include_str!("include").lines().map(
        |x| {
            let mut spl = x.split(" -> ");
            let mut inp = spl.next().unwrap().chars();
            let charTuple = (inp.next().unwrap(), inp.next().unwrap());
            (charTuple, spl.next().unwrap().chars().next().unwrap())
        }
    ).collect();

    // more diomatic way of folding into hashmap?
    let mut state = start.chars().zip(start.chars().skip(1)).fold(HashMap::new(), 
    |mut acc, x| {
        *acc.entry(x).or_insert(0) += 1 as i64;
        acc
    });

    println!("{:?}", steps);
    println!("{:?}", state);

    for i in 0..40 {
        state = state.into_iter().fold(HashMap::new(), 
        |mut acc, (chars, count)| {
            if let Some(&a) = steps.get(&chars) {

                let thingOne = (chars.0, a);  
                let thingTwo = (a, chars.1);  
                *acc.entry(thingOne).or_insert(0) += count;
                *acc.entry(thingTwo).or_insert(0) += count;
            }
                acc
        });
    }

    let pool = state.into_iter().fold(HashMap::new(), 
    |mut acc, (chars, count)| {
            *acc.entry(chars.0).or_insert(0) += count;
            *acc.entry(chars.1).or_insert(0) += count;
            acc
    });
    
    println!("{:?}", pool);
    println!("{:?}", (8462283437264 as i64 - 1077843463188)/2);
}
