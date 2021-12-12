use std::collections::{HashMap, HashSet};
use std::hash::{Hash};

fn main() {
    let mut node_map: HashMap<Node, HashSet<Node>> = HashMap::new();
    for line in include_str!("input").lines() {
        let mut  iter = line.split("-");
        let node_a: Node = iter.next().unwrap().parse().unwrap();
        let node_b: Node = iter.next().unwrap().parse().unwrap();

        let entry_a = node_map.entry(node_a).or_insert(HashSet::new());
        entry_a.insert(node_b);
        let entry_b = node_map.entry(node_b).or_insert(HashSet::new());
        entry_b.insert(node_a);
    }

    println!("{}", part_one(&node_map));
    println!("{}", part_two(&node_map));
}

fn part_one(node_map: &HashMap<Node, HashSet<Node>>) -> usize {
    count_paths(
        State(Node::Start, HashSet::new()),
        |n: &State| {
            node_map.get(&n.0).unwrap().into_iter().filter_map(|x| {
                let mut hist = n.1.clone();
                match x {
                    Node::Start => { None }
                    Node::SmallCave(cave_id) => {
                        if hist.contains(cave_id) { return None; };
                        hist.insert(*cave_id);
                        Some(State(*x, hist))
                    },
                    _ => {
                        Some(State(*x, hist))
                    }
                }
            }).collect()
        },
        |s: &State| s.0 == Node::End
    )
}

fn part_two(node_map: &HashMap<Node, HashSet<Node>>) -> usize {
    count_paths(
        State(Node::Start, HashSet::new()),
        |n: &State| {
            node_map.get(&n.0).unwrap().into_iter().filter_map(|x| {
                let mut hist = n.1.clone();
                match x {
                    Node::Start => { None }
                    Node::SmallCave(cave_id) => {
                        if hist.contains(cave_id) {
                            // 0 is code for duplicate small cave visit
                            if hist.contains(&0) {return None;}
                            hist.insert(0);
                            return Some(State(*x, hist));
                        }
                        hist.insert(*cave_id);
                        Some(State(*x, hist))
                    },
                    _ => {
                        Some(State(*x, hist))
                    }
                }
            }).collect()
        },
        |s: &State| s.0 == Node::End
    )
}

// HashSet is for visited small caves
#[derive(Clone, Debug, PartialEq, Eq)]
struct State(Node, HashSet<u16>);

#[derive(Debug, PartialEq, Eq, Hash, Copy, Clone)]
enum Node {
    Start,
    End,
    SmallCave(u16),
    LargeCave(u16)
}

impl std::str::FromStr for Node {
    type Err = &'static str;
    
    fn from_str<'a>(s: &'a str) -> Result<Self, Self::Err> {
        use Node::*;
        match s {
            "start" => Ok(Start),
            "end" => Ok(End),
            _ => {
                let mut chars = s.chars();
                let code = get_alphabet_pos(chars.next().unwrap())*100 + 
                                get_alphabet_pos(chars.next().unwrap());
                if s.to_uppercase() == s {
                    Ok(LargeCave(code))
                } else {
                    Ok(SmallCave(code))
                }
            }

        }
    }
}

fn count_paths<T, U, V>(start_node: T, get_connected_nodes: U, is_end: V) -> usize
where
    T: Clone,
    U: Fn(&T) -> Vec<T>, 
    V: Fn(&T) -> bool, {

    let mut valid_complete_paths = Vec::new();
    let mut active_paths = vec!(vec!(start_node));
        
    while active_paths.len() != 0 {
        let (mut new_valid_complete_paths, new_active_paths): (Vec<_>, Vec<_>) = 
            active_paths
            .into_iter()
            .filter_map(|path| {
                let nexts  = get_connected_nodes(&path[path.len() - 1]);
                if nexts.len() == 0 { return None; }
                let paths = nexts.into_iter().map(move |next| {   
                    let mut new_path = path.clone();
                    new_path.push(next);
                    new_path
                });
                Some(paths)
            })
            .flatten()
            .partition(|path| is_end(&path[path.len() - 1]));
        active_paths = new_active_paths;
        valid_complete_paths.append(&mut new_valid_complete_paths);
    }

    valid_complete_paths.len()
}

fn get_alphabet_pos(ch: char) -> u16 {
    let asc = ch as u32;

    if asc > 64 && asc < 91 {
        return (asc - 64) as u16;
    } else if asc > 96 && asc < 123 { 
        return (asc - 96) as u16;
    }
    panic!("Invalid char - {}", ch)
}

// impl Hash for State {
//     fn hash<H: Hasher>(&self, state: &mut H) {
//         self.0.hash(state);
//         self.1.iter().map(|x| x.to_string()).collect::<Vec<_>>().join("-").hash(state);
//     }
// }

// how would do this
// fn from_str<'a>(s: &'a str) -> Result<Self, Self::Err> {
//     use Node::*;
//     match s {
//         "start" => Ok(Start),
//         "end" => Ok(End),
//         _ => {
//             if s.to_uppercase() == s {
//                 Ok(LargeCave(s))
//             } else {
//                 Ok(SmallCave(s))
//             }
//         }

//     }
// }