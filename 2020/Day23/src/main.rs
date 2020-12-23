fn main() {
    let INPUT = "469217538";
    let mut cups: Vec<_> = INPUT.chars().map(|x| x.to_string().parse::<u8>().unwrap()).collect();

    for _ in 0..100 {
        let slice = &[cups.remove(1), cups.remove(1), cups.remove(1)]; // why no temp value dropped error
        
        let mut destination_cup = cups[0] - 1;
        loop {
            if let Some(pos) = cups.iter().position(|&r| r == destination_cup) {
                cups.splice(pos+1..pos+1, slice.iter().cloned());
                break;
            }
            if destination_cup == 0 {destination_cup = 9}
            else {destination_cup -= 1};
        }

        cups.rotate_left(1);
    };

    let pos_of_one = cups.iter().position(|&r| r == 1).unwrap();
    cups.rotate_left(pos_of_one);

    println!("{}", &cups[1..].iter().map(|x| x.to_string()).collect::<Vec<_>>().join(""));


    // let INPUT = "469217538";
    // let mut cups: Vec<_> = INPUT.chars().map(|x| x.to_string().parse::<u64>().unwrap()).collect();

    // let mut ha = HashSet::new();

    // for i in 10..1000000+1 {
    //     cups.push(i);
    // }

    // for a in 0..10000000 {
    //     if !ha.insert(cups.clone()) {
    //         println!("{}", a);
    //     }
    //     let slice = &[cups.remove(1), cups.remove(1), cups.remove(1)]; // why no temp value dropped error
        
    //     let mut destination_cup = cups[0] - 1;
    //     loop {
    //         if let Some(pos) = cups.iter().position(|&r| r == destination_cup) {
    //             cups.splice(pos+1..pos+1, slice.iter().cloned());
    //             break;
    //         }
    //         if destination_cup == 0 {destination_cup = 1000000}
    //         else {destination_cup -= 1};
    //     }

    //     cups.rotate_left(1);
    // };

    // //println!("{:?}", cups)
}
