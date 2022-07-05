import enum
import copy
import json

class Action(enum.Enum):
    Magic_Missile = "Magic_Missile"
    Drain = "Drain"
    Shield = "Shield"
    Poison = "Poison"
    Recharge = "Recharge"

class State:
    def __init__(self, wizard, boss):
        self.wizard = wizard
        self.boss = boss
    
    def print(self):
        print('wizard: ' + self.wizard.string())
        print('boss: ' + json.dumps(self.boss.__dict__))

class Wizard:
    def __init__(self, hp, mana):
        self.hp = hp
        self.mana = mana
        self.mana_spent = 0
        self.timers = {
            Action.Shield: 0,
            Action.Poison: 0,
            Action.Recharge: 0
        }
    
    def string(self):
        return json.dumps({
            'hp': self.hp,
            'mana': self.mana,
            'mana_spent': self.mana_spent,
            'timers': {
                'shield': self.timers[Action.Shield],
                'poison': self.timers[Action.Poison],
                'recharge': self.timers[Action.Recharge],
            }
        })

class Boss:
    def __init__(self, hp, damage):
        self.hp = hp
        self.damage = damage

COSTS = {
    Action.Magic_Missile: 53,
    Action.Drain: 73,
    Action.Shield: 113,
    Action.Poison: 173,
    Action.Recharge: 229
}

def split(list, condition):
    match, bad = [], []
    for x in list:
        (bad, match)[condition(x)].append(x)
    return (match, bad)

def apply_effects(state):
    if (state.wizard.timers[Action.Shield] > 0):
        state.wizard.timers[Action.Shield] -= 1        
    if (state.wizard.timers[Action.Poison] > 0):
        state.wizard.timers[Action.Poison] -= 1
        state.boss.hp -= 3    
    if (state.wizard.timers[Action.Recharge] > 0):
        state.wizard.timers[Action.Recharge] -= 1
        state.wizard.mana += 101      

def apply_boss_action(state):
    armour = 7 if state.wizard.timers[Action.Shield] > 0 else 0
    state.wizard.hp -= (state.boss.damage - armour)

def get_state_after_wizard_action(state, action):
    cost = COSTS[action]
    can_afford = cost <= state.wizard.mana
    timer = state.wizard.timers.get(action)
    can_execute = timer == 0 or timer == None
    if not (can_afford and can_execute):
        return None

    state = copy.deepcopy(state)
    state.wizard.mana_spent += cost
    state.wizard.mana -= cost

    match action:
        case Action.Magic_Missile:
            state.boss.hp -= 4
        case Action.Drain:
            state.boss.hp -= 2
            state.wizard.hp += 2
        case Action.Shield:
            state.wizard.timers[action] = 6
        case Action.Poison:
            state.wizard.timers[action] = 6
        case Action.Recharge:
            state.wizard.timers[action] = 5
    
    return state

def get_possible_states_after_wizard_action(state):
    states = [get_state_after_wizard_action(state, action) for action in (Action)]
    return [*filter(lambda st: st != None, states)]

    # Magic_Missile Missile costs 53 mana. It instantly does 4 damage.
    # Drain costs 73 mana. It instantly does 2 damage and heals you for 2 hit points.
    # Shield costs 113 mana. It starts an effect that lasts for 6 turns. While it is active, your armor is increased by 7.
    # Poison costs 173 mana. It starts an effect that lasts for 6 turns. At the start of each turn while it is active, it deals the boss 3 damage.
    # Recharge costs 229 mana. It starts an effect that lasts for 5 turns. At the start of each turn while it is active, it gives you 101 new mana.

input = open("input/22", "r").read().strip().splitlines()
boss = Boss(int(input[0].split(' ')[-1]), int(input[1].split(' ')[-1]))
wizard = Wizard(50, 500)
initial_state = State(wizard, boss)

lowest_mana = 1000000
list_of_states = [initial_state]

while len(list_of_states) > 0:
    # print(lowest_mana, json.dumps(list_of_states))
    # print(len(list_of_states))
    # [*map(lambda st: st.print(), list_of_states)]
    new_states = []
    for state in list_of_states:
        apply_effects(state)
        # state.print()
        if (state.boss.hp < 0):
            if (state.wizard.mana_spent < lowest_mana):
                lowest_mana = state.wizard.mana_spent
            break
        next_states = get_possible_states_after_wizard_action(state)
        # print("aaaaaaaaaaaaaaa")
        # [*map(lambda st: st.print(), next_states)]
        [*map(apply_effects, next_states)]
        # print("bbbbbbbbbbbbbbbbbb")
        # [*map(lambda st: st.print(), next_states)]
        # print("afasdfdasf")
        (ended, next_states) = split(next_states, lambda st: st.boss.hp < 0)
        # print("qqqqqqqqqqqqqqq")
        # [*map(lambda st: st.print(), next_states)]
        for st in ended:
            if (state.wizard.mana_spent < lowest_mana):
                lowest_mana = state.wizard.mana_spent
        [*map(apply_boss_action, next_states)]
        new_states.append(next_states)
        # print("jlsdfjsdlfjsadlfjsalfjsdlf")
        # [*map(lambda st: st.print(), next_states)]

    # print(new_states)
    new_states = [x for l in new_states for x in l]
    # print(new_states)
    list_of_states = [*filter(lambda st: st.wizard.mana_spent < lowest_mana and st.wizard.hp > 0, new_states)]
    # break
    
print(lowest_mana)

# Hit Points: 58
# Damage: 9
