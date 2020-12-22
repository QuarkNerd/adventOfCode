use std::collections::HashSet;
use std::collections::HashMap;
use std::time::Instant;


// struct Node {
    //     a: Option<Box<Node>>,
    //     b: Option<Box<Node>>,
    //     can_terminate: bool
    // }
    
fn main() {
    let now = Instant::now();
        
    let inp: Vec<_> = INPUT.split("\n\n").collect();
    let mut rule_dict = HashMap::new();
    for rule in inp[0].split('\n')  {
        let split: Vec<_> = rule.split(": ").collect();
        rule_dict.insert(split[0], split[1].to_string());
    }
    let mut memoised_res = HashMap::new();
    let possible_messages = get_allowed(&rule_dict, "0",&mut memoised_res);
    let possible_messages: HashSet<_> = possible_messages.iter().map(|x| x.as_str()).collect();
    let messages: HashSet<_> = inp[1].split('\n').into_iter().collect();
    let valid_messages: HashSet<_> = messages.intersection(&possible_messages).collect();
    let invalid_messages: HashSet<_> = messages.difference(&possible_messages).collect();

    println!("{:?}", now.elapsed());
    println!("Part One: {}", valid_messages.len());
    println!("Part One: {}", invalid_messages.len());
    
    let repetition_possible: Vec<_> = possible_messages.iter().filter(|x| x.contains("%%")).collect();
    println!("Part One: {}", &repetition_possible[5]);
    
    for r in repetition_possible {
        for a in &invalid_messages {
            let a = 66+88;
        }
    }


    // for line in INPUT_NEW_RULES.split('\n') {
    //     let split: Vec<_> = line.split(": ").collect();
    //     let rule_name = split[0];
    //     let options: Vec<_> = split[1].split(" | ").collect();

    //     let mut options_to_insert = Vec::new();
    //     let original_rule = options[0];
    //     options_to_insert.push(original_rule.to_string());

    //     let new_rule =  options[1];

    //     let subrules: Vec<_> = new_rule.split(' ').collect();

    //     //let mut unit_length = 0;
    //     for subru in subrules {
    //         if subru != rule_name {
    //             //unit_length += memoised_res.get(&subru).iter().len();
    //             //println!("{:?}", memoised_res.get(&subru));
    //         }
    //     }

    //     //let times = max_len/unit_length;
    //     //println!("{}", times);
    //     //println!("{}", max_len);

    //     let mut new_opt = new_rule.to_string();

    //     let mut rule_plus_space = " ".to_owned();
    //     rule_plus_space.push_str(rule_name);
    //     for _ in 0..2 {
    //         new_opt = new_opt.replace(rule_name, new_rule);

    //         options_to_insert.push(new_opt.replace(&rule_plus_space, ""));
    //     }

    //     println!("{}--{}", rule_name, options_to_insert.join(" | "));
    //     rule_dict.insert(rule_name,options_to_insert.join(" | "));
    // }


    // let mut memoised_res = HashMap::new();
    // let a = get_allowed(&rule_dict, "0",&mut memoised_res);
    // let a: HashSet<_> = a.iter().map(|x| x.as_str()).collect();

    // let b: HashSet<_> = inp[1].split('\n').into_iter().collect();

    // let c: Vec<_> = a.intersection(&b).into_iter().collect();
    // println!("Part One: {}", c.len());
}

