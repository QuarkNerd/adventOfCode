input = open("input/23", "r").read().strip()
steps = input.splitlines()

reg = {
    'a': 1,
    'b': 0
}
i = 0
while i < len(steps) and i >= 0:
    instruction = steps[i].replace(',', '').split(' ')
    command = instruction[0]
    param = instruction[1]
    match command:
        case 'hlf':
            reg[param] = reg[param] // 2
            i+=1
        case 'tpl':
            reg[param] = reg[param] * 3
            i+=1
        case 'inc':
            reg[param] += 1
            i+=1
        case 'jmp':
            i+= int(param)
        case 'jie':
            if reg[param]%2 == 0:
                i+= int(instruction[2])
            else:
                i+=1
        case 'jio':
            if reg[param] == 1:
                i+= int(instruction[2])
            else:
                i+=1
print(reg['b'])
