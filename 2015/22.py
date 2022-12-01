import enum
import copy
import time
start = time.time()

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

class Boss:
    def __init__(self, hp, damage):
        self.hp = hp
        self.damage = damage

COSTS = {
    Action.Poison: 173,
    Action.Shield: 113,
    Action.Magic_Missile: 53,
    Action.Drain: 73,
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

input = open("input/22", "r").read().strip().splitlines()
boss = Boss(int(input[0].split(' ')[-1]), int(input[1].split(' ')[-1]))
wizard = Wizard(50, 500)
initial_state = State(wizard, boss)

lowest_mana = 1000000

def do_all_paths(state):
    global lowest_mana

    ## Part two only
    state.wizard.hp -=1
    if state.wizard.hp <=0:
        return
    ## Part two only

    apply_effects(state)
    if (state.boss.hp <= 0):
        if (state.wizard.mana_spent < lowest_mana):
            lowest_mana = state.wizard.mana_spent
            print(lowest_mana)
        return
    next_states =  get_possible_states_after_wizard_action(state)
    next_states = [*filter(lambda st: st.wizard.mana_spent < lowest_mana, next_states)]
    [*map(apply_effects, next_states)]
    for st in next_states:
        if (st.boss.hp <= 0):
            lowest_mana = st.wizard.mana_spent
            print(lowest_mana)
            return
    [*map(apply_boss_action, next_states)]
    next_states = [*filter(lambda st: st.wizard.hp > 0 and st.wizard.mana_spent + 173 * (st.boss.hp-15)//18 < lowest_mana, next_states)]
    [*map(do_all_paths, next_states)]

do_all_paths(initial_state)

print(time.time() - start)