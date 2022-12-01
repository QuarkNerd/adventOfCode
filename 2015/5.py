import re

f = open("input/5", "r")
input = f.read().strip()

def is_nice(string):
    vowel_count = len(re.findall(r"[aeiou]", string))
    repeat = re.search(r"(.)\1", string)
    forbdden_string = re.search(r"(ab|cd|pq|xy)", string)
    return vowel_count > 2 and repeat and not forbdden_string

def is_actualy_nice(string):
    pair_repetition = re.search(r"(..).*\1", string)
    sandwhiched_letter = re.search(r"(.).\1", string)
    return pair_repetition and sandwhiched_letter


lines = input.splitlines()

print(len(list(filter(is_nice, lines))))
print(len(list(filter(is_actualy_nice, lines))))