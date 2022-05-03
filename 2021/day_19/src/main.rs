use std::{collections::{HashMap, HashSet}, ops::{Deref, Mul, DerefMut}};

use itertools::Itertools;
use ndarray::{arr1, arr2, Array1, Array2};

// FrameIndependentDisplacement is a tuple of 3 values, indcating the difference in positions of 2 coordinates,
// the order is not by axes and there are no nergatives to make them frame independent
// sorted by size for convention
// This map maps the FrameIndependentDisplacement to the surrounding coordinates (not frame independent)
type FrameIndependentDisplacementMap = HashMap<(usize, usize, usize), Vec<Array1<i128>>>;

fn main() {
    let input = include_str!("input").split("\r\n\r\n");

    let beacons_by_sensor: Vec<_> = input.map(|sensor_block_str| {
        let mut lines = sensor_block_str.lines();
        lines.next();
        lines.map(|line| {
            let mut split = line.split(",");
            arr1(&[split.next().unwrap().parse().unwrap(), split.next().unwrap().parse().unwrap(), split.next().unwrap().parse().unwrap()])
        }).collect()
    }).collect();

    let fids: Vec<_> = beacons_by_sensor.iter().map(|sesnor_set| get_frame_independent_displacements(sesnor_set)).collect();

    let mut possible_transformations = HashMap::new();
    let mut transformatons = HashMap::new();

    fids.into_iter().enumerate().combinations(2).for_each(|mut q| {
        let (sensor_a_num, sensor_a_fid) = q.pop().unwrap();
        let (sensor_b_num, sensor_b_fid) = q.pop().unwrap();

        let transformation = get_transform(&sensor_a_fid, &sensor_b_fid);
        if transformation.is_none() { return; }
        let transformation = transformation.unwrap();
        transformatons.insert((sensor_b_num, sensor_a_num), transformation.get_inverted());
        transformatons.insert((sensor_a_num, sensor_b_num), transformation);

        possible_transformations.entry(sensor_a_num).or_insert(vec![]).push(sensor_b_num);
        possible_transformations.entry(sensor_b_num).or_insert(vec![]).push(sensor_a_num);
    });

    let mut from_zero_transformation_map = HashMap::new();
    from_zero_transformation_map.insert(0, Transformation::get_identity());

    let mut current_sensor_list = vec![0];

    while from_zero_transformation_map.len() < beacons_by_sensor.len() {
        let mut new_set = vec![];

        for current_sensor in current_sensor_list.into_iter() {
            let connected = possible_transformations.get(&current_sensor).unwrap();
            for next_sensor in connected {
                if !from_zero_transformation_map.contains_key(next_sensor) {
                    let from_current_to_next = transformatons.get(&(current_sensor, *next_sensor)).unwrap().clone();
                    let from_zero_to_current = from_zero_transformation_map.get(&current_sensor).unwrap().clone();
                    let from_zero_to_next = Transformation::combine(from_zero_to_current, from_current_to_next);
                    from_zero_transformation_map.insert(*next_sensor, from_zero_to_next);
                    new_set.push(*next_sensor)
                }
            }
        }

        current_sensor_list = new_set;
    }

    let largest_distance = (0..beacons_by_sensor.len()).combinations(2).map(|a| {
        let translation_diff = &from_zero_transformation_map.get(&a[0]).unwrap().get_origin_position() - &from_zero_transformation_map.get(&a[1]).unwrap().get_origin_position();
        translation_diff.into_iter().map(|x| x.abs()).sum::<i128>()
    }).max().unwrap();

    let beacons_count = beacons_by_sensor.into_iter().enumerate().flat_map(|(i, sensors)| {
        let transformation = from_zero_transformation_map.get(&i).unwrap().get_inverted();
        sensors.into_iter().map(move |s| {
            transformation.apply_to(s)
        })
    }).collect::<HashSet<_>>().len();

    println!("Part one: {}", beacons_count);
    println!("Part two: {}", largest_distance);
}

