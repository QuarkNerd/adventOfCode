use std::{collections::HashMap, cmp::min};

fn main() {
    let player_one = PlayerState {
        position:8,
        score: 0
    }; 
    let player_two = PlayerState {
        position: 7,
        score:0
    };

    part_one(player_one, player_two);
    part_two(player_one, player_two)
}

fn part_one(player_one: PlayerState, player_two: PlayerState) {
    let mut state = GameState {
        player_one,
        player_two,
        winning_score: 1000,
        is_player_one_next: true
    };
    let mut d = Dice(100,0);

    loop {
        state = state.next(d.roll() + d.roll() + d.roll());

        if let Some((_, loser)) = state.get_loser() {
            println!("Part one: {}", d.1*loser.score);
            break;
        }
    }
}

fn part_two(player_one: PlayerState, player_two: PlayerState) {
    let initial_state = GameState {
        player_one,
        player_two,
        winning_score: 21,
        is_player_one_next: true
    };
    
    let mut states_count = HashMap::new();
    states_count.insert(initial_state, 1);
    let possible_rolls = get_possible_triple_rolls();

    let mut pl_one_win_count = 0;
    let mut pl_two_win_count = 0;

    while states_count.len() > 0 {
        let mut new_states_count = HashMap::new();
        for x in states_count.into_iter() {
            for y in possible_rolls.iter() {
                let state = x.0.next(*y.0);
                let count = x.1 * y.1;

                match state.get_winner() {
                    Some((x,_)) if x == 1 => { pl_one_win_count += count},
                    Some((x, _)) if x == 2 => { pl_two_win_count += count},
                    None => {
                        *new_states_count.entry(state).or_insert(0) += count;
                    },
                    _ => panic!("")
                }
            }
        }
        states_count = new_states_count;
    }

    println!("Part two: {}", min(pl_one_win_count, pl_two_win_count));
}

struct Dice(usize,usize);

impl Dice {
    fn roll(&mut self) -> usize {
        self.1 += 1;
        self.0 += 1;
        if self.0 == 101 {self.0 = 1};
        return self.0;
    }
}

#[derive(Clone, Copy, PartialEq, Eq, Hash)]
struct GameState {
    player_one: PlayerState,
    player_two: PlayerState,
    is_player_one_next: bool,
    winning_score: usize
}

impl GameState {
    fn next(&self, roll: usize) -> Self {
        if self.is_player_one_next {
            return GameState {
                player_one: self.player_one.next(roll),
                is_player_one_next: !self.is_player_one_next,
                ..*self
            }
        }
        GameState {
            player_two: self.player_two.next(roll),
            is_player_one_next: !self.is_player_one_next,
            ..*self
        }
    }
    fn get_winner(&self) -> Option<(usize, PlayerState)> {
        if self.player_one.score >= self.winning_score {
            return Some((1, self.player_one));
        };
        if self.player_two.score >= self.winning_score {
            return Some((2, self.player_two));
        };
        None
    }
    fn get_loser(&self) -> Option<(usize, PlayerState)> {
        if self.player_one.score >= self.winning_score {
            return Some((2, self.player_two));
        };
        if self.player_two.score >= self.winning_score {
            return Some((1, self.player_one));
        };
        None
    }
}

#[derive(Clone, Copy, PartialEq, Eq, Hash)]
struct PlayerState {
    position: usize,
    score: usize
}

impl PlayerState {
    fn next(&self, roll: usize) -> Self {
        let position = (self.position + roll)%10;
        let position = if position == 0 {10} else {position};
        PlayerState {
            position,
            score: self.score + position
        }
    }
}

fn get_possible_triple_rolls() -> HashMap<usize,usize> {
    let mut a = HashMap::new();
    for i in 1..=3 {
        for j in 1..=3 {
            for k in 1..=3 {
                *a.entry(i+j+k).or_insert(0) += 1
            };
        };
    };
    a
}
