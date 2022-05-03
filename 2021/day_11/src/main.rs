use std::collections::HashMap;
use std::ops::{Add, AddAssign};

fn main() {
    let mut input: HashMap<_,_> = include_str!("input").lines().enumerate().flat_map(|(i, row)| 
        row.split("").filter(|x| !x.is_empty()).map(str::parse).enumerate().map(|(j, d)| ((i as i8, j as i8), Octopus::Charging(d.unwrap()))).collect::<Vec<_>>()
    ).collect();

    let mut flashes = 0;
    let keys = input.keys().map(|x| *x).collect::<Vec<_>>();
    for days in 1..=1000 {
        for cell in keys.iter() {
            input.get_mut(cell).unwrap().increment();
        }
        let mut flash_occurred = true;
        while flash_occurred {
            flash_occurred = false;
            for cell in keys.iter() {
                let z  = input.get_mut(cell).unwrap().try_flash();
                if z {
                    flash_occurred = true;
                    flashes += 1;

                    [
                        (cell.0 - 1, cell.1), ( cell.0, cell.1), (cell.0 + 1, cell.1),
                        (cell.0 - 1, cell.1 - 1), ( cell.0, cell.1 - 1), (cell.0 + 1, cell.1 - 1),
                        (cell.0 - 1, cell.1 + 1), ( cell.0, cell.1 + 1), (cell.0 + 1, cell.1 + 1),
                    ].into_iter().for_each(|neigh| {
                            if let Some(n) =  input.get_mut(&neigh) {
                                n.increment();
                            }
                        });
                }
            }
        }
        if days == 100 {
            println!("Part one: {}", flashes);
        }

        let mut count = 0;
        for  cell in input.values_mut() {
            if cell.set_to_charging() {count += 1}
        }
        if count == 100 {
            println!("Part two: {}", days);
            break;
        }
    }
}

#[derive(Copy, Clone)]
enum Octopus {
    Charging(u8),
    Flashed
}

impl Octopus {
    fn increment(&mut self) {
        *self += 1;
    }

    fn try_flash(&mut self) -> bool {
        if let Self::Charging(x) = self {
            if *x > 9 {
                *self = Self::Flashed;
                return true;
            };
        };
        false
    }

    fn set_to_charging(&mut self) -> bool {
        match self {
            Self::Charging(_) => return false,
            Self::Flashed => {
                *self = Self::Charging(0);
                return true;
            },
        };
    }
}

// Basicaly useless 
impl Add<u8> for Octopus {
    type Output = Self;

    fn add(self, other: u8) -> Self {
        match self {
            Octopus::Charging(x) => Octopus::Charging(x + other),
            Octopus::Flashed => Octopus::Flashed
        }
    }
}

impl AddAssign<u8> for Octopus {
    fn add_assign(&mut self, other: u8) {
        *self = *self + other;
    }
}