use std::collections::{HashMap, HashSet};
fn main() {

    let operations: Result<Vec<Operation>,_> = include_str!("input").lines().filter(|x| !x.starts_with("inp")).map(str::parse).collect();
    let operations = operations.unwrap();
    let chunks: Vec<_> = operations.chunks(17).collect();
    let mut input_states: Vec<_> = vec![State {
        inputs: [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        z: 0
    }];

    for i in 0..14 {
        let mut current_zs = HashSet::new();
        println!("{}", i);
        input_states = input_states.into_iter()
            .filter(|x| {
                x.z < 26_i64.pow(14-i as u32)
            })
            .flat_map(|st| {
                (1..=9).map(move |w| {
                    let mut inp = st.inputs;
                    inp[i] = w;
                    State {
                        inputs: inp,
                        z: st.z
                    }
                })
            })
            .filter_map(|st| {
                let z = apply_operation_chunk(st.inputs[i], st.z, chunks[i]);
                if !current_zs.insert(z) {return None}
                Some(State {
                    inputs: st.inputs,
                    z
                })
        }).collect();
    }

    println!("{}", input_states.into_iter().find(|x| x.z == 0).map(|x| x.inputs.into_iter().map(|x| x.to_string()).collect::<String>()).unwrap());
}



fn apply_operation_chunk(w: i64, z: i64, operation_chunk: &[Operation]) -> i64 {
    let mut vals = HashMap::new();
    vals.insert("w", w);
    vals.insert("x", 0);
    vals.insert("y", 0);
    vals.insert("z", z);
    for op in operation_chunk {
        let Operation {
            par_1,
            par_2,
            action
        } = op;

        let par_1 = par_1.as_str();
        let val_2 = match par_2 {
            Param::Value(x) => *x,
            Param::Variable(x) => vals[x.as_str()]
        };
            
        match action {
            Action::Add => *vals.get_mut(par_1).unwrap() += val_2,
            Action::Mul => *vals.get_mut(par_1).unwrap() *= val_2,
            Action::Div => *vals.get_mut(par_1).unwrap() /= val_2,
            Action::Mod => *vals.get_mut(par_1).unwrap() %= val_2,
            Action::Eql => *vals.get_mut(par_1).unwrap() = if vals[par_1] == val_2 {1} else {0},
            _ => panic!("")
        };
    };
    return vals["z"];
}

struct Operation {
    par_1:  String,
    par_2:  Param,
    action: Action
}

impl std::str::FromStr for Operation {
    type Err = &'static str;
    fn from_str(s: &str) -> Result<Self, Self::Err> {
        let mut spl = s.split(" ");

        let action: Action = spl.next().unwrap().parse().unwrap();
        let par_1 = spl.next().unwrap().to_string();
        let par_2 = spl.next().unwrap();

        let par_2 = if let Ok(i) = par_2.parse() {
            Param::Value(i)
        } else {
            Param::Variable(par_2.to_string())
        };

        Ok(Operation {
            par_1,
            par_2,
            action
        })
    }
}

enum Action {
    Add,
    Mul,
    Div,
    Mod,
    Eql
}

impl std::str::FromStr for Action {
    type Err = &'static str;
    fn from_str(s: &str) -> Result<Self, Self::Err> {
        use Action::*;
        match s {
            "add" =>  Ok(Add),
            "mul" =>  Ok(Mul),
            "div" =>  Ok(Div),
            "mod" =>  Ok(Mod),
            "eql" =>  Ok(Eql),
            _ => Err("Invalid string")
        }
    }
}

enum Param {
    Value(i64),
    Variable(String)
}

#[derive(Debug)]
struct State {
    inputs: [i64; 14],
    z: i64
}