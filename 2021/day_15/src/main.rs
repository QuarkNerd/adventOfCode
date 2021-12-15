use std::collections::HashMap;
use std::hash::Hash;

fn main() {
    let map: HashMap<(i16, i16), usize> = include_str!("include").lines().enumerate().flat_map(|(i, x)| {
        x.split("").filter(|x| !x.is_empty()).map(str::parse).enumerate().map(|(j, d)| ((i as i16, j as i16),d.unwrap())).collect::<Vec<_>>()
    }).collect();

    println!("Part one: {}", part_one(&map));
    println!("Part two: {}", part_two(&map));
}

fn part_one(map: &HashMap<(i16, i16), usize>) -> usize {
    get_lowest_score(
        (0,0), 
        |node| *map.get(node).unwrap(),
        |node| [
            (node.0 + 1, node.1), (node.0, node.1 - 1), (node.0, node.1 + 1), (node.0 - 1, node.1)
        ].into_iter().filter(|x| {
            map.get(x) != None
        }).collect(),
        (99,99))
}

fn part_two(map: &HashMap<(i16, i16), usize>) -> usize {
    get_lowest_score(
        (0,0), 
        |coor: &(i16, i16)| {
            let x = (coor.0)%100;
            let y = (coor.1)%100;
    
            let x_inc = ((coor.0)/100) as usize;
            let y_inc = ((coor.1)/100) as usize;
    
            if let Some(risk) = map.get(&(x,y)) {
                let mut new_risk = *risk + x_inc + y_inc;
                if new_risk > 9 {
                    new_risk= (new_risk%10)+1
                }
                return new_risk;
            };
             
            panic!("");
        },
        |node| [
            (node.0 + 1, node.1), (node.0, node.1 - 1), (node.0, node.1 + 1), (node.0 - 1, node.1)
        ].into_iter().filter(|node| {
            node.0 >= 0 && node.1 >= 0 && node.0 < 500 && node.1 < 500
        }).collect(),
        (499,499))
}

fn get_lowest_score<T, U, V>(start_node: T, get_node_score: U, get_connected_nodes: V, end_node: T) -> usize
where
    T: Clone + Eq + Hash + Copy,
    U: Fn(&T) -> usize, 
    V: Fn(&T) -> Vec<T>, {

        let mut lowest_scores = HashMap::new();
        let mut working_scores = HashMap::new();
    
        working_scores.insert(start_node, 0);
        
        while lowest_scores.get(&end_node) == None {
            let (&current_node, &current_node_score) = working_scores.iter().min_by(|(_,x1), (_, x2)| {
                x1.cmp(x2)
            }).unwrap();
    
            lowest_scores.insert(current_node, current_node_score);
            working_scores.remove(&current_node);
    
            for neighbor in get_connected_nodes(&current_node).into_iter().filter(|node| {
                            lowest_scores.get(node) == None
                        }) {
                            let new_score = get_node_score(&neighbor) + current_node_score;
                            let current_score = working_scores.entry(neighbor).or_insert(usize::MAX);
                            if new_score < *current_score {
                                *current_score = new_score;
                            }
                        };
        };

        *(lowest_scores.get(&end_node).unwrap())
    }
