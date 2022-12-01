import re


input = "cqjxjnds"
passw = list(input)

def increment_password(passw):
    for i in range(len(passw)-1, -1, -1):
        letter = passw[i]
        if letter != "z":
            passw[i] = chr(ord(letter) + 1)
            break
        passw[i]="a"
    return passw

def is_valid(passw):
    string = "".join(passw)
    forbidden_letters = re.search(r"[iol]", string)
    repeat = re.search(r"(.)\1.*(.)\2", string)
    inc_seq = re.search(r"(abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)", string)
    return inc_seq and repeat and not forbidden_letters

while not is_valid(passw = increment_password(passw)):
    continue

print("".join(passw))

while not is_valid(passw = increment_password(passw)):
    continue

print("".join(passw))