from math import ceil
from sys import maxsize
import itertools
import re

def flatten(lol):
    return [x for l in lol for x in l]

def convert_to_item_dict(item_string):
    split = re.split('\s{2,}',item_string)
    return {
        'name': split[0],
        'cost': int(split[1]),
        'damage': int(split[2]),
        'armour': int(split[3])
    }

def get_possible_selections(details_block):
    lines =  details_block.splitlines()
    allowed_numbers = [int(x) for x in lines[0].split(',')]
    items = list(map(convert_to_item_dict, lines[2:]))
    return flatten(itertools.combinations(items, i) for i in allowed_numbers)

def are_items_good(items):
    damage = sum(item['damage'] for item in items)
    armour = sum(item['armour'] for item in items)
    hero = Character(100, damage, armour)
    return hero.will_beat(boss)

class Character:
    def __init__(self, hp, damage, armour):
        self.hp = hp
        self.damage = damage
        self.armour = armour

    # assumes self is going first
    def will_beat(self, opponent):
        return self.turns_to_ko(opponent) <= opponent.turns_to_ko(self)

    def turns_to_ko(self, opponent):
        if opponent.armour >= self.damage:
            return maxsize
        return ceil(opponent.hp/(self.damage - opponent.armour))

input = open("input/21", "r").read().strip()
stats = [int(x.split(' ')[-1]) for x in input.splitlines()]
boss = Character(stats[0], stats[1], stats[2])

shop = open("input/21-shop", "r").read().strip().split('\n\n')
possible_selections = map(get_possible_selections, shop)
full_selections = [flatten(x) for x in itertools.product(*possible_selections)]
working = filter(are_items_good, full_selections)
print(sorted(map(lambda set: sum(item['cost'] for item in set), working))[0])

working = filter(lambda x: not are_items_good(x), full_selections)
print(sorted(map(lambda set: sum(item['cost'] for item in set), working))[-1])