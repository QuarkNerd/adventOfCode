$inp = Get-Content -Path $PSScriptRoot\input

function Are-All-Elements-The-Same {
    param (
        [int[]]$array
    )

    $elem = $array[0]

    for ($i = 0; $i -lt $array.Length ; $i++) {
        if (!($elem -eq $array[$i])) {
            return $false;
        }
    }
    return $true;
}

$wordPattern = [Regex]::new('[a-z]+')

$matches = $wordPattern.Matches($inp)
$set = New-Object System.Collections.Generic.HashSet[string];
$matches | % { 
    if($set.Contains($_)) {
        $set.Remove($_) | Out-Null
    } else {
        $set.Add($_) | Out-Null
    }
}
$array = New-Object string[] $set.Count
$set.CopyTo($array)
$root = $array[0]

"Part one:"
$root

Class Disc
{
    [string]$name
    [int]$weight
    [int]$totalWeight
    [string[]]$contents
}

$lines = $inp.Split([Environment]::NewLine);

# Generate discsDictionary, disc names mapped to Discs
$disksDictionary = New-Object System.Collections.Generic.Dictionary"[String,Disc]";
$lines | % {
    $basePattern = [Regex]::new('^[a-z]+');
    $weightPattern = [Regex]::new('\d+');

    $base = $basePattern.Match($_);
    $weight = [int]$weightPattern.Match($_).Value;

    $contents = @();
    if ($_.Split("-").Length -gt 1) {
        $contents =  $wordPattern.Matches($_.Split("-")[1])
        $contents = $contents | % { $_.Value }
    }
    
    $disk = New-Object Disc;
    $disk.name = $base.Value;
    $disk.weight = $weight;
    $disk.contents = $contents;

    $disksDictionary.Add($base.Value, $disk);
}

# update disksDictionary to have totalWeights
function Calculate-And-Store-Total-Weight {
    param (
        [string]$diskName
    )

    if (0 -eq $disksDictionary[$diskName].totalWeight) {
        # "bb" | Out-Host
        $disk = $disksDictionary[$diskName];
        $weight = $disk.weight;

        if ($disk.contents.Count -gt 0) {
            $disk.contents | % {
                $weight += Calculate-And-Store-Total-Weight($_);
            }
        }

        $disksDictionary[$diskName].totalWeight = $weight;
    }
    return $disksDictionary[$diskName].totalWeight;
}
Calculate-And-Store-Total-Weight($root);


# Going through from root to find where weiths are equal risks junction of two and not knowin which to choose

# ignore disks with 2 contents as they cant be at the root of the problem
$unbalancedDisks =   $disksDictionary.Values.Where({
    ($_.contents.Count -gt 2) -And (!(Are-All-Elements-The-Same($_.contents | % {$disksDictionary[$_].totalWeight})))
})
# The lightest unbalnced disk (LUD) will contain the disk that has the wrong weight
$LUD = $unbalancedDisks[0];

$unbalancedDisks | % {
    if ($_.totalWeight -lt $LUD.totalWeight) {
        $LUD = $_;
    }
}


$correctTotalWeight = 0;

for ($i = 0; $i -lt $LUD.contents.Length ; $i++) {
    $diskA = $disksDictionary[$LUD.contents[$i]];
    $diskB = $disksDictionary[$LUD.contents[($i + 1)%$LUD.contents.Length]];

    if ($diskA.totalWeight -eq $diskB.totalWeight) {
        $correctTotalWeight = $diskA.totalWeight;
    }
}

$LUD.contents | % {
    if (!($disksDictionary[$_].totalWeight -eq $correctTotalWeight)) {
        "Part Two"
        $disksDictionary[$_].Weight + ($correctTotalWeight - $disksDictionary[$_].totalWeight)
    }
}

# # split takes multiple chacters not long sring
## $null should be on the left side of equality comparisons.

# if ($disk.contents.Count -gt 0) {
#     $disk.contents | % {
#         $weight = $weight + Calculate-And-Memoise-Total-Weight($_)
#     }
# }
# (!(Are-All-Elements-The-Same($weights))) vs (!Are-All-Elements-The-Same($weights))
#https://stackoverflow.com/questions/58217913/should-null-be-on-the-left-side-of-the-equality-comparison-eq-with-arrays - aisde
#$() +=