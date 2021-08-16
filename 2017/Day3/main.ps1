function Get-Max-Diff {
    param (
        $NumArray
    )
}

# Odd squares are placed on bottom right corners
# Use corners as anchor points

$input = [int](Get-Content -Path $PSScriptRoot\input)
$rootOfNextSquare = [math]::ceiling([math]::Sqrt($input));
$rootOfNextOddSquare = $rootOfNextSquare - (1 - ($rootOfNextSquare % 2));
$nextOddSquare = $rootOfNextOddSquare*$rootOfNextOddSquare;

# This will tell you how far away input is from the corner of the spiral 
$offSetFromCorner = ($nextOddSquare - $input) % ($rootOfNextOddSquare - 1)
$offSetFromCorner = If ($offSetFromCorner -gt $rootOfNextOddSquare) {$offSetFromCorner} Else {$rootOfNextOddSquare - $offSetFromCorner - 1}

$rootOfNextOddSquare - 1 - $offSetFromCorner