fn get_allowed<'a, 'b>(rule_dict: &'a HashMap<&'a str, String>, rule_name: &'a str, memoised_res: &mut HashMap<&'a str,  Vec<String> >) -> Vec<String> {
    let rule = &rule_dict[rule_name];
    if &rule[0..1] == "\"" {
        let mut a = Vec::new();
        a.push(rule[1..2].to_owned());
        return a;
    };

    
    if let Some(allowed) = memoised_res.get(rule_name) {
        return allowed.clone();
    }

    let mut ret = Vec::new();
    let options: Vec<_> = rule.split(" | ").collect();

    for opt in &options {
        let subrules: Vec<_> = opt.split(' ').collect();

        if subrules.iter().any(|&i| i==rule_name) {
            let mut rep_marker = "%%".to_owned();
            rep_marker.push_str(opt);
            rep_marker.push_str("%%");
            ret.push(rep_marker);
        } else {

            
            let mut al = Vec::new();
            al.push("".to_string());
            
            let mut al = subrules.iter().fold(al, |acc, subrule| {
                let mut combined = Vec::new();
                let allowed_by_subrule = get_allowed(rule_dict, subrule, memoised_res);
                for rule_one in acc {
                    for two in &allowed_by_subrule {
                        let mut r = rule_one.clone();
                        r.push_str(two);
                        combined.push(r);
                    }
                }
                combined
            });
            
            ret.append(&mut al);
        }
    };

    memoised_res.insert(&rule_name, ret.clone());
    ret
}

static INPUT: &str = 
"44: 82 117 | 26 54
4: 94 117 | 94 54
86: 54 54
110: 117 66 | 54 17
7: 4 54 | 22 117
16: 117 27 | 54 15
36: 117 38 | 54 110
40: 117 117 | 54 56
37: 97 117
84: 120 54 | 55 117
96: 17 54 | 66 117
129: 16 54 | 116 117
10: 108 54 | 41 117
63: 54 97 | 117 40
23: 86 54 | 130 117
45: 54 130 | 117 53
32: 54 37 | 117 114
62: 119 54 | 60 117
71: 107 54 | 134 117
76: 27 117 | 70 54
42: 115 54 | 25 117
99: 54 91 | 117 12
15: 54 94 | 117 94
64: 56 54 | 117 117
114: 54 17 | 117 86
75: 87 117 | 51 54
0: 8 11
91: 117 54 | 117 117
8: 42 | 42 8
38: 40 56
1: 54 73 | 117 85
132: 117 104 | 54 17
134: 33 54 | 127 117
28: 12 54
123: 66 117 | 53 54
107: 117 123 | 54 111
68: 22 54 | 79 117
87: 58 54 | 100 117
31: 54 75 | 117 1
78: 117 12 | 54 118
12: 54 117 | 54 54
92: 54 40 | 117 64
97: 54 117
34: 54 12 | 117 64
20: 91 56
2: 54 13 | 117 99
17: 117 54 | 54 54
51: 117 71 | 54 3
131: 104 54 | 86 117
94: 117 54
5: 56 56
3: 89 54 | 109 117
41: 103 54 | 49 117
25: 117 80 | 54 121
81: 122 117 | 28 54
85: 54 47 | 117 65
39: 97 117 | 12 54
77: 97 54 | 66 117
22: 64 54 | 104 117
119: 97 54 | 17 117
33: 86 117 | 86 54
100: 61 117 | 36 54
35: 50 117 | 119 54
90: 54 94 | 117 86
57: 54 95 | 117 96
112: 12 117 | 66 54
115: 54 44 | 117 52
26: 126 54 | 76 117
105: 54 20 | 117 98
120: 130 117 | 64 54
83: 54 92 | 117 112
66: 56 54 | 54 117
79: 91 117 | 64 54
128: 117 48 | 54 127
11: 42 31 | 42 11 31
70: 117 97 | 54 118
6: 62 54 | 7 117
116: 117 101 | 54 133
27: 12 54 | 104 117
118: 117 117
46: 64 54 | 66 117
52: 30 54 | 124 117
80: 117 129 | 54 9
13: 117 104 | 54 40
89: 106 117 | 34 54
127: 91 54 | 64 117
88: 56 66
130: 117 117 | 54 117
9: 69 117 | 81 54
106: 97 117 | 66 54
124: 117 32 | 54 83
109: 54 90 | 117 125
121: 117 6 | 54 10
133: 66 56
113: 130 117 | 118 54
30: 18 54 | 102 117
48: 56 17
122: 94 117 | 40 54
49: 17 117 | 104 54
60: 54 94 | 117 66
55: 54 40 | 117 118
95: 97 54
29: 133 117 | 48 54
101: 40 117 | 12 54
98: 5 117 | 91 54
21: 54 118 | 117 40
111: 118 54 | 12 117
102: 54 111 | 117 43
135: 105 117 | 35 54
58: 54 93 | 117 84
65: 24 54 | 57 117
19: 54 17 | 117 94
126: 131 117 | 63 54
59: 117 13 | 54 77
82: 54 2 | 117 128
125: 117 91 | 54 12
74: 97 54 | 86 117
18: 54 39 | 117 46
24: 54 113 | 117 21
104: 56 117 | 117 54
117: \"b\"
108: 117 88 | 54 122
47: 67 117 | 59 54
69: 117 78 | 54 33
67: 54 19 | 117 132
61: 117 74 | 54 23
14: 54 29 | 117 68
54: \"a\"
43: 104 54 | 53 117
56: 54 | 117
103: 54 130 | 117 118
93: 117 72 | 54 45
73: 117 14 | 54 135
72: 117 118 | 54 118
53: 117 117 | 54 54
50: 117 97 | 54 94

