@enum Direction up down left right

function getPhotonBeam(oldBeam, direction)
    if (direction == up)
        return (x=oldBeam.x, y=oldBeam.y - 1, dir=direction)
    elseif (direction == right)
        return (x=oldBeam.x + 1, y=oldBeam.y, dir=direction)
    elseif (direction == down)
        return (x=oldBeam.x, y=oldBeam.y + 1, dir=direction)
    else
        return (x=oldBeam.x -1, y=oldBeam.y, dir=direction)
    end
end

function getForwardSlashReflectedDirection(direction)
    if (direction == up)
        return right
    elseif (direction == right)
        return up
    elseif (direction == down)
        return left
    else
        return down
    end
end

function getBackwardSlashReflectedDirection(direction)
    if (direction == up)
        return left
    elseif (direction == right)
        return down
    elseif (direction == down)
        return right
    else
        return up
    end
end

function getPossibleStarts(width, height)
    starts = []
    for x in 1:width
        push!(starts, (x=x, y=1, dir=down))
        push!(starts, (x=x, y=height, dir=up))
    end
    
    for y in 1:height       
        push!(starts, (x=1, y=y, dir=right))
        push!(starts, (x=width, y=y, dir=left))
    end

    return starts
end

function calculateEnergy(world, start)
    current = [start]
    allLocations = Set()
    allBeams = Set()
    width =  length(world[1])
    height =  length(world)

    while true
        next = []
        beamSize = length(allBeams)
        foreach(photon -> begin
            if !(1 <= photon.x <= width && 1 <= photon.y <= height) || photon in allBeams
                return
            end
            push!(allLocations, (x=photon.x, y=photon.y))
            push!(allBeams, photon)
            space = world[photon.y][photon.x]
            if (space == '.' || (space == '|' && photon.dir in [up, down]) || (space == '-' && photon.dir in [right, left]))
                push!(next, getPhotonBeam(photon, photon.dir))
            elseif (space == '-' && photon.dir in [up, down])
                push!(next, getPhotonBeam(photon, right))
                push!(next, getPhotonBeam(photon, left))
            elseif (space == '|' && photon.dir in [right, left])
                push!(next, getPhotonBeam(photon, up))
                push!(next, getPhotonBeam(photon, down))
            elseif (space == '\\')
                push!(next, getPhotonBeam(photon, getBackwardSlashReflectedDirection(photon.dir)))
            else
                push!(next, getPhotonBeam(photon, getForwardSlashReflectedDirection(photon.dir)))
                # statement
            end
        end
        ,current)
        current = next;
        if (beamSize == length(allBeams))
            return length(allLocations) 
        end
    end
end

f = open("input", "r")
world = readlines(f)
close(f)
width =  length(world[1])
height =  length(world)

println(calculateEnergy(world, (x=1, y=1, dir=right)))
max = 0
for b in getPossibleStarts(width, height)
    energy = calculateEnergy(world, b)
    if energy > max
        global max = energy
    end
end
println(max)