fn get_transform(from_set: &FrameIndependentDisplacementMap, to_set: &FrameIndependentDisplacementMap) -> Option<Transformation> {
    let overlap: Vec<_> = from_set.keys().filter(|x| to_set.contains_key(x)).collect();
    if overlap.len() < 66 {
        return None;
    };
    let mut shared_sensor_mapping: HashMap<Array1<i128>, Vec<Array1<i128>>> = HashMap::new();

    for fid in overlap {
        let possible_coors_in_from = from_set.get(fid).unwrap();
        let possible_coors_in_to = to_set.get(fid).unwrap();

        for coor in possible_coors_in_from {
            let entry = shared_sensor_mapping.entry(coor.clone()).or_insert(possible_coors_in_to.clone());
            *entry = entry.iter().filter(|x| possible_coors_in_to.contains(x)).map(|x| x.clone()).collect(); 
        }
    };

    shared_sensor_mapping.iter().for_each(|(_, val)| {
        if val.len() != 1 {
            panic!("Invalid mapping found")
        }
    });

    let shared_sensor_mapping: HashMap<_,_> = shared_sensor_mapping.into_iter().map(|(a,mut b_vec)| (a, b_vec.pop().unwrap())).collect();

    let mut rotate = None;
    for pair in shared_sensor_mapping.keys().combinations(2) {
        let diff: Array1<i128> = pair[0] - pair[1];
        let diff_abs = get_abs_each_axis(&diff);
        if diff_abs[0] == diff_abs[1] || diff_abs[1] == diff_abs[2] || diff_abs[0] == diff_abs[2] || diff_abs[0] == 0 || diff_abs[1] == 0 || diff_abs[0] == 0  { continue; }

        rotate = Some(determine_rotate(&diff, &(shared_sensor_mapping.get(pair[0]).unwrap() - shared_sensor_mapping.get(pair[1]).unwrap()) ));
        break;
    }

    let rotate = rotate.unwrap();

    let coor = shared_sensor_mapping.keys().next().unwrap();
    let rotated_coor = rotate.apply_to(coor);
    let translation = shared_sensor_mapping.get(coor).unwrap() - rotated_coor;

    Some(Transformation {
        rotate,
        translation
    })
}

fn determine_rotate(inital: &Array1<i128>, target: &Array1<i128>) -> Rotate {
    Rotate(arr2(
        &[
            determine_rotation_matrix_row(target[0], inital),
            determine_rotation_matrix_row(target[1], inital),
            determine_rotation_matrix_row(target[2], inital)
        ]
    ))
}

fn determine_rotation_matrix_row(val: i128, coor: &Array1<i128>) -> [i128; 3] {
    let mut element = coor.iter().map(|&x| {
        if val == x {
            1
        } else if val == -1 * x {
            -1
        } else {
            0
        }
    });
    
    [element.next().unwrap(), element.next().unwrap(), element.next().unwrap()]
}

#[derive(Clone)]
struct Transformation {
    rotate: Rotate,
    translation: Array1<i128>
}

impl Transformation {
    fn apply_to(&self, vec: Array1<i128>) -> Array1<i128> {
        let rotated = self.rotate.apply_to(&vec);
        rotated + &self.translation
    }

    fn get_inverted(&self) -> Self {
        let inverted_rotation = self.rotate.get_inverted();
        let rotated_shift = inverted_rotation.apply_to(&self.translation);
        let new_shift = [- rotated_shift[0], - rotated_shift[1], - rotated_shift[2]];
        Self {
            rotate: inverted_rotation,
            translation: arr1(&new_shift)
        }
    }

    fn get_identity() -> Self {
        Self {
            rotate: Rotate(arr2(&[
                [1, 0, 0],
                [0, 1, 0],
                [0, 0, 1]
            ])),
            translation: arr1(&[0, 0, 0])
        }
    }

    fn combine(first: Transformation, second: Transformation) -> Self {
        let rotate = second.rotate.clone() * first.rotate;
        let translation = second.rotate.apply_to(&first.translation) + second.translation;

        Self {
            rotate,
            translation
        }
    }

    fn get_origin_position(&self) -> Array1<i128> {
        self.rotate.get_inverted().apply_to(&self.translation)
    }
}

impl Mul for Transformation {
    type Output = Self;

    fn mul(self, rhs: Self) -> Self {
        let rotate = self.rotate * rhs.rotate.clone();
        let translation = rhs.rotate.apply_to(&self.translation) + rhs.translation;
        Self {
            rotate,
            translation
        }
    }
}

#[derive(Clone, Hash, Debug)]
struct Rotate(Array2<i128>);

impl Rotate {
    fn apply_to(&self, vec: &Array1<i128>) -> Array1<i128> {
        self.dot(vec)
    }
    fn get_inverted(&self) -> Self {
        let mut cl = self.clone();
        cl.swap_axes(0, 1);
        cl
    }
}

impl Deref for Rotate {
    type Target = Array2<i128>;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

impl DerefMut for Rotate {
    fn deref_mut(&mut self) -> &mut Self::Target {
        &mut self.0
    }
}

impl Mul for Rotate {
    type Output = Self;

    fn mul(self, rhs: Self) -> Self {
        Self(self.dot(&rhs.0))
    }
}

fn get_frame_independent_displacements (set: &Vec<Array1<i128>>) -> FrameIndependentDisplacementMap {
    set.iter().combinations(2).map(|coors| {
        let mut a  = vec![(coors[0][0] - coors[1][0]).abs() as usize, (coors[0][1] - coors[1][1]).abs() as usize, (coors[0][2] - coors[1][2]).abs() as usize];
        a.sort();
        ((a[0], a[1], a[2]), vec![coors[0].clone(), coors[1].clone()])
    }).collect()
}

fn get_abs_each_axis(arr: &Array1<i128>) -> Array1<usize> {
    arr1(&[arr[0].abs() as usize, arr[1].abs() as usize, arr[2].abs() as usize])
}