bbabbaabbbaabaaaabbbbaabaabbaabbabbbbabb
bbbaaababbabbbaababbaaaaaaabaaabbbabbbab
bbaaabbbababbbaaabaabaabaaaaabaa
baabbbbaababbbbbaaaaaaabaaaabbbbaabaabaa
bbbabbabbbaababbabbbbbbbababbabaaaababbbbaababaaaaaaabab
bbbababbaababaaaabaaabbaabbbababbbbbaababaababbbaabbaaaababbbbab
bbaabaaaabbaaabbbababbabbbbaaaabbaababbababaaabbbabbbbaa
aabbbaabaabbabbbbbaaabaa
babbabbaabbbaabbbabbbbab
baababababbaababbbaaaaaabaabbaaabbbbbbbbabbbbabbaababbabaaabaaababbaabaa
aabbaaabaabbabaabbbabbaa
babaabbbaabaabaabababaababbabbba
aabbabbbbbbbaaaaaabaaabb
aaaabbbabbbbaabaabbbabaa
aabbaaabaababaaaabbbbaaa
babaaaaaabbabbbaaaabbbaa
bbaabbbbbbbaaabbbbabbbaa
abbbaaababaaababaaabaabaaabaababababababaaaababaabaaaabbaabbbabb
baaaababaabbabaabbbbaabbaabbaaabbbbabaaaaabababbbbaaabaa
bbbababaaabbabaaaaaabaabababaaaaabbaabbbababbbabbababaab
bbbbbbaabaaaabbbaababaabbbaaabba
baabaabaaaabbaaaabbbbbaabbaabaaaabaaabaaaaaaabbb
aaababbbbbbbbbaabaababaa
ababaaababbbababaaaabbbbababbbaaaaabaabb
aabababaaaabbbbaaaaaabab
abbabbbbaaaabbbaaaabbabbbbbbaaaaaabbaaaa
ababbbbbabbabaabbbbbabababaabaaaaabbbbba
abbaababaaaababbaaabaaba
aaaabbaaaabaababbaababaa
abaaabbaaaabbabbaababababbabbbbb
abbaaabaabbabababbbbbbbbababbabababaaaaa
aabaabababbbabbbbbababbbaaaaaabbabaaaaba
aabbbabbbbbbbbaabbabbaaabbababba
bbaabbbabbaaaaaabbaaaaaabaabaabbabaabbaa
aababbaabbaaaabbbbaabbaaaaabbbababaaaabb
babaabbaababbbaaaabbbbba
baabaababbaabbbbabbaabbbaabbaababbbaabbbabbabbba
babbababbbbabaabbbbbabaabababbbabaaabbab
bbbbbbaaabbabbbbbbbaabaabaaababb
aaaabaabbbbaaabbbbbaaaaaaababbbaabaaabababaaabaabbababab
baaaabbaababbbbaaaaaabbabbbaaabaabbbabbbbbaaaaaa
aabbbaababbaaababbaabaabaababaabaaabaabb
aaababbaabababbaaaaababbabbbbaab
aaaabbbbaaaaaabaaabababa
abbaaabbbaabbbaaaaabaaba
aabbabbbabbababaaabaabababbbbbbaabbbbabb
ababaaabbbbabbbbabbababaabbaababbabababbbababaab
bbbaabaabbbabaabbbbbaabaaaabaabbabaabbaa
abbaaabbbababbbabababbaa
bababbbabaaababaaabaaaaaabbbaabaaabbbaabbaababbabbababbabbbaababbabbbbba
abaaabbbbaaaaabbabbababaababbbbbaaabaabb
bbaaaabbbabbaabbaaabaaab
abbaababbaaabbaabbaabbbbbbbbabba
baaaaaabbabaabbaaaaaabab
babbaababbbaaabaaabbabbbbbbababaaaabaabbbbbaabba
bbababaaaaaaaaabbbaaabbbabaaabbbabbaaabbaaabbababbbbaabbbbbbabba
abaabaaabaababaaabbbaabaaaaaabaabbababbbbbbaaaabbbabaaabbbabaabaaabaabaaaaabbbaa
bbaabaabaaaabbaabbbbaabaabbaaabaaabaaaba
aaababbbabbabbabababaaaaabaaabbbbabababbbaababbaabbaabbaaabababaabaabaababaabaab
baabbbaabbbbaababbbbabababaabaabbaaaaaaaaabaabbbbbbbaaabbabbbbbaaabaabaaabaabbab
abababbaabaabaaabbbababaababbababbbabaabbbaababa
abbbaababbbabaaaabababaababbaabaaababbbababaabbb
bbbabbbbbbbaaaababaabaab
abbaabbbbabaaababbbbabbb
babbabbbabaaaaaabbaababa
aaaabbbaabbbbbbbabbbaababaaabaaabbbbabba
abbabababaaaabbabbaaabba
babababaababbbbbbbbaaaaaaaaaabab
baaaaabaaaabaaaababaaaaa
bbaababbbbbabbabababbabaabbbababaaaabbab
bbbaaaaabbaabbbbaaaabaabbbabaabbbabaaaab
abababbabaabbbbabbabaabbabaaaabb
abaabaaaaaaabbbaaaabbabbbbbababbabbabbaa
bbaabbbbabbbbaabbbbbbaba
baabbabaaaaabaababaabaaabaaabbab
bbbbbbbbbbbaaabaaaabbbbbbababbabbbbaaabbbabbabbaaaaaaaaababaaaabaaabbbaabababbbabbbbbaab
baabbbbaaababbbabbbabbabaababbbbbaaabbabaabbbaaaaabbbbba
babbaababaabbaaabaaabbbb
bbbaaaaaaaababbaaaaabbaaaaabababaababaabbaabbbababbbabaabbabbbaa
baaabbbaaaabbbbaabaaaaab
abbaaababbbbbabababaabaaabbbbaaabababaaabbbbaaba
bbbbaaaaaabbaababbbaabab
aaabaaaaabbbabbbaababaaaaaaabaababaababbabbbbaab
bbbbbbaabaaabbbaaabbbabbbaabbbaaaabbabbaabaabbbb
babbabbbaaabbabbbaaababb
baabbbaababaaababaababbb
abbababbabbabaabbbaaaaba
abaaabbbbbaaabbbaabaabba
bbaababababaabbbabababbbbbbaabaababbabab
bbbaabbbaabbbbaaabaabbba
abbabbabbbaabbbbbbaabbbbbbabbaba
bbbaaaaaabbabbbbabaabbbb
bababababbbababababaaabb
abaabaabbbababbbbbabbaba
aabbaaabaabbaabaaaaaaabb
bbbaaababbbaaaaaaaabbbbb
aababaabaaaabbbaabaabaabababbbbabbbbbabaaabbbaaa
bbababaaababbbaaaaaaabbb
aababbbabbbabaabaaabaaba
abaaaaaabbaababbaaabbbbaaaabbabbbababbaaaaaaabbb
aaabbabbabaaabbaaaaabaabbbabaaab
bbabbbbbbaaabbbbabaaaaabbbabbbaaaabbaaaabaabbabababbaabbabaababa
aababaabaabbabaaaabbbabaaabbababbababbabaabaabbbababaaaa
bababaaabbabbbaabbbabbbaaabbbaaa
bbbabbabbabbabaaabbbbbbaabaabbbaababbabb
bbabaaaaabbabbbabbbbaabbaabaabbabaaaabaa
bbaaaaaaabbaaabbbaaaabbabbbbaaab
abbabaabaaabababbbbbabaa
bbabbaabbababbabaabababb
baabaaababbbababbaabaabaababbaaa
abbabababbabbaabbbbbabba
aaabbabaaaaabaabbbbababaabababaa
bbbbabaaaaaabbaaaabbbaaa
bababbbaaaaabbbbaaabaaaabaabaabaaabbbaabbbbbabbbabbbbaaa
bbaabbabababbbababbbaabbabaaaaab
aaaababbbabbaababbbabbababbbbbbbbbbbabaabbaabbabbabbaaabbaaaabaa
ababbbabbaaabaababbaaaaaababaaaaaabbabbaaaabbbbaabbabababbbababa
aababaaaaaabbaaabbabbbaabbbbaabbaababaab
bbbababaaababbbabaaaaabbbbaaabbbbbaabaaabbbabaabaaaaaabb
bbabbaaabbbbaabaabbbaabb
aaababbbbbbaabbbbabbbaba
aaabbbabbbbbaaabababbaaa
ababbbaaabbbbbbbabaabaaaaaabbbab
babbaabbbbaaaaaabbabbababbabbbaabbaababa
ababbbbbaabbaaaaabaabbaabbbaaabbabbabaab
bbaabaabbbbaaabbabbabbaa
aababbaaaaababbbbabbbbaa
abbaaabbbbbabaaaaababbab
abbabaaaaaaabbaabbababaabbbbbbba
abaaabbaabbabaaaabaabaababbbbbbaaabababbabbbbaaaabbbbabb
bbababaaababaabaaaabbbab
aaaabbaaaabbabbababaabbb
babaabababaaaabbbbabbaba
baaaababaaabbaaaabbbabaabbaabbbbabbaaaaaabaabaaaabbbbababbbbbaabbbabbaabaabbbbbb
baabbababbaaabbbbbbbabaaaababbaaaaaababbbabbabababbbbbab
aabbbabbaaaabbbbbaaaabaa
bbabbaababbabaabaaaaabbababaabaaabbbabaa
babbabbbaaaababbbbaaabab
ababbbbaababbbbaababbbaabbabaabababbabba
baaaabbbbaaaaabbabaabbba
baaaaababbbabaabbbaaaaaabaabaaaabaabbbaaaabbbbba
ababaaaaabbbbbbbbabbbabb
abbaaabbbaaaaaaabbaababaabbbabba
abaabaaaabaabaabbbaaabaa
bbbabbabbaaaabbabaaaabbbababbaab
abbbbabbbbaababaaabaabababbbaababbaabbbabbabaababbabaabb
bbababaabbbabaaaaaabbaababaabbab
aabbabbbbbabbaababaababb
aaaaabbabbbbaaaabbaaaabbbbabbabb
aaaaabbabaabaaaaabababaabbbbbabb
babaaababbaaaabbaaababbaabababaaabbbbbaaaaaaaaaa
babbaabbabbaaababbaaabba
bbbbaabaababababaabbbbab
baaabbaaaaababbbbaaababa
abbbabababbaababababaaaabbbabbabbbaabaabaabaabaababbbbbb
babababaaaabababaaababaaaaaabbabbbababab
bbbbababbababababbaaabaa
aabaabababbabaaabaabbbab
bbbabbababaabaababababbaabaabaabbbbbbaab
bbbabababaaaaabaabbababbabbaaabaaaabbbababbbbaababbbbaab
aababaaaababbbaaaaaababbbbaabaaabaabbbaaabaaaabbabbaabbabbabbbbbabbbabaa
abbbbababbabbaaababbabbbaaabbbbababaababbaaabaab
bbaabaabaabbbaabaaaaabbaabaaaaaaabbbbaababbbbaaa
bbaaabbbbbbabbabbabbbbba
aabbbaabbbbabbabbbbbbabb
baaaaaaaabbbababbabaaabb
abaabaabaabbbabbbbbababbbbaabaababaabaababaaaabababaaaaa
abbaababbbbbbbbbbbbbaaab
baaaaababbababaaabaaaaba
abaaabbbbababbbabbbabaabbabaabbbaabbbababbbbbbababbaaabb
babbababaabbabaaaabaabbbbaabaaaaaaabaaba
abbababaaaaabbbaabaabaaabbabbbaa
bbbbabaabaaaaaabaabaababaabbbababbbbaaabbbaaaaba
aababababababbbbbbbababbbbbabbabbababbbb
ababbabbaabbbaaabbbbabbb
aaabbbbabbaaabbbbbbbaabb
baabaababbbbbbabaaaaaaaa
bbaaabaaabbaabababbbaaaabaabaaaa
baaaaaabbbbaaaaabbbaabaaabbbbaabbabbaaaa
baabbbaabbbababababbaaab
baaaabbbaaababbaaaababbabbbabaabaaaabbab
bbbbabababaaabbbbabaabab
aaabababbbabaabbababaaaabbbbabaaabaaabba
bbbaaabaaabbaaabbaaabbaabbababba
bbabbaaabaaaaabaababbbbababbaabbbbbbaaaaaababbabbabbbaba
aaaaaabaaabbabababababaaaaabaaba
abababbabbababbbbbababbbbababaaa
babaabbabbababaaabbbbabb
aabbabaaabababaaabbbbbaaaaabaaba
bbaaaaaaaaaabbbbbbabaaaa
aaaaaaabbaabbaaabbababba
aaababbbbabbaabbbbbaaabaaababbaaabbababbabaaaaab
aaababababaaabbbbbbaabba
abbbababaababbbbaabbaabb
abaababbabaaabbbbbbaaababaaabbabbabbbbaa
aabbaababbababaabbabbaaaabbabaaabbbabbbbbabbbaaaabbbbbbaabaabbaabbbbbaaa
aabbbabbabaabaabbbaaabbbabbbabbbbaaaabaababababbaababbabbaabbabb
aabbbaabaaabbaabaaaaabbb
abaaabbbbabaaababbaababa
baabaaabbbababaabaaababb
abbbaababbaaaabbbbaaaaab
aababbbaabbaaabbaaabbbbababbaabaabbbbbab
abbababaaaabaaaaababbabb
abbaabababbaaabbababbbab
bbbaabbbbbababaabababbababaababbbababaaaabbbbaaabbbbaabbbbbabbbabbabbbba
aabaaaabbaaaabbaaababbbbbaaabaaaabaaaaba
baaaababaaaabbbaaaabbbbabbbbabbaabbbbaabbabbabbabaabbbab
aaabbaabbbbbabaaaaaaaabb
bbabbaabbbbabaaaabbbabba
bbbbaabaabbabbabbabbaabbabaaaabb
aaaababbaaabaaaababaaababbbabaabbbbaabaa
abbbababababababbaaabbab
aaabbbaabbaababbababbabaaaabbabbaabbaaabaaabbbbbaaaaaaabaaaaabba
aabbabbaaaababababababbababaaaaa
aabbabbbabbbaaaaabbbbbaaabbbaaaaaabbbaabbbabaababbabbbbaababbaaaaaaabaaa
abbbabbbaaabbababbabbaabbaaababb
bababbbbbababbabbaabaababbbbabab
babbabbbaababbbbaaabaaba
bbbabaabaababaababbaabaa
aababaababbabababaaabaaa
bbbabbbbbabbaabbaabbbbaabbababaaabaaababaabababb
babaaabaaaababbaabaaaaaabaaaaabaabbbbaab
bbaabaababbbbbbbbbaabaaaaaabaabb
baabbaaaaaabbaabbbbbaababbaaabbbbaaaaaaabbbaabaabaaabbbb
aabbabaabaaaabbaabbabababaabaabb
bbbaabaabbbaaaaaaaabbaabaaaaaabb
baabbbaaabbaaabbaaaabbbbbbaaaabaabbaaaaaabaabbbaabbbabaababaabab
abbbbbaaabbabaaaaaabbaaaaabbbbaababaabababbbaaabaaaaabbb
aababbbaaaaababbabaababb
aabbbbaaabbabaaaabaaaaaabaabaaabbabbbbaa
aaaabbaabbaabbbbaabaaaaaaababbababbbbbbaaaabbbabaaaabbba
aaababbbabbaabababaaabbababbababbbabbbbabbbbbaab
abbaababbaaaabbbbaaabaab
aaaababbaababaabbbababbbaababbbaaababbaa
babbbabbaabbaabbbabbabaaababaaabbabbbbab
aabaaaabaaabbabaabbabbaa
bbbababbbbababaababaaaaa
aaaabbabaaaaaabbaaaabaaa
bababbbaabbbaabaabbabbbbbbbabaaaaabaaaabbaababbb
bbaaaaaaaaababbaaabaaaaa
abbbababbabaaabababaabaabaaaabaabbabbbab
bababbbbabbabaaabbbabaabbaabaababaababbaabbaabbabbabababaaababaababbbaba
abaaabbbbbbbbbaabbaabbaabbaabbababbaabba
aaaaabbabaaaaabbababbaaaaabbabaaabbaabbbbbaabaabaaabbbaabbbbbaba
baaaabababbaabaaabaaaaaaaabaabbbbaababaa
bbaaabbbbabbaabbaabaabba
aaaabbaaababbbbbaaaaabbb
abbababaaabbaabbaaaaabaabaaababbabbbaaababaaaababbbaabbaaaaababb
aabbaababbababbbbbbabaaabbbaaabaabababbababbbaaababaabaabbabbbbabbaaaaba
aaaaabbaaaabbbbabbbbabaabbbbbbaaaaaabbbabbbaaabbbbabaaaaaaabbbbbbababaababbbabaa
babababbbabbabbaaabbbbbaaaaaabaa
abbbbbabbbbbaaabbbabbababaabbbababaaaaba
aaabbaaabaaaaabbbabaabab
aaabbbbabababbbabaaaaabbabaababb
ababbbbbbbbabbabbabababb
ababaaababbbababbaabbbbb
babbaabaaabbabbaaaaabbbbbbaabaabbbbabaaabbabbbab
abbbaabaaababbbaaababaabaaababbbbbabbbba
aababaaaababbbbbbbbabaabbbbabbaa
aaabbabababbbbaabbabbaba
baabaabababbabaaaababbbbabaabbbb
ababaabaababbabaaabababaaaaaaaaaabbbbbab
bbbbabaabbbaabaabbbaabbbabbabaabbbbaabbaaaaaabbbabaaaaab
aabbabbabbbbbaaabbabbbabbbaabababbbaabbaaabbaabababababaabbaaaba
bbabbabaabaabaaabbaabbababaaaababaababbbbaaababbabaababb
babbabababbaaaabaaaaaaabaabaaabbaaaabbaabbbaaaabbaaaaabbaaaaaababababbba
abababababbabbabaaaabbba
aabbbabbbaaabbaabaaabbbbbaaaabaaabbbbbba
aabbabaaaaabaaaabbbbaaaabbbabbabaabababaabbaaaaa
bbaabbbbaaabbabbbbbabbaa
aaababbbbaaabbaaabbabbabbabaaabb
aabaabbbaaaabaabbbaaaaab
abaaaaaaaababbbaaaabbbbaaaababaa
bbaabaababababababbbbaaa
abbaaabbabbabbbbbaababbb
aaabbaabbabbaababaaabbaabbaabaaaabbbbbbabbabbbabaabbbbab
bbabbaababaaabbbaabaaaab
ababababaabaaaabbaaaaaaabbaabbbbbababbabaabaaaba
aaabbabbaababbaabbbabbba
bbbaaaaaababbbbabbbbbbaababbaaab
abababaaabbabbabbabbbaba
bbbaabaaabababaaaaabaaab
abbbabbbababbbbaaaabaaaababaaaab
bababbbabababababbbbbabb
bbaaabbbbbbbbbabbbbaaabababbbbba
bbabbaabbabaaabaaaabbbbb
ababbbaabbaabaabaabaaaabaaabababaabaaabbaabbbbba
aaaaaaabbaaabbbabbbbaaaababaabaabbbaabab
aaabbabaabbbabbbababaabb
baabbbbabbbaaabaabbabaabbbaabbbaaabbaaabbbbbababaabaabaabbbbbabaaabaaabb
bbbabaaabbabbaabbabbbbab
aabbababbaaaaabaababbbbabbbabaaababaaaabbbbabbbaaaaaaaaa
baabababaabbaaabaabbabbbbaaaababbbabaaabbbbbaabb
bbbaaaaabaabababaaaaaababbbaaaaaaababbbbbaababbb
baaaaabaabbabababbaababbaabaabba
abababbaaaaababbabaabbba
baaaaabbbaabbabaaaaaaaaabbabbbab
abbabababaaaabbbabbbbbaaaaaaaaabbbabaaba
aabaaaabbbabbbbbbabaaabbbabbaaaaabbbbbaa
abaaaaaabbbbbbabababbabaaabaaaababaaabab
abbabbbaabaababbabababbb
abbbbbbbbbaabaabbaaaabaa
ababaabaaababaaabaaaaabbaaaaabaa
aaabaaaaaaabbabbbbaaabba
bbbabaaabaabaababbbbaaaaaababbbaababaaaababbbbaa
abbabbbabbabaabbaaabbbbbabbababa
aabbababababbbaaaabbbabbbbaaabaa
abaabaaaababaaaaaaabaaaabaaabbabaabaaaba
baabaabaabbaaabbbbbabababbaaabaa
abbabaabbbbbabaaaabbbbbb
aaaabbaaabbbbbaababbbaba
aaaabbbabbbbaababbaabbbbabaaaabbbaababba
abbabaabaaabbbbaaaabbbbb
aabaaabbabbbbabbabbbaabb
aabbbaababbabbababaabbbb
aaaabbaaababbaabaaaaabbb
abbabbbbaaaaaaabbbbbbbabbaabbbbb
ababaaaabbaabaabaababaaaaabbbaab
baaabbaaabbabbbbbabbababaaabbbbb
bbaababbbabaabbaababbbab
abababbaabbbabababbbaabababaabaa
bbabbaabbbbabbbbbbbbababbaaabbbb
aaabaaaaababbabaaabbbabbbbabbaaaabaababb
baabaaaaaaabbaababbbabbbaabbaaab
aabababaabbbabbbbbbabaabbbbbbbaaababaaabaaaabaaabbabaaba
abbaaabaabbaabbbbbaaabab
baaaababbaaaababbbababba
aabaaaababbbbbbbbabbbabb
bbbbbbaabbbbbbbbbaabaabaababababbaabababaabaaabbababbaab";