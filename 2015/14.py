input = open("input/14", "r").read().strip()
lines = input.splitlines()
RACE_TIME = 2503

reindeer_info_spli = map(lambda str: str.split(" "), lines)
reindeer_stats = list(map(lambda split: (int(split[3]), int(split[6]), int(split[13])), reindeer_info_spli))

reindeer_distances = [0] * len(reindeer_stats)
reindeer_points = [0] * len(reindeer_stats)

for time in range(0,RACE_TIME):
    for i, reindeer in enumerate(reindeer_stats):
        speed, runtime, composetime = reindeer

        round_time = runtime + composetime
        full_rounds = time//round_time
        time_remaining = time - (full_rounds * round_time)
        if time_remaining < runtime:
            reindeer_distances[i] += speed
    winner_index = reindeer_distances.index(max(reindeer_distances))
    reindeer_points[winner_index] += 1

print(max(reindeer_distances))
print(max(reindeer_points))
