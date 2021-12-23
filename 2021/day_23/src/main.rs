use std::cmp::{min, max};

extern crate pathfinding;
use pathfinding::prelude::dijkstra;

fn main() {
    let state = get_starting_node();
    let neighbours = |n: &Node| {
        let mut neigh = vec![];

        let default_depth = if n.1.is_none() {3} else {5};
        let mut incorrect_amphipods_in_room = [false; 9];
        let mut shallowest_amphipod_per_room = [default_depth;10];
        let mut hallway_amphipods = [false; 11];

        let all_amphipods = get_vec_from_node(n);

        for amphipod in all_amphipods.iter() {
            match amphipod.state {
               State::Initial(room, depth) => {
                   incorrect_amphipods_in_room[room] = true;
                   shallowest_amphipod_per_room[room] = min(shallowest_amphipod_per_room[room], depth);
                }
               State::Hallway(pos) => hallway_amphipods[pos] = true,
               State::Final(depth) => shallowest_amphipod_per_room[amphipod.target_room] = min(shallowest_amphipod_per_room[amphipod.target_room], depth)
            }
        }

        for (i, current) in all_amphipods.iter().enumerate() {
            match current.state {
                State::Final(_) => { continue; },
                State::Hallway(x) => {
                    if incorrect_amphipods_in_room[current.target_room] { continue; }
                    
                    let range = min(x + 1, current.target_room)..max(current.target_room, x);
                    if hallway_amphipods[range].into_iter().any(|x| *x) { continue; }
                    
                    let depth = shallowest_amphipod_per_room[current.target_room] - 1;

                    let mut new_node = all_amphipods.clone();
                    new_node[i] = Amphipod {
                        state: State::Final(depth),
                        ..*current
                    };
                    neigh.push((get_node_from_vec(new_node), ((x as i64 - current.target_room as i64).abs() as usize + depth)*current.movement_cost ));
                },
                State::Initial(room, depth) => {
                    // println!("{}", x);
                    if depth != shallowest_amphipod_per_room[room] {continue;}
                    let mut allowed_hallway_postions = vec![];
                    for pos in room+1..=10 {
                        if [2, 4, 6, 8].contains(&pos) {continue;}
                        if hallway_amphipods[pos] { break; }
                        allowed_hallway_postions.push(pos);
                    }
                    for pos in (0..room).rev() {
                        if [2, 4, 6, 8].contains(&pos) {continue;}
                        if hallway_amphipods[pos] { break; }
                        allowed_hallway_postions.push(pos);
                    }

                    allowed_hallway_postions.into_iter().for_each(|f| {
                        let new_amphipod = Amphipod {
                            state: State::Hallway(f),
                            ..*current
                        };
                        let mut new_node = all_amphipods.clone();
                        new_node[i] = new_amphipod;
                        neigh.push((get_node_from_vec(new_node), ((f as i64 - room as i64).abs() as usize + depth)*current.movement_cost));
                    });
                }
            }
        }

        neigh
    };

    let success = |n: &Node| {
        let all_amphipods = get_vec_from_node(n);
        all_amphipods.into_iter().all(|amphipod| {
            amphipod.state.is_final()
        })
    };

    let result = dijkstra(&state, neighbours, success).unwrap();
    println!("{}", result.1);

}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
struct Node([Amphipod; 8], Option<[Amphipod; 8]>);

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
struct Amphipod {
    movement_cost: usize,
    target_room: usize,
    state: State
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
enum State {
    // Initial inner is room number is they are in A=2 B=4, followed by depth
    Initial(usize, usize),
    Hallway(usize),
    Final(usize) //depth
}

impl State {
    fn is_final(&self) -> bool {
        if let State::Final(_) = &self {
            return true;
        };
        false
    }
}

fn get_starting_node() -> Node {
    let mut amphipods = vec![];
    let mut rows: Vec<_> = include_str!("input").lines().skip(2).take(2).collect();

    // comment in for part two
    // rows.insert(1, "  #D#C#B#A#  ");
    // rows.insert(2, "  #D#B#A#C#  ");

    for i in 0..4 {
        let pos = 2*(i + 1);
        let mut can_be_final = true;

        for (depth,row) in rows.iter().enumerate().rev() {
            let amphipod = get_amphipod(&row[(pos+1)..(pos+2)], pos, can_be_final, depth + 1);
            can_be_final = amphipod.state.is_final();  
            amphipods.push(amphipod) 
        };
    }

    get_node_from_vec(amphipods)
}

fn get_amphipod(variant: &str, pos: usize, can_be_final: bool, depth: usize) -> Amphipod {
    let (target_room, movement_cost) = match variant {
        "A" => (2, 1),
        "B" => (4, 10),
        "C" => (6, 100),
        "D" => (8, 1000),
        _ => panic!(""),
    };

    let state = if can_be_final && pos == target_room {
        State::Final(depth)
    } else {
        State::Initial(pos, depth)
    };

    Amphipod {
        state,
        movement_cost,
        target_room
    }
}

fn get_node_from_vec(v: Vec<Amphipod>) -> Node {
    let mut n = Node([
        v[0],
        v[1],
        v[2],
        v[3],
        v[4],
        v[5],
        v[6],
        v[7]
    ], None);

    if v.len() == 16 {
        n.1 = Some([
            v[8],
            v[9],
            v[10],
            v[11],
            v[12],
            v[13],
            v[14],
            v[15]
        ]);
    };

    n
}

fn get_vec_from_node(n: &Node) -> Vec<Amphipod> {
    let mut all_amphipods: Vec<_> = n.0.iter().map(|x| *x).collect();
    if let Some(rest) = n.1 {
        rest.iter().for_each(|x| all_amphipods.push(*x));
    }
    all_amphipods
}