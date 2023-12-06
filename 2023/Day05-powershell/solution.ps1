function Parse-Map {
    param (
        $stringMap
    )

    $lines = $stringMap -split [System.Environment]::NewLine
    $lines[1..($lines.length - 1)] | Where-Object { $_ -ne "" } | ForEach-Object { 
        $listVal = $_ -split " " | ForEach-Object { [convert]::ToInt64($_) }
        @{ destinationStart = $listVal[0]; sourceStart = $listVal[1]; rangeLength = $listVal[2] }
    } | Sort-Object  -Property { $_.sourceStart }
}

function Convert-Number-For-Map {
    param (
        $inp,
        $map
    )

    foreach ($option in $map) {
        if ($inp -ge $option.sourceStart -and $inp -le ($option.sourceStart + $option.rangeLength)) {
            return $option.destinationStart - $option.sourceStart + $inp
        }
    }

    $inp
}

function Convert-Range-For-Map {
    param (
        $range,
        $map
    )
    $newRanges = new-object system.collections.arraylist

    foreach ($option in $map) {
        $optionStart = $option.sourceStart
        $optionEnd = $option.sourceStart + $option.rangeLength - 1
        $shift = $option.destinationStart - $optionStart

        if ($range.start -gt $optionEnd) {
            continue
        }
        if ($range.end -lt $optionStart) {
            $newRanges.Add($range) | Out-Null
            return $newRanges
        }
        if ($range.start -lt $optionStart) {
            $newRanges.Add(@{start = $range.start; end = $optionStart - 1 }) | Out-Null
            $newRanges.Add(@{start = $optionStart + $shift; end = [math]::min($optionEnd, $range.end) + $shift }) | Out-Null
        }  
        if ($range.end -gt $optionEnd) {
            $newRanges.Add(@{start = $range.start + $shift; end = $optionEnd + $shift }) | Out-Null
            $range = @{ start = $optionEnd + 1; end = $range.end }
        }
        else {
            if ($range.start -ge $optionStart) {
                $newRanges.Add(@{start = $range.start + $shift; end = $range.end + $shift }) | Out-Null
            }
            return $newRanges
        }

    }
    $newRanges.Add($range) | Out-Null
    $newRanges
}

function Convert-Number-For-All {
    param (
        $inp,
        $maps
    )

    $return = $inp
    foreach ($map in $maps) {
        $return = Convert-Number-For-Map $return $map
    }

    $return
}

$inputText = Get-Content -Raw -Path $PSScriptRoot\input
$inputArray = $inputText -split [System.Environment]::NewLine + [System.Environment]::NewLine
$seeds = $inputArray[0].split(" ")[1..($inputArray[0].length - 1)] | ForEach-Object { [convert]::ToInt64($_) }
$maps = $inputArray[1..($inputArray[0].length - 1)] | ForEach-Object { , (Parse-Map $_) }

"Part one: "
$seeds | ForEach-Object { Convert-Number-For-All $_ $maps } | Sort-Object | Select-Object -First 1
$ranges = new-object system.collections.arraylist
for ($i = 0; $i -lt $seeds.length; $i += 2) {
    $ranges.Add(
        @{ start = $seeds[$i]; end = $seeds[$i] + $seeds[$i + 1] - 1 }
    ) | Out-Null
}

foreach ($map in $maps) {
    $ranges = $ranges | ForEach-Object { Convert-Range-For-Map $_ $map }
}

"Part two: "
$ranges | ForEach-Object { $_.start } | Sort-Object | Select-Object -First 1
