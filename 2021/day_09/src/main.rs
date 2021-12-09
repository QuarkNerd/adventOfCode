use std::collections::HashMap;
use std::collections::HashSet;
use itertools::Itertools;

fn main() {
    let grid: HashMap<(i32, i32), usize> = include_str!("input").lines().enumerate().flat_map(
        |(i, line)|
            line.split("")
            .filter(|s| !s.is_empty())
            .map(str::parse::<usize>)
            .enumerate()
            .map(|(j,height)| ((i as i32, j as i32), height.unwrap()))
            .collect::<Vec<_>>()
    ).collect();

    let low_points: Vec<_> = grid.iter().filter(|((i,j), height)| {
        !([(i + 1, *j), (i - 1, *j), (*i, j + 1), (*i, j - 1)].into_iter()
        .any(|neighbor| {
            if let Some(neighbour_height) = grid.get(&neighbor) {
                return neighbour_height <= height;
            }
            false
        }))
    }).collect();

    println!("Part one: {}", low_points.iter().map(|(_, height)| *height + 1).sum::<usize>());
    let mut basin_sizes: Vec<_> = low_points.into_iter().map(|(coor, _)| calculate_basin_size(*coor, &grid)).collect();
    basin_sizes.sort_by(|a, b| b.cmp(a));
    println!("Part two: {}", basin_sizes.into_iter().take(3).product::<usize>());
}

fn calculate_basin_size(low_point: (i32, i32), grid: &HashMap<(i32, i32), usize>) -> usize {
    let mut visited_nodes = HashSet::new();
    let mut to_visit = vec!(low_point);

    let mut size = 0;

    while to_visit.len() != 0 {
        to_visit.iter().for_each(|node| {visited_nodes.insert(*node);});
        let valid_nodes: Vec<_> = to_visit.iter().filter(|node| {
            let height = grid.get(node);
            if let Some(h) = height {
                return h < &&9;
            }
            false
        }).collect();

        size += valid_nodes.len();

        to_visit = valid_nodes
            .into_iter()
            .flat_map(|(i, j)| [(i + 1, *j), (i - 1, *j), (*i, j + 1), (*i, j - 1)].into_iter().collect::<Vec<_>>())
            .filter(|node| !visited_nodes.contains(node))
            .unique()
            .collect();
    }
    size
}
