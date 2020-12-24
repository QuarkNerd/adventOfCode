use std::collections::HashSet;

#[derive(PartialEq, Eq, Hash, Copy, Clone, Debug)]
struct Coor {
    x: i32,
    y: i32,
}

enum Direction {
    East,
    SouthEast,
    SouthWest,
    West,
    NorthWest,
    NorthEast
}

impl Direction {
    fn from_str<'a>(st: &'a str) -> Direction {
        match st {
            "e" => Direction::East,
            "se" => Direction::SouthEast,
            "sw" => Direction::SouthWest,
            "w" => Direction::West,
            "nw" => Direction::NorthWest,
            "ne" => Direction::NorthEast,
            other => panic!("Invalid str: {}", other)
        }
    }
}

fn main() {
    let input = get_input();
    let mut black_tiles_hash = HashSet::new();

    for tile_dir in input {
        let mut coor = Coor {x: 0, y:0};

        for step in tile_dir {
            match step {
                Direction::East => coor.x +=1,
                Direction::SouthEast => coor.y -=1,
                Direction::SouthWest => {
                    coor.y -=1;
                    coor.x -=1;
                },
                Direction::West => coor.x -=1,
                Direction::NorthWest => coor.y +=1,
                Direction::NorthEast => {
                    coor.y +=1;
                    coor.x +=1;
                },
            };
        };

        if !black_tiles_hash.insert(coor.clone()) {
            black_tiles_hash.remove(&coor);
        }
    }

    println!("Part One: {:?}", black_tiles_hash.len());
    
    for _ in 0..100 {
        black_tiles_hash = step(&black_tiles_hash);
    }    
    println!("Part Two: {}", black_tiles_hash.len());
}

fn step(black_tiles_hash: &HashSet<Coor>) -> HashSet<Coor> {
    let mut new_hash = HashSet::new();
    let limits = get_limits(black_tiles_hash);
    
    for x in (limits.0.x-1)..(limits.1.x+2) {
        for y in (limits.0.y-1)..(limits.1.y+2) {
            let coor = Coor { x, y};
            let neigh_count = count_neighbours(black_tiles_hash, &coor );
            let currently_black = black_tiles_hash.contains(&coor);

            if (currently_black && (neigh_count == 1 || neigh_count == 2)) || (!currently_black && neigh_count == 2) {
                new_hash.insert(coor);
            }
        }
    }
    
    new_hash
}

fn count_neighbours(black_tiles_hash: &HashSet<Coor>, tile: &Coor) -> u8 {
    [(-1, 0), (-1, -1), (0, -1), (1, 0),(1, 1), (0,1)].iter().fold( 0, |acc, x| {
        let coor = Coor {x: tile.x + x.0, y: tile.y + x.1};
        if black_tiles_hash.contains(&coor) {
            acc+1
        } else {
            acc
        }
    })
}

fn get_limits(black_tiles_hash: &HashSet<Coor>) -> (Coor, Coor) {
    let mut min_coor = Coor {x: 0, y:0};
    let mut max_coor = Coor {x: 0, y:0};

    for tile in black_tiles_hash {
        if tile.x > max_coor.x {max_coor.x = tile.x}
        else if tile.x < min_coor.x {min_coor.x = tile.x};
        if tile.y > max_coor.y {max_coor.y = tile.y}
        else if tile.y < min_coor.y {min_coor.y = tile.y};
    }

    (min_coor, max_coor)
}

fn get_input() -> Vec<Vec<Direction>> {
    INPUT.split('\n').map(|x| {
        let len = x.len();
        let mut i = 0;
        let mut tile = Vec::new();

        while i < len {
            let dir;

            if &x[i..i+1] == "n" || &x[i..i+1] == "s" {
                dir =  &x[i..i+2];
                i+=2;
            } else {
                dir = &x[i..i+1];
                i+=1;
            }
            tile.push(Direction::from_str(dir));
        };

        tile
    }).collect()
}

