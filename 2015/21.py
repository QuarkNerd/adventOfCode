import math

class Character:
    def __init__(self, hp, damage, armour):
        self.hp = hp
        self.damage = damage
        self.armour = armour

    # assumes self is going first
    def can_beat(self, opponent):
        return self.turns_to_ko(opponent) <= opponent.turns_to_ko(self)

    def turns_to_ko(self, opponent):
        return math.ceil(opponent.hp/(self.damage - opponent.armour))

input = open("input/21", "r").read().strip()
stats = [int(x[1]) for x in input.splitlines().split(' ')]
boss = Character(stats[0], stats[1], stats[2])
