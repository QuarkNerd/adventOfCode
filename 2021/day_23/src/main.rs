use std::{ops::{Deref, DerefMut}, cmp::{min, max}, collections::HashMap};

// use pathfinding::num_traits::Zero;
extern crate pathfinding;

use pathfinding::*;
use pathfinding::prelude::dijkstra;

fn main() {
    let (state, x) = get_starting_node();
    println!("{:?}", state);

    let neighbours = |n: &Node| {
        let mut neigh = vec![];
        let mut false_amphipods_per_room = [0;10];
        let mut shallow_amphipods_per_room = [0;10];
        let mut hallway_amphipods = [0;11];
        for amphipod in n.iter() {
            match amphipod.state {
               State::Initial(room, deep) => {
                   false_amphipods_per_room[room] += 1;
                   if !deep {shallow_amphipods_per_room[room] += 1;}
               }
               State::Hallway(pos) => hallway_amphipods[pos] = 1,
               _ => {}
            }
        }

        for i in 0..8 {
            let current = n[i];
            match current.state {
                State::Final => { continue; },
                State::Hallway(x) => {
                    if false_amphipods_per_room[current.target_room] > 0 { continue; }
                    let range = min(x + 1, current.target_room)..max(current.target_room, x);
                    if hallway_amphipods[range].into_iter().any(|x| x != &0) { continue; }
                    let mut new_node = n.clone();

                    new_node[i] = Amphipod {
                        state: State::Final,
                        ..current
                    };
                    neigh.push((new_node, ((x as i64 - current.target_room as i64).abs() as usize)*current.movement_cost ));
                },
                State::Initial(x, deep) => {
                    // println!("{}", x);
                    if deep && shallow_amphipods_per_room[x] > 0 {continue;}
                    let mut allowed_hallway_postions = vec![];
                    for pos in x+1..=10 {
                        if [2, 4, 6, 8].contains(&pos) {continue;}
                        if hallway_amphipods[pos] != 0 { break; }
                        allowed_hallway_postions.push(pos);
                    }
                    for pos in (0..x).rev() {
                        if [2, 4, 6, 8].contains(&pos) {continue;}
                        if hallway_amphipods[pos] != 0 { break; }
                        allowed_hallway_postions.push(pos);
                    }

                    allowed_hallway_postions.into_iter().for_each(|f| {
                        let newAmphipod = Amphipod {
                            state: State::Hallway(f),
                            ..current
                        };
                        let mut new_node = n.clone();
                        new_node[i] = newAmphipod;
                        neigh.push((new_node, ((f as i64 - x as i64).abs() as usize)*current.movement_cost));
                    });
                }
            }
        }
        neigh
    };

    let success = |n: &Node| {
        n.iter().all(|amphipod| {
            State::Final == amphipod.state
        })
    };

    let result = dijkstra(&state, neighbours, success);
    let a = result.unwrap();
    println!("{}", a.1 + x);
    println!("{}", a.1 + x);
    println!("{}", a.1 + x);
    println!("{}", a.1 + x);


    let result = dijkstra(&state, neighbours, |x| *x==get_stage_two());
    let g = result.unwrap();
    println!("{:?}", g.1);

    for b in g.0 {

        println!("\n");
        for c in b.iter() {
            println!("{:?}", c);

        }
        // println!("{:?}", b.iter().map(|x| format!("{:?}", x)).join("\n") );
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
struct Node([Amphipod; 8]);

impl Deref for Node {
    type Target = [Amphipod; 8];

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

impl DerefMut for Node {
    fn deref_mut(&mut self) -> &mut Self::Target {
        &mut self.0
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
struct Amphipod {
    movement_cost: usize,
    target_room: usize,
    state: State
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
enum State {
    // Initial inner is room number is they are in A=2 B=4, bboolean determnes if in most depth
    Initial(usize, bool),
    Hallway(usize),
    Final,
}

fn get_starting_node() -> (Node, usize) {
    let mut amphipods = vec![];
    let rows: Vec<_> = include_str!("input").lines().skip(2).take(2).collect();
    let mut additional_cost = 6666;

    for i in 0..4 {
        let pos = 2*(i + 1);

        let amphipod_1 = get_amphipod(&rows[1][(pos+1)..(pos+2)], pos, true, true);
        let amphipod_2 = get_amphipod(&rows[0][(pos+1)..(pos+2)], pos, amphipod_1.state == State::Final, false);
        
        if amphipod_1.state == State::Final {
            additional_cost -= 2*amphipod_1.movement_cost;
            if amphipod_2.state == State::Final {
                additional_cost -= 4*amphipod_1.movement_cost;
            }
        }

        amphipods.push(amphipod_1);
        amphipods.push(amphipod_2);
    }

    (Node([
        amphipods[0],
        amphipods[1],
        amphipods[2],
        amphipods[3],
        amphipods[4],
        amphipods[5],
        amphipods[6],
        amphipods[7]
    ]), additional_cost)
}

fn get_amphipod(variant: &str, pos: usize, can_be_final: bool, is_in_deep: bool) -> Amphipod {
    let (target_room, movement_cost) = match variant {
        "A" => (2, 1),
        "B" => (4, 10),
        "C" => (6, 100),
        "D" => (8, 1000),
        _ => panic!(""),
    };

    let state = if can_be_final && pos == target_room {
        State::Final
    } else {
        State::Initial(pos, is_in_deep)
    };

    Amphipod {
        state,
        movement_cost,
        target_room
    }
}

fn get_stage_two() -> Node {
    Node([
        Amphipod {
            state: State::Final,
            movement_cost: 1,
            target_room: 2
        },
        Amphipod {
            state:State::Initial(2, false),
            movement_cost:10,
            target_room: 4
        },
        Amphipod {
            state:State::Initial(4, true),
            movement_cost:1000,
            target_room: 8
        },
        Amphipod {
            state:State::Final,
            movement_cost:100,
            target_room: 6
        },
        Amphipod {
            state:State::Final,
            movement_cost:100,
            target_room: 6
        },
        Amphipod { movement_cost: 10, target_room: 4, state: State::Hallway(3) },
        Amphipod { movement_cost: 1, target_room: 2, state: State::Initial(8, true) },
        Amphipod { movement_cost: 1000, target_room: 8, state: State::Initial(8, false) },
    ])
}