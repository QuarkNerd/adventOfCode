$inp = Get-Content -Path $PSScriptRoot\input

function Get-Next-State {
    param (
        [int[]]$state
    )
    $iOfHighestMemoryBlocks = 0;
    $blocksToRedistribute = -1;
    for ($i = 0; $i -lt $state.Length ; $i++) {
        if ($state[$i] -gt $blocksToRedistribute) {
            $iOfHighestMemoryBlocks = $i;
            $blocksToRedistribute = $state[$i];
        }
    }
    $i = $iOfHighestMemoryBlocks;
    $state[$iOfHighestMemoryBlocks] = 0;
    while ($blocksToRedistribute -gt 0) {
        $i = ($i + 1) % $state.Length; # rewrite
        $state[$i] += 1;
        $blocksToRedistribute -= 1;
    }
    return $state;
}

$state = $inp.split() | % { 
    [int]$_ 
}
$stateString = $state -join "-";
$stateDictionary = New-Object System.Collections.Generic.Dictionary"[String,Int]";
$count = 0;
while (!$stateDictionary.ContainsKey($stateString)) {
    $stateDictionary.Add($stateString, $count)
    $state = Get-Next-State($state);
    $stateString = $state -join "-";
    $count++;
}
"Part One" 
$count
"Part Two"
$count - $stateDictionary[$stateString] 

# Why New-Object System.Collections.Generic.Dictionary"[String,Int]";
# Not New-Object System.Collections.Generic.Dictionary[String,Int];