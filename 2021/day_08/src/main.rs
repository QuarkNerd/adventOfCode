use std::collections::HashMap;
use itertools::sorted;

fn main() {
    let outputs: Vec<_> = include_str!("input").lines().map(|x| {
        let mut split = x.split(" | ");
        let list = split.next().unwrap();

        let (unique_segment_digits , ambigious_digits):(_,Vec<_>) = list.split(" ")
        .partition(|x| x.chars().count() == 2 || x.chars().count() == 4 || x.chars().count() == 3 || x.chars().count() == 7);

        let counts_in_unique_digits = into_char_map(&unique_segment_digits.join(""));
        let counts_in_ambigious_digits = into_char_map(&ambigious_digits.join(""));
        let conversion = get_segment_conversion_hashmap(counts_in_ambigious_digits, counts_in_unique_digits);

        let output = split.next().unwrap();
        output.split(" ").map(|dig| {
            let segments = sorted(dig.chars().map(|x| conversion[&x])).into_iter().collect::<String>();
            match segments.as_str() {
                "ABCEFG" => 0,
                "CF" => 1,
                "ACDEG" => 2,
                "ACDFG" => 3,
                "BCDF" => 4,
                "ABDFG" => 5,
                "ABDEFG" => 6,
                "ACF" => 7,
                "ABCDEFG" => 8,
                "ABCDFG" => 9,
                _ => panic!("Unexpected segments {}", segments)
            }
        }).collect::<Vec<_>>()
    }).collect();

    let unique_digits_count = outputs.iter().flatten().filter(|x| x == &&1 || x == &&4 || x == &&7 || x == &&8).count();
    let sum =  outputs.into_iter().map(|x| x[0]*1000 + x[1]*100 + x[2]*10 + x[3]).sum::<usize>();

    println!("Part one: {}", unique_digits_count);
    println!("Part two: {}", sum);
}

fn get_segment_conversion_hashmap(counts_in_ambigious_digits: HashMap<char,u8>, counts_in_unique_digits: HashMap<char,u8>) -> HashMap<char,char> {
    ['a', 'b', 'c', 'd', 'e', 'f','g'].into_iter().fold(HashMap::new(), |mut acc, ch| {
        let matching = match (counts_in_ambigious_digits.get(&ch).unwrap(), counts_in_unique_digits.get(&ch).unwrap()) {
            (6, 2) => 'A',
            (4, 2) => 'B',
            (4, 4) => 'C',
            (5, 2) => 'D',
            (3, 1) => 'E',
            (5, 4) => 'F',
            (6, 1) => 'G',
            other => panic!("Unexpeced counts {:?} of char {}", other, ch)
        };
        acc.insert(ch, matching);
        acc
    })
}

fn into_char_map(word: &str) -> HashMap<char, u8> {
    word.chars().fold(HashMap::new(), |mut acc, char| {
        *acc.entry(char).or_insert(0) += 1;
        acc
    })
}
