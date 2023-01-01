## What?
NodeJS console animation for AOC 2022 Day05 part 1
[Demo](https://www.reddit.com/r/adventofcode/comments/zzerjm/2022_day_5_part_one_robot_console_animation_in/)
### To run
1. Add your input to `input.txt`, don't use the sample input
2. Run `npm install`
3. Run `npm start`
4. Optionally adjust FRAME_HEIGHT in constants. If the scene jumps about, reduce FRAME_HEIGHT
### How does it work
Use `console.log` and `console.clear` to display and clear frames
Use  [ANSI escape codes](https://en.wikipedia.org/wiki/ANSI_escape_code) to add colour to the console. Details [here](https://stackoverflow.com/questions/4842424/list-of-ansi-color-escape-sequences)