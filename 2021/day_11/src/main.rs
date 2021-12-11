use std::{fmt::Result, collections::HashMap};

fn main() {
    let mut input: HashMap<(i8, i8),(u8, bool)> = include_str!("i").lines().enumerate().flat_map(|(i, x)| {
        x.split("").filter(|x| x != &"").map(str::parse).enumerate().map(|(j, d)| ((i as i8, j as i8),(d.unwrap(), false))).collect::<Vec<_>>()
    }).collect();

    let mut flashes = 0;
    let keys = input.keys().map(|x| *x).collect::<Vec<_>>();
    for _days in 0..1000 {
        // println!("{} day", _days);
        for cell in keys.iter() {
            input.get_mut(cell).unwrap().0 += 1;
        }
        let mut fl = true;
        while fl {
            fl = false;
            // println!("fsdf");
            for cell in keys.iter() {
                let z  = input.get_mut(cell).unwrap();
                if z.0 > 9 && z.1 == false{
                    z.1 = true;
                    fl = true;
                    // println!("{} ---", flashes);
                flashes += 1;

                for neigh in [
                    (cell.0 - 1, cell.1), ( cell.0, cell.1), (cell.0 + 1, cell.1),
                    (cell.0 - 1, cell.1 - 1), ( cell.0, cell.1 - 1), (cell.0 + 1, cell.1 - 1),
                    (cell.0 - 1, cell.1 + 1), ( cell.0, cell.1 + 1), (cell.0 + 1, cell.1 + 1),
                    ].into_iter() {
                        if let Some(n) =  input.get_mut(&neigh) {
                            if n.1 == false {
                                n.0 += 1;
                            }
                        }
                    }
                    //.into_iter().filter_map(|x| input.get_mut(&x));
            }
        }
        }
        
let mut count =0;
        for cell in keys.iter() {
            let z  = input.get_mut(cell).unwrap();
            if z.1 {
                z.1 = false;
                count +=1;
                input.get_mut(cell).unwrap().0 = 0;
            }
        }
         if count == 100 {
            println!("----------{}", _days);
            break;
         }
    }

    println!("{:?}", input);
    println!("{} --", flashes);
}
