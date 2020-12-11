fn main() {
    let mut joltage_list = INPUT.split('\n').map(|x| x.parse::<u128>().unwrap()).collect::<Vec<_>>();
    joltage_list.push(0);
    joltage_list.sort();
    joltage_list.push(joltage_list[joltage_list.len()-1]+3);

    let mut one_diff_count = 0;
    let mut three_diff_count = 0;
    let mut number_of_ways = 1;
    let mut local_one_diff_count = 0;
    for i in 0..(joltage_list.len()-1) {
        if joltage_list[i+1] - joltage_list[i] == 1 {
            one_diff_count +=1;
            local_one_diff_count +=1;
        } else {
            three_diff_count +=1;
            number_of_ways = number_of_ways*calculate_ways_to_arrange_adapters(local_one_diff_count);
            local_one_diff_count=0;
        }
    }

    println!("Part one: {}", one_diff_count*three_diff_count);
    println!("Part two: {}", number_of_ways);
}

fn calculate_ways_to_arrange_adapters(joltage_gap: u128) -> u128 {
    let mut yet_another_counter = 0;
    for swap_num_twos in 0..(joltage_gap/2 +1) {
        let remain = joltage_gap - swap_num_twos*2;
        for swap_num_threes in 0..(remain/3 +1) {
            let remain_now = remain - swap_num_threes*3;
            yet_another_counter += fact(remain_now+swap_num_twos+swap_num_threes)/(fact(remain_now)*fact(swap_num_twos)*fact(swap_num_threes));
        }
    };
    yet_another_counter
}

fn fact(x :u128) -> u128 {
    if x == 0 { return 1 };
    return x*fact(x-1);
}

static INPUT: &str = "66
7
73
162
62
165
157
158
137
125
138
59
36
40
94
95
13
35
136
96
156
155
24
84
42
171
142
3
104
149
83
129
19
122
68
103
74
118
20
110
54
127
88
31
135
26
126
2
51
91
16
65
128
119
67
48
111
29
49
12
132
17
41
166
75
146
50
30
1
164
112
34
18
72
97
145
11
117
58
78
152
90
172
163
89
107
45
37
79
159
141
105
10
115
69
170
25
100
80
4
85
169
106
57
116
23";