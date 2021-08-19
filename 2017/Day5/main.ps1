"Part One"
$inp = Get-Content -Path $PSScriptRoot\input

$inp = $inp.split(" ") | % { 
    [int[]]$_ 
} 
$i = 0;

$steps = 0;
While ($i -gt -1 -And $i -lt $inp.Length) {
    $x = $inp[$i];
    $inp[$i] = $x + 1;
    $i += $x;
    $steps++;
}
$steps

"Part Two"
$inp = Get-Content -Path $PSScriptRoot\input

$inp = $inp.split(" ") | % { 
    [int[]]$_ 
} 
$i = 0;

$steps = 0;
While ($i -gt -1 -And $i -lt $inp.Length) {
    $x = $inp[$i];
    $inp[$i] = if ($x -gt 2) {$x - 1} else {$x + 1};
    $i += $x;
    $steps++;
}
$steps