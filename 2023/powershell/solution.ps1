$input = Get-Content -Path $PSScriptRoot\input
$inputArray = $input.split("\n")

$sum = 0;
for ($i = 0; $i -lt $inputArray.length; $i++) { 
    # if ($inputArray[$i] -eq $inputArray[($i + 1) % $inputArray.length]) {
        $sum += [convert]::ToInt32($inputArray[$i], 10)
}
"Part One:"
$sum