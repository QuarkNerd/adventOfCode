import enum
import copy

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
    Action.Magic_Missile: 53,
    Action.Drain: 73,
    Action.Shield: 113,
    Action.Poison: 173,
    Action.Recharge: 229
}

def get_next_state(state, action):
    cost = COSTS[action]
    can_afford = cost <= state.wizard.mana
    timer = state.wizard.timers.get(action)
    can_execute = timer == 0 or timer == None
    if not (can_afford and can_execute):
        return None

    state = copy.deepcopy(state)

    ## Immediate impact
    match action:
        case Action.Magic_Missile:
        case Action.Drain:
        case Action.Shield:
        case Action.Poison:
        case Action.Recharge:
    
    return state

    # Magic_Missile Missile costs 53 mana. It instantly does 4 damage.
    # Drain costs 73 mana. It instantly does 2 damage and heals you for 2 hit points.
    # Shield costs 113 mana. It starts an effect that lasts for 6 turns. While it is active, your armor is increased by 7.
    # Poison costs 173 mana. It starts an effect that lasts for 6 turns. At the start of each turn while it is active, it deals the boss 3 damage.
    # Recharge costs 229 mana. It starts an effect that lasts for 5 turns. At the start of each turn while it is active, it gives you 101 new mana.
