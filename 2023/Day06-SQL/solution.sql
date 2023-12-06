DROP TABLE spec;

CREATE TEMPORARY TABLE spec
(
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	time int,
	distance int
);

INSERT INTO spec
    (time, distance)
VALUES
    (62, 644),
    (73, 1023),
    (75, 1240),
    (65, 1023);

WITH
    boundaries
    as
    (
        SELECT (time + sqrt(time * time - 4 * distance))/2 as a,
            (time - sqrt(time * time - 4 * distance))/2 as b
        from spec
    ),
    count
    as
    (
        SELECT floor(a) - ceil(b) + 1 as v
        from boundaries
    ),
    collapsed
    as
    (
        SELECT GROUP_CONCAT(time, '') as time,
            GROUP_CONCAT(distance, '') as distance
        from spec
    ),
    collapsed_boundaries
    as
    (
        SELECT (time + sqrt(time * time - 4 * distance))/2 as a,
            (time - sqrt(time * time - 4 * distance))/2 as b
        from collapsed
    )
    SELECT floor(a) - ceil(b) + 1 as solutions
    from collapsed_boundaries
UNION
    SELECT round(exp(sum(log(2.7182818284590452353602874713527, v)))) as partOne
    from count;