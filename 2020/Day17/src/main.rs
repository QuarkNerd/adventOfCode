//Learn macros to make abetter veersion of this

use std::collections::HashSet;

#[derive(Eq, Hash, Debug)]
struct Coor {
    x: i32,
    y: i32,
    z: i32,
    w: i32
}

impl PartialEq for Coor {
    fn eq(&self, other: &Self) -> bool {
        self.x == other.x &&
        self.y == other.y &&
        self.z == other.z &&
        self.w == other.w
    }
}

struct World {
    map: HashSet<Coor>,
    x_bounds: [i32; 2],
    y_bounds: [i32; 2],
    z_bounds: [i32; 2],
}

fn main() {
    let input = ".......#
....#...
...###.#
#...###.
....##..
##.#..#.
###.#.#.
....#...";

let mut world = HashSet::new();

    let mut x_bounds = (0, 8);
    let mut y_bounds = (0, 8);
    let mut z_bounds = (0, 1);
    let mut w_bounds = (0, 1);

    for (y, row) in input.split('\n').enumerate() {
        for (x, space) in row.chars().enumerate() {
            if space == '#' {
                world.insert(Coor {x: x as i32, y: y as i32,z: 0, w:0});
            }
        }
    };
    
    for t in 0..6 {
        let mut new_world = HashSet::new();

        x_bounds.0 -= 1;
        x_bounds.1 += 1;
        y_bounds.0 -= 1;
        y_bounds.1 += 1;
        z_bounds.0 -= 1;
        z_bounds.1 += 1;
        w_bounds.0 -= 1;
        w_bounds.1 += 1;

        for x in x_bounds.0..x_bounds.1 {
            for y in y_bounds.0..y_bounds.1 {
                for z in z_bounds.0..z_bounds.1 {
                    for w in w_bounds.0..w_bounds.1 {
                        let old_value = world.get(&Coor {x, y, z, w}).is_some();
                        let count = count_neighs(&world, x, y, z, w);

                        if count == 3 || (count == 2 && old_value) {
                            new_world.insert(Coor {x, y, z, w});
                        }
                    }
                }
            }
        }


        world = new_world;
    }

    println!("{}", world.iter().count());
}

fn count_neighs(map: &HashSet<Coor>, x: i32, y: i32, z: i32, w: i32) -> i32 {
    let range = [-1, 0,1];
    let mut count = 0;
    for diff_x in (&range).iter() {
        for diff_y in (&range).iter() {
            for diff_z in (&range).iter() {
                for diff_w in (&range).iter() {

                    if diff_x != &0 || diff_y != &0 || diff_z != &0 || diff_w != &0 {
                        if map.get(&Coor {x:x + diff_x, y: y + diff_y, z: z + diff_z, w: w + diff_w}).is_some() {
                            count +=1;
                        }
                    }

                }
            }
        }
    };
    count
}

// fn get_input() -> HashSet<Coor> {
//     let mut world = World { 
//         map: HashSet::new(),
//         x_bounds: [0,0],
//         y_bounds: [0,0],
//         z_bounds: [0,0],
//     };

//     let mut x_bounds = (0, 8);
//     let mut y_bounds = (0, 8);
//     let mut z_bounds = (0, 1);
//     let mut w_bounds = (0, 1);

//     for (y, row) in INPUT.split('\n').enumerate() {
//         for (x, space) in row.chars().enumerate() {
//             if space == '#' {
//                 world.insert(Coor {x: x as i32, y: y as i32, z: 0, w: 0});
//             }
//         }
//     };

//     world
// }

static INPUT: &str =
".......#
....#...
...###.#
#...###.
....##..
##.#..#.
###.#.#.
....#...";