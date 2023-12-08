<?php
    function getGCD($numA, $numB) {
        $x = min($numA, $numB);
        while ($numA%$x !=0 || $numB%$x != 0) {
            $x--;
        }
        return $x;
    }

    function getLCM($numbers) {
        if (count($numbers) == 2) {
            return $numbers[0] * $numbers[1] / getGCD($numbers[0], $numbers[1]);
        };
        return getLCM(array($numbers[0], getLCM(array_slice($numbers, 1))));
    }


    $fullfilename = "input";
    $myfile = fopen($fullfilename, "r") or die("Unable to open file!");
    $contents = fread($myfile,filesize($fullfilename));
    fclose($myfile);

    $split = explode(PHP_EOL . PHP_EOL, $contents);
    $instructions = $split[0];
    $mapString = $split[1];

    $map = array();
    $starts = array();
    foreach (explode(PHP_EOL, $mapString) as $value) {
        $matches = array();
        preg_match_all('/[A-Z]{3}/', $value, $matches);
        $node = $matches[0][0];
        $map += array($node =>
            array(
                "L" => $matches[0][1],
                "R" => $matches[0][2]
            )
        );

        if ($node[2] == "A") {
            $starts[] = $node;
        }
    }

    $lengthToNearestZ = array();
    foreach ($starts as $start) {
        $x = 0;
        $current = $start;
        while($current[2] != "Z") {
            $instruction = $instructions[$x%(strlen($instructions))];
            $current = $map[$current][$instruction];
            $x++;
        }
        $lengthToNearestZ[$start] = $x;
    }

    print("Part one: " . $lengthToNearestZ["AAA"] . PHP_EOL);
    print("Part two: " . getLCM(array_values($lengthToNearestZ)));
?>  