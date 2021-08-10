function Get-Max-Diff {
    param (
        $NumArray
    )
    $min = [int]::MaxValue
    $max = [int]::MinValue

    for($i = 0; $i -lt $NumArray.length; $i++){ 
        if ($NumArray[$i] -lt $min) {
           $min = $NumArray[$i]
        } 

        if ($NumArray[$i] -gt $max) {
           $max = $NumArray[$i]
        } 
    }

    $max - $min
}

function Get-Only-Quotient {
    param (
        $NumArray
    )

    for($i = 0; $i -lt $NumArray.length; $i++) { 
        for($j = $i; $j -lt $NumArray.length; $j++) {
            if ($numArray[$i] -gt $numArray[$j] -And $numArray[$i] % $numArray[$j] -eq 0) {
                return $numArray[$i]/$numArray[$j]
            } 
            if ($numArray[$i] -lt $numArray[$j] -And $numArray[$j] % $numArray[$i] -eq 0) {
                return $numArray[$j]/$numArray[$i]
            }
        }
    }
}

$input = Get-Content -Path $PSScriptRoot\input
$input = $input.split("\n")
$checksum1 = 0
$checksum2 = 0
$input = $input | % { 
    $numArray = $_.split(" ") | % { 
        [int[]]$_ 
        } 
    $checksum1 += Get-Max-Diff($NumArray)
    $checksum2 += Get-Only-Quotient($NumArray)
    }

$checksum1
$checksum2
