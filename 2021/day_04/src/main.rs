use std::collections::HashMap;

fn main() {
    let mut input = include_str!("input").split("\r\n\r\n");
    let numbers = input.next().unwrap().split(",").map(|x| x.parse().unwrap());
    let mut boards: Vec<Board> =  input.map(|x| Board::new(x)).collect(); 

    let mut first_found = false;

    for num in numbers {
        for i in (0..boards.len()).rev() {
            if boards[i].mark(&num) {
                if !first_found {
                    println!("Part one: {}", (num as u16)*boards[i].sum_unmarked());
                    first_found = true;
                }
                if boards.len() == 1 {
                    println!("Part two: {}", (num as u16)*boards[i].sum_unmarked());
                }
                boards.remove(i);
            };
        };
    };
}

struct Board {
    number_to_coor: HashMap<u8,(usize,usize)>,
    unmarked_in_rows_count: [u8; 5],
    unmarked_in_columns_count: [u8; 5],
}

impl Board {
    fn new(s: &str) -> Board {
        let mut number_to_coor = HashMap::new();
        for (i, line) in s.lines().enumerate() {
            for (j, num) in line.split(' ').filter(|x| x != &"").enumerate() {
                number_to_coor.insert(
                    num.parse().unwrap(),
                    (i, j)
                );
            }
        }

        Board {
            number_to_coor,
            unmarked_in_columns_count: [5; 5],
            unmarked_in_rows_count: [5; 5],
        }
    }

    // returns true if mark resulted in a win
    fn mark(&mut self, num: &u8) -> bool {
        if let Some(coor) = self.number_to_coor.remove(num) {
            self.unmarked_in_columns_count[coor.0] -= 1;
            self.unmarked_in_rows_count[coor.1] -= 1;
            return self.unmarked_in_columns_count[coor.0] == 0 || self.unmarked_in_rows_count[coor.1] == 0;
        }
        false
    }

    fn sum_unmarked(&self) -> u16 {
        self.number_to_coor.keys().map(|x| *x as u16).sum()
    }
}

// efficeny u8 + conversion vs usize
// better as opposed to normal loop
