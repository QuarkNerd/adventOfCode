local function read_file(path)
    local file = io.open(path, "rb") -- r read mode and b binary mode
    if not file then return nil end
    local content = file:read "*a" -- *a or *all reads the whole file
    file:close()
    return content
end

local function part_check(map, line_number, start_pos, end_pos)
    search_start_y=math.max(1, line_number - 1)
    search_end_y=math.min(table.getn(map), line_number + 1)

    for i=search_start_y, search_end_y do
        for j=(start_pos - 1), end_pos + 1  do
            char = string.sub(map[i], j, j)
            if not (char == "" or char == ".") and tonumber(char) == nil then 
                return char, i .. '-' .. j
            end
        end
    end
    return ""
end

local fileContent = read_file("input");

part_sum = 0
map = {}
i = 1
for str in string.gmatch(fileContent, "[^\n\r]+") do
   map[i] = str
   i=i+1
end

potential_gear_hash = {}
for i, line in pairs(map) do
    j=1
    while true do
        match_start, match_end = string.find(line, "[0-9]+", j)
        if (match_start == nil) then break end
        part_check_symbol, part_check_location = part_check(map, i, match_start, match_end)
        if not (part_check_symbol == "") then
            value = tonumber(string.sub(line, match_start, match_end))
            part_sum = part_sum + value

            if (part_check_symbol == "*") then
                if (potential_gear_hash[part_check_location] == nil) then potential_gear_hash[part_check_location] = {} end
                table.insert(potential_gear_hash[part_check_location], value)
            end
        end
        j = match_end + 1
    end
end

gear_ratio_sum = 0
for _,set in pairs(potential_gear_hash) do
    if table.getn(set) == 2 then gear_ratio_sum = gear_ratio_sum+ set[1]*set[2] end
end

print ("Part one:", part_sum);
print ("Part two:",gear_ratio_sum);