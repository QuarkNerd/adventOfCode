from email.policy import default


input = open("input/16", "r").read().strip()
lines = input.splitlines()

gifterInfo = {
    'children': 3,
    'cats': 7,
    'samoyeds': 2,
    'pomeranians': 3,
    'akitas': 0,
    'vizslas': 0,
    'goldfish': 5,
    'trees': 3,
    'cars': 2,
    'perfumes': 1,
}

def compare(gifter_value, sue_value, property):
    match property:
        case 'cats' | 'trees':
            return sue_value > gifter_value
        case 'pomeranians' | 'goldfish':
            return sue_value < gifter_value
        case default:
            return sue_value == gifter_value

for line in lines:
    split = line.replace(",", "").replace(":", "").split(" ")
    properties = [split[2], split[4], split[6]]
    sue_values = [int(split[3]), int(split[5]), int(split[7])]
    gifter_values = list(map(lambda p: gifterInfo[p], properties))
    if not (False in (gifter_values[i] == sue_values[i] for i in range(3))):
        print(split[1])
    if not (False in (compare(gifter_values[i], sue_values[i], properties[i]) for i in range(3))):
        print("Part two " + split[1])