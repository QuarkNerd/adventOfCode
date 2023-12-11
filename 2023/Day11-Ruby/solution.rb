#!/usr/bin/ruby -w

def is_empty(arr)
    arr.uniq.size <= 1 && arr[0] == '.'
end

def get_empty_rows(world) 
    empt = Array.new
    for i in 0...world.length
        if is_empty(world[i])
            empt.append(i)
        end
    end
    empt
end

file = File.open("input")
world = file.read.split(/[\r\n]+/).map{ |string| string.split(//)}

empty_columns = get_empty_rows(world)
world = world.transpose
empty_rows = get_empty_rows(world)

hashes = Array.new
base_length = 0

extra_length = 0
for i in 0...world.length
    for j in 0...world[i].length
        if (world[i][j] == "#")
            hashes.each do |coor|
                base_length += i - coor[0] + (j - coor[1]).abs
                extra_length += Array(coor[0]..i).intersection(empty_rows).length
                extra_length += Array(j..coor[1]).intersection(empty_columns).length
                extra_length += Array(coor[1]..j).intersection(empty_columns).length
            end
            hashes.append([i, j])
        end
    end
end

puts base_length + extra_length
puts base_length + extra_length * 999999
