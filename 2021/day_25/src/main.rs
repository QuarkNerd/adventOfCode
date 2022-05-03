use std::collections::HashSet;

fn main() {
    let mut south_facing = HashSet::new();
    let mut east_facing = HashSet::new();
    let input: Vec<_> = include_str!("input").lines().collect();
    
    let x_lim = input[0].len();
    let y_lim = input.len();

    input.into_iter().enumerate().for_each(|(i, row)| {
        row.chars().enumerate().for_each(|(j, pixel)| {
            match pixel {
                '>' => { east_facing.insert((j, i)); },
                'v' => { south_facing.insert((j, i)); },
                '.' => {},
                _ => panic!("")
            };
        });
    });

    let mut i = 0;
    let mut moved = true;
    while moved {
        i+=1;

        let new_east_facing: HashSet<_> = east_facing.iter().map(|c| {
            let d = ((c.0+1)%x_lim, c.1);
            if south_facing.contains(&d) || east_facing.contains(&d) {
                *c
            } else {
                d
            }
        }).collect();
        
        let new_south_facing = south_facing.iter().map(|c| {
            let d = (c.0, (c.1+1)%y_lim);
            if south_facing.contains(&d) || new_east_facing.contains(&d) {
                *c
            } else {
                d
            }
        }).collect();
        
        moved = new_east_facing != east_facing || new_south_facing != south_facing;
        south_facing = new_south_facing;
        east_facing = new_east_facing;
    }
    println!("{}", i);
}
