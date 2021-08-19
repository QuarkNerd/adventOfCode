function Is-Valid-Duplicate-Mode {
    param (
        [string]$passPhrase
    )
    $passArray = $passPhrase.split(" ");
    $set = New-Object System.Collections.Generic.HashSet[string];
    $valid = $true;
    $passArray | % {
        if ($set.Contains($_)) {
            $valid = $false;
        }
        $null = $set.Add($_);
    };
    return $valid;
}

function Is-Valid-Anagram-Mode {
    param (
        [string]$passPhrase
    )
    $passArray = $passPhrase.split(" ")
    $set = New-Object System.Collections.Generic.HashSet[string];
    $valid = $true;
    $passArray | % {
        $hash = ($_.ToCharArray() | Sort-Object) -join ""
        if ($set.Contains($hash)) {
            $valid = $false;
        }
        $null = $set.Add($hash);
    };
    return $valid;
}

$input = Get-Content -Path $PSScriptRoot\input
$input = $input.split([Environment]::NewLine)

# $a.GetType().Name
#Is-Valid-Duplicate-Mode($input[4])
$input = $input.Where({ Is-Valid-Duplicate-Mode($_) })
$input.Count

$input = $input.Where({ Is-Valid-Anagram-Mode($_) })
$input.Count

# $count = 0;
# $input = $input | % {
#     if (Is-Valid-Duplicate-Mode($_) -eq $true) {
#         $count += 1;
#     }
# }
# $count

# Why does .Length not work
#Write-info
# why     Out-Host $passPhrase doesnt work because Out-Host -InputObject $thing
#([Environment]::NewLine because splits on ns
# returns are dumb

# powershell -join vs .split