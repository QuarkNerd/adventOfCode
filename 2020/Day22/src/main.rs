use std::iter::FromIterator;
use std::collections::HashSet;

fn main() {
    let mut cards = get_input();

    while cards.0.len() > 0 && cards.1.len() > 0 {
        let (card_zero, card_one) =  (cards.0.remove(0), cards.1.remove(0));
        if card_zero > card_one {
            cards.0.push(card_zero);
            cards.0.push(card_one);
        } else {
            cards.1.push(card_one);
            cards.1.push(card_zero);
        }
    }

    let winner_score = if cards.0.len() == 0 {
        calculate_score(&cards.1)
    } else {
        calculate_score(&cards.0)
    };

    println!("Part one: {}", winner_score);


    let mut cards = get_input();

    let winner_score = if does_player_zero_win_recursive_crab_combat(&mut cards) {
        calculate_score(&cards.0)
    } else {
        calculate_score(&cards.1)
    };

    println!("Part two: {}", winner_score);
}

fn does_player_zero_win_recursive_crab_combat(cards: &mut (Vec<u64>,  Vec<u64>)) -> bool {
    let mut history = HashSet::new();

    while cards.0.len() > 0 && cards.1.len() > 0 {
        if !history.insert((calculate_score(&cards.0), calculate_score(&cards.1))) {
            return true;
        };

        let (card_zero, card_one) =  (cards.0.remove(0), cards.1.remove(0));

        let does_zero_win_round;
        if cards.0.len() as u64 >= card_zero && cards.1.len() as u64 >= card_one {

            does_zero_win_round = does_player_zero_win_recursive_crab_combat(&mut (
                Vec::from_iter(cards.0[0..card_zero as usize].iter().cloned()),
                Vec::from_iter(cards.1[0..card_one as usize].iter().cloned())
            ));
        } else {
            does_zero_win_round = card_zero > card_one;
            if card_zero == card_one {
                panic!("s");
            }
        };

        if does_zero_win_round {
            cards.0.push(card_zero);
            cards.0.push(card_one);
        } else {
            cards.1.push(card_one);
            cards.1.push(card_zero);
        }
    };

    cards.1.len() == 0
}

fn calculate_score(deck: &Vec<u64>) -> u64 {
    let mut score = 0;
    let len = deck.len();
    for i in 1..len+1 {
        score += i as u64 * deck[len - i]
    };
    score
}

fn get_input() -> (Vec<u64>, Vec<u64>) {
    let mut inp: Vec<_> = INPUT.split("\n\n").map(|x| x.split(":\n").nth(1).unwrap().split('\n').map(|x| x.parse::<u64>().unwrap()).collect::<Vec<_>>()).collect();
    (inp.remove(0), inp.remove(0))
}

static INPUT: &str = 
"Player 1:
40
28
39
7
6
16
1
27
38
8
15
3
26
9
30
5
50
17
20
45
34
10
21
14
43

Player 2:
4
49
35
11
32
12
48
23
47
22
46
13
18
41
24
36
37
44
19
42
33
25
2
29
31";