static INPUT: &str = 
"nenwswenweswweenesweeenenwee
nwnwnwnwswenenenwneswneenwnenenwnenwsw
weweeeeneneseswesesweeesenwnw
wnwwwwwnwwnewsewnwenwwnww
enwnwsenwnenwnwseenwswnweseswenwswnwsw
nwseseswsenwseswseseswsenweseeeenwnwsese
senwwwwnweeswewwwewwnenenwswse
swnwneswnweneneneswneneeneswne
ewsenwweneeeenwnwneneswnewwswesene
sesenwsweseseswnenenwnweenwseenewee
seswwwswwnwnwsewneenenenwnwneneseww
nenenenenenenenenwsenewne
swwnwswswswwswswswswswswswe
nenwswnesesesesesesesesesesenwsenwsesesew
wswwneswswswweeswswwwswnwswswseswnew
wwwwwnwwewenwwwwswnwwew
neenwnwnwnenenenenwenenwnwwwnwswswse
swwneswswswswnwseswswswswswsw
seseseenesewnwseseeswwseseeseneesesw
nesenwswseswnwwseswwwseswwnenewswwwse
wwwwwwswewww
seenewewenwneswneneneneneneswnenee
sesewnwsenwnwesesweneswseseseswnwsee
nenwnenenwnwnwswnenwnwsenenwnenwwnwnwne
seseswneeneeseeewwnwseesenwsenwsee
seseeeeseseweesesesewnesesesenwsene
swwswswseswwwswnewe
swwswswswwseneswswseswswwnewswwwsw
neeswneneneenenenene
neeswseseswswnwwseswnwwswswseseseseseswne
ewneneneenewewnenewseneenwneeesw
enwnenwneeeeseeeeswenweeneseese
nwwnwnwnwnwnwnenenenenenenenenwsenwsene
nwseenwnwnwnenwnwwsenwnwne
seseswsenwswseswswswseeseswse
seswneswswswswswswswswwwswsw
enesenenwesesweeweeswseseeseseew
wwswnwweneswneenwsesesenwnwsenwwnw
swnwwnwswwewsenewenwnewseswnwwww
wswewnwwswwnwswswswswswwswsweswesww
swesenwnweeneseseseswswwnwsewwenwswne
wwwswwsewwwwswwwwwnw
neeenwwwswnewnenwnwsenwsewwwww
seneswswsewswneswswseswswseseseseewnwsese
nenenenewneneneneneneneneeseneweese
wswsweeswswwswswswswwswswwswwnwsw
wwwseswnewswswswwwwwwsw
wnwnwnwwnwnwnwnenwenenweneswsewenwnwnw
wwweswewnewwnwswsewwwwwnwnenw
nwnwsweneeeseeseeeseesesesenwseswese
nwwswswswwswwswewwwwsenwswsenwsww
senwnenwnwnwnwnwnwnwnwnwnwnwsw
neswnwseswswswswswswswswswsweswwswe
eeeeeeeseenwnweeseesweeeenw
swseseseswswwnwneswewwnwnwseeswnwswwne
neesenwseesesewwnwseeseseenwnesw
neswswswwwswswsesweswswsw
eeneeewsenweseeeweeeneswee
nwnenweneewnwnwnwwnwwwswnwsenwnwnwnw
newneeneseneneswnenwnenenesenewnwsw
seseneeewsweneneeeneseneeeswwwene
swswswswseswswwsesesesweswswswneneswsww
eeeeswneneeewseewneeseeee
neeeneneneeeneneewneewwwnesenene
eneswnwnenwneeswwswneeeenenwenese
seenwseseseeneeseseeseseseweseswsese
seswnwswswenewnewnwswsw
wwwwwwwwwwwneswswwwnewswse
seeseswseseseswwsesese
nenenewenenewesenesewesenwewnewne
nwneseneeneseneswneneneewneewnee
nenenwneneewewneeseneeneeneeese
eswnwswwswsewweswwnwneswwwswww
neseswnweeeeseeeswee
wwwwnwswwwswswswnwsese
wseseswswwswswswnweswswsesweseesw
nwneneneeewewwneneneeeeeswese
eesesesewnwseenweeeeesenweseswse
neneneneenenwneswneneneneeeneee
wswswsweeseswswswswwnwnwwsw
wseewesenwnwneswnenweewneneswwnw
nwneeswswseswwseseneswesenenwsenesww
nwsewwwwswswwsenw
swswswewswnwswwswswnwewswwseswww
swswwwsewwnenesewwswswswwwwww
nenwnwnwwnwnwnwnwnwnwenwswnwnwnwnwsenwnw
neneneneneneneneneneneneneneswe
nwwwswenwwneenwnwwswewnwwnwsww
eseswseswwnwneswneswsesewswnenesesw
wwwwwnwnwwwe
senwenenewwnewswneewnesewsenenenesene
sewewneewnwneenenenenweneese
swswswewwwewneswswwswswswswwww
swwnwneneenenenenwnwnenewnwseswnwsenenw
swnenwneenenwnwnwnwsenwnwnwnwnwnwnwnwnw
neswsesewswseeeneseswnwwswswsw
ewwwwswwwswwneswwwewnwnewwsene
nwnwnenwnwnwsewnweneswwswnwnwsenewnee
ewneseeeeeeewenweseeeeeee
nwseswwswseewwnwwwnwwnwwwseswene
swswwswweswswewswswswsw
nwnwneswnwneenwnwnwneswnenwnwnwnenenwne
eswweeeeswseenewenwsenwesesese
seswnwneswnenenwnwnwesenesenwswnenenwnene
nenwnenenwwnenwnwnenwnwsenwnwswse
newwwweswswswwswseenewwseseswnwsw
nwwnwsesenwnwnesenwnwswnwewnwnenenwnwnw
nwneneneneneneneeswnwnenenwne
wnwnwsenwnesenenenenenwnenwne
nenenwnenewnesenenewseneneeneneseenenesw
wneneswnwnenwnwswneeseenwseswnesesenww
swseswseseswseswneswseswsewseswsese
weeesweeesenwseeee
nenwswswnenwweswseseseewseneneseswe
neweewneswneenweeneesweewnenene
nesesweenenewneenenenewesenesenew
swswswswseseswseswswswswswnw
neneswwwwwwwwwwsewsenewwswww
nenenenwnenenenewsenenesenenewnenwnwne
neeneeswneeseeseenenwnwwseswewee
swswswswnwseseswneseswseseswswswwnenesw
neeswnenwneeeeweswswsweneneenwe
wsenweswseenwsewsesenwsenesesesesesenesw
seseswseseseswneswswse
swnewswwwsesewswnewwwswwswswswww
senewneneneseneenenenwewenwwnwswsw
weseneneseseseeeweeseswsweenesese
swnewwswnwseswswswseswswwwswswswswne
neneeenenweneneswenenesenwewneenesw
seseseseneseswseseswswsewsenwseseesesese
nenenwnwnwnenwnenenesenenwwneneneene
nwnwnwsenenenwneswwnwnwnesenwnenenenew
neeeeeweneseeweweeneeneenee
wneneeneneenewneneeeeseeneneseeswe
eswwwnwwnwwnwwwwwwwenwswneswe
eseswwsweseeeneenewe
sesesweseseswsesesenwseseseseweseswne
sewseseseseseseseeseseseneseesenesw
swwneewswwwnwwswswwenwewnwnwnww
eneneeeenwsenwnwesesweeeeswee
wwwwwwswwswwnew
swswwwswwnwewwnwneswwnwseneneww
swnewnwnewnwwsweseeseswwswnenenwsee
swewswswwswswswswseswswswswesweswswnw
neswswseswswswswswswswneswswwnweswswe
seeseseneseswswwsewseseenwsesenwseswsw
esewneswnewwesewneswneneneneeenwe
nesewnenesweneeeneneenenenenwnenenese
nwnenwnwwnwnenwnenwnwneeeneswnwnwenww
eeeeeeswwwwnesenenwenwsenewsw
nwswweswsweswsenwneswewswwswnesenwsw
sesenwseseseseesesesesesesesesesesw
nenesenenwnenwnwwnenwneneswnewesenene
swnwwswswwwnenwwseswwwwnewewsee
esesewswswsenwswswswnenewsw
nwnwnwwnwnwnwnwnwse
eeneenenewsenenewwnenenenenenesenwe
sweseswswseneseswswswnwswnwswswseswswse
eeseneeneneneeenenweeeeswnwee
swswwewswwwnenwseswwswswswswswswsww
neswswswnwwswnwseswweswswwswsww
nwswnenwnewnweseneneeswswneswnwnwnesene
ewnenwswwwnwnwnwnwnwwswwwwwwne
wswseseseeseswnwwenenwneswsenesenwse
nwnenenwseneswswsee
nenenenenenwnewswnwnenwswnwnwenenwnwe
neweweweswesenweesesenw
eenwneeeeenwwneeseseseseswwsese
seeseneswseeseeeee
nwneswswnwwweswnenewwnwneseseswwwse
newwwswwnwwnwnww
neneeneseswnwenenesweneeneneweeew
wswswnwneswenesenwnwnewnwsenenwnenesenenw
wneneeneseswnweseseneewswenwnenwsese
nwsweswswswwsweswswsenwwenweswneenw
seneswswswswswseswswswswswswneswswswnwswse
wswswneneneswswswswwsewswwnew
enwsenwsenwswswewnewewnwweseww
wswswseswsewwswwwwwswwwwnwnew
swneswswswewswswswwwseswswswswswwswnw
seeneweseeseeeswseeneseneswnwweswse
eeeseweswseweeeeeswsenwneewe
swnweneneeneeeneeenenewneneeene
eeeeneseeeseneeswsenenweewnwnw
swswswnewwseswseswswswseseneswewnwswe
nwswswneeseswneswnwnwswsesw
wwnwwswwwsewwswwwww
sweeneeeneenwesweseeeneenweee
nwwswsenwnwswnwnwnwswseeseseneenenwse
nwwnenwnwnwswwwwwnwnwww
wwwswnwnesenesewwseneesenwneseewsw
nwnweenwnwnwswnwwnenwwsweswnweswene
nenwnwnwnwneenenewwneswnenese
nenenwnewnwsenwnewsweenene
nwneenwneswsweswneseeswswsenenenenwnw
swswseswseseneseseseseseswswswsenenweswse
senwswwsenwswsenwswswswswswswswswswww
nwnwenwneswnwnwnwnwnenwnwnwnwnwnwnw
nwnwwenewnwnwswswwe
swsweseswseswnwnesesesenesewseswseswne
swseneswswneswwswnenwwswseseswneswswseswsw
swswseswswswswwwseswswneswswwnewswsw
seswseswseneswseeswsenwswseswsesewswswse
nenenenenewnenwnenenesenenesenenenenene
wnwnwsenenwwnwnwnwwnwwnwswnwwwee
nesesesesesesesenwsewseesesesewnesesese
seesesesesenenwsesesesweesesesesese
nwseeesweneswnenweswwwwnwnwnwnwswene
wswwswnenwnenesweswneswswseswswswsesenenw
eesweeeeeeeenw
wnwwwnwsewwnwnwwnwwsenwnenwwewnw
nwswnwsewswnwnewswwneenwnenwsewnenwnw
nenweenwneneneneswswneswsenwnenenenenenwse
nwnenenenenwnenesenewnesenenenenenenwne
seeeeeeseswnweeee
swswwwnwwwwewswwwwwswwewnw
wswwwswswnwwneseswseswwnewwswwnwse
sesesenewseeeseseswe
wswwsewwwwneswswwwwwnewswsew
eneeenweneneswnwneneeeneeeeese
neenenwneeeneeeneneneneneeswnenesw
nwswenwseeseesenenwneswseeesewesw
sewwneswswwsewnwswnwswsewnenewwsww
wseswwsenwnwnewsesenwwsenwneeswwnee
nwswseeeseeesesew
nwwsewnwnenwnwenwswswnwsewwesewe
ewneeeeeeweeeeeesweeenwe
neswswswwswswnwswnwseswswswwswseeseswsw
seseneeseeseneseeeewseseswseseenwse
nwnwnwnwsenwwnwnenwwnenwnwwnwnwswnww
nwseweseseswnwweneseswseneswswswswswnw
swwswwwswswnwwweswswwwewswww
nwnwnwswsenenenwwwseswnwnwnwesenwnwwnww
eeeseeeeseswenwnwee
enewneneeneseeeneeneeeeseeeew
nwwnwnwswseswwnwnewnesewwneswnwesenw
neeseswwwnwswwneeseswnewenwswswswsw
seseswseswnwnwenwsesenwneewwneseee
seseswswswesesenwseswnwswsene
nenwewneswneeeneneneseeeneneneee
sesesesesenwseseswseswsesesewnwsenesesw
nwnwswneswnwseenwnwswneswnwesesenwnwe
nwnwenewsweswnwsesenenewwnwnweswnw
nenwneneswseenenewsenwnwswnwwnwnwnenenew
sewseseseseswseswnesesesesesesese
neweeneeneneeeesenenwswswneneneneee
eneneeswwseneneswnenweeweswnenwswnw
senwswnenwnwnenenenwnewnwnenwsenwwnwnene
neswneswsenwswsewseenweseeeewsesese
seseseswseesewnweseeesenwseseswseenwse
sewwsesewwwwwwwnewwwnwwnwnw
nweneswnenwenwnenenenwnwnenwneswwnwnw
neneeneneneswenwneswnwnenwnwnwnwwswnene
nwwnwnwnwnenwnwnwnwnwswnwnwnwsenw
swwnwewwwsewswsww
eeseeseeeeseseseseswnwwseesesese
enwsenwseswwnwnwnenwnwwnwnwnwsenwnenew
ewneeneseneeseneneenwneneeneenenesw
seseseswnwsenenwseese
wswswwwwwneseww
neewneeswsenwnwnwnenenwnenwswnwnenwnw
neneseseswneswnwnwesenwnweenwnwnwswsenww
wwwnwnwwseenwsewwwwewwnenwnwsw
nwnenwnwwwwnwnwenwnwwnwswwnwenw
swseswwneesesesewseseseesesesenwswsese
swswseeseseseseswswswswswwswswseneswnwsw
senenesweewnweesewweneneseneeene
wwwwnewwwwwsewwsewswwwwnew
ewsesesesesesesenwswsese
swswwswswneeswnwswwseswswsee
sewnwwnewnwnewwwwwnenwsesewwnwww
nenwneneneneneneneneseneeneneneswnw
nwneseseeeswweee
swwnwswwewswwseeswenwswswswswswsw
swswneseswswswswnwswswswseeswswswswnwne
wnwnewneenenesesenesweswneeswenene
nwseseseseseswnwwseeseseeseseseesese
eswnwswwnwwewwwnwnwsewenenwwse
ewwswwwnenwewewwesewewww
swseneseswswswswwswswswnwswswswsweswswnw
swwwswnwwweewnwsew
eeeeseseewnweewsweeeeeee
nwnwnwnwnenwsenwnenwewnenwewnwsewnwnwnw
nwsewnwnwnwneswnenwnenwnenwnwnenwswesw
swnwnwwwewwnwwewwwewwswnwnw
eneeeesweewnenwnenesewewnee
nwnwnwswwnwnwnwwwsenwwwne
eeeseeeseeweseeseseweeesenwse
eswsewswswswswswswswwswswnwswsw
seseeeseeeeeeesenwsw
esweeswsesewseeneseseseneeswnwsenesew
swswswswnweneseeseswseswwswswswswswsw
wwwwswwswwneswswwwsww
swswwsweswnwswswswsw
nenenwsewsenewnenewnenwnwswneseneseswe
seseswseseswswswswswswneswwswsenenwsesw
swsewsenesesenwseseseseenwseesenesesw
enwwwswwnwesweswsenesewwswswwnw
nwswnwnwnwnwnenwnwnwnwnwnwnwnesenweneswnww
swswswewwswseseswswwnwnwnwswneeswnww
wswneenwewnweneswneneneesw
seeeseswwseeneseweeswnenweswsenew
nwnwnewnewnwwwwwsewwnwwswnwwese
eeswnenwswswswswwswswswsw
nwnenwneneneneneswneenenenwnwnwnenwnwsw
seseseeeeseeseseseeswswnenwwe
swwnewnwsewnwwnenenwwnwwsesewwnwnew
nwnwsewnwneenwnwnwnwnenwnwneswsenenwnw
wwwwwswwewwwwewnewwweww
wnwsenwwsewnwwwnwnwnesenewnwswnew
swsenesesenesesesesesesesewswesesesese
seseneswswwseseseseseswneswseswseseesese
enesenenwseneseseswweseeseneswwwsese
sesesesenesewseseesesesewwswneseseesw
eeeseeeeweesenenweeseseswese
swnwnwswnweswenesenwsenwseewneneswsesw
sewswseenesesesenwnwsenenwseesesewnesw
swswswswswsweswnewswswsesenenwswswnwsw
enesweeeneseeseswwseeeenweese
esenwwnwswseneneseswneseesenesewse
swswsesewswnesewsewneseneseswswnesese
eseweeswseeeeseesenenee
newneswswwwswswwwwwwswnewwwwsesw
nenenewswnwswnesenwnwnenenenwnwnwnenwne
wseswnewsewswwnwswnewwwwwswwww
wwwswwwnwwwwenwwnwwnww
weeeeeesweenweswwneeeeeeee
wneswswswnwswswsewswwsewsw
seenwewseseseseseeseeesesesenweesw
neswnenenwwnwenwnwnwnwwenenene
wnewwseeswwnewneswnenwswwwwsww
swswnwneswnweswseswswswswwwwsweswwsw
wswsenwwswswwswwweneswswwswswswnew
nwnwwwenwesenwseswnwnw
seneneeeneenewe
nwwnweenenwwnwnwsenwswnwnweswnenwswnwne
nwnwnwnwsenwnwnwnenenwnwsenwnenwnwenwnww
seswnwseswswseeneswwseseswseswswswseswsw
swswneswwswswnewswwwnweswswnesesenw
seswswseseswswsesenesw
seseneswseseseseseesenesesesewsenenwsw
neneneenenwswnwnwneneswnewnwnewnenwee
seseswsewswnwseseswsesweseseeseswnesesw
wwnenenwswsenwnwneneeswseeswew
swwswnwnwseseseswnwseenenwseswnweswenw
nwswwswswswswswswsweswnewsweseswswnesw
sewwswwwnwwenwwnesenewnwswwswsene
swseswsesesesenwseweseswseseswswsenwseese
seseeseseesesenweeesweweesee
wewswnwnwswenwnwswewseneneswsewwne
esesenwseseenwswnewswenwseseseswnwswnw
neswswseseseseseswseswswwnenwseseseswese
seeeesesesesenwsenesewseesenwsesww
swswseswsweswwswswswseswseswswnwswsw
neeneeeneseeenwsweeeseeenwwne
swwesesesenesenenewsesenewseesewsese
nenwnwnwwwnwswnwnwsenwwwwnewwnwnw
eweneeenweewsweeeeeeseneese
newneswneneneeeseswneneswneneneswnwsw
nweeeeeeeeweweeeeeesese
sewnwwwwwewenwnwnwwwwwwwww
nenewneenenenenwwnenwnenenenenenwe
eswswnesesewneseseswnwwswne
eeseesweeewseseeeneeese
wneswsewwseesesenwneeseseswneswnwsesw
swwswseswsesesweseswseswsw
swswswwswswswsenwswswswswwswseswnenwswsw
seneswweeneswnwneeneeeseweeew
swswsweswnewnenesenwseseswswseseswsww
nwnesewsweswwwsenewwnewwwwww
ewneseseeeenewnenenweeneeswnene
wwwwwwnwwwewseewnenwwwnwwsw
wwwseswwsewswneswwneswwwwwwnw
nenwnesenwnenwneenwnwnwnwnwnenwnwnwwsesw
swneenwwswenwenweseeweeese
nwwnwenwnweseswneewnwenwswnwwnwswnw
nwwnwsenenwnwseneswnwneswnwnwnenwnenenenw
nenenwnwsenenenenenenenwnenwnwnw
nenwwseeneneswwsesenesenwnenenwsenenee
nwwswswenwwnwsenwweneenwnenwnwwwww
wnwswnewwwwwswnwnwwwnewwnwwswne
nwsenwnwswnwnwswnenwnenenwnenwnwnwnwnenw
ewnenenewneneneneenenenenwnenene
nwsesesenwnwseeseseseseeseseesweesesw
seeswnenesewnenwnenenwnenwneneneswenene
seeeswenwseswneeese
swenwenwswswseneswsenw
wnwnwwnwnwsewnwnwnwnenwnwnwnwsewnenw
nwwsenwnwsenenwnwnwnwnwnwnwwnwnenenwnenw
sesesesenenwseeseseswseseseseswe
swwwneseswswnewswwwswswswwnewswswww
wwnwwnwnewnwnwswwnwwnwnw
wsenwswesenwneswswseswswswewsweswswnw
eeseneeeeesweeewwneeseeneesw
ewnenwnwnwswnwnwwsewwwnwnwewsenwnww
nwesewsesesweeseesenenesesewseseesese
seesweewneseseseenwseswneswenwsesenwse
weeneswnesweswenwwnwnewswsenwene
nwnwnwwwnwwwsenwneweswswwenwnwsene
nwnwnwnwwnwnwwnwnwwwswwwnwsewnwe
swneneeswseenwseneswnweenewnweenenw
eweeneswenweneenwsweeeene
nwnwnenwewseseneseneswwnenwnenwnwnwsenew";