' cscript solution.vbs

Const ForReading = 1
Dim file, content
Dim fso

Set fso = CreateObject("Scripting.FileSystemObject")
Set file = fso.OpenTextFile("input", ForReading)
content = file.ReadAll

Function tiltNorth(platform)
    Dim height : height = UBound(platform)
    Dim width : width = UBound(platform, 1)

    Dim newplatform
    ReDim newPlatform(height, width)

    For x = 0 to width - 1 Step 1
        Dim nextPossibleY: nextPossibleY = 0
        For y = 0 to height - 1 Step 1
            newPlatform(y, x) = "."
            Dim char: char = platform(y, x)
            If char = "O" Then
                newPlatform(nextPossibleY, x) = "O"
                nextPossibleY = nextPossibleY + 1
            ElseIf char = "#" Then
                newPlatform(y, x) = "#"
                nextPossibleY = y + 1
            End If
        Next
    Next
    tiltNorth = newPlatform
End Function

Function rotate(platform)
    Dim width : width = UBound(platform, 1)

    Dim newplatform
    ReDim newPlatform(width, width)

    For x = 0 to width/2 - 1 Step 1
        For y = x to width - x - 1 Step 1
            newPlatform(x, y) = platform(width - y - 1, x)
            newPlatform(width - y - 1, x) = platform(width - x - 1, width - y - 1)
            newPlatform(width - x - 1, width - y - 1) = platform(y, width - x - 1)
            newPlatform(y, width - x - 1) = platform(x, y)
        Next
    Next
    rotate = newPlatform
End Function

Function getLoad(platform)
    Dim height : height = UBound(platform)
    Dim width : width = UBound(platform, 1)

    Dim load: load = 0

    For x = 0 to width - 1 Step 1
        For y = 0 to height - 1 Step 1
            Dim char: char = platform(y, x)
            If char = "O" Then
                load = load + (height - y)
            End If
        Next
    Next
    getLoad = load
End Function

Function stringigy(platform)
    Dim st: st = ""
    For x = 0 to width - 1 Step 1
        For y = 0 to height - 1 Step 1
            st = st + platform(x, y)
        Next
    Next
    stringigy = st
End Function

lines = Split(content, vbCrLf)
Dim height : height = UBound(lines) + 1
Dim width : width = Len(lines(0))

Dim platform
ReDim platform(height, width)
For y = 0 to height - 1 Step 1
    Dim line : line = lines(y)
    For x = 0 to width - 1 Step 1
        platform(y, x) = Mid(line, x + 1, 1)
    Next
Next

platform = tiltNorth(platform)
WScript.Echo "part one: "
WScript.Echo getLoad(platform)

Dim stateToi
Set stateToi = CreateObject("Scripting.Dictionary")
Dim iToState
Set iToState = CreateObject("Scripting.Dictionary")
For i = 1 to 1000 Step 1
    platform = tiltNorth(platform)
    platform = rotate(platform)
    platform = tiltNorth(platform)
    platform = rotate(platform)
    platform = tiltNorth(platform)
    platform = rotate(platform)
    platform = tiltNorth(platform)
    platform = rotate(platform)
    Dim x: x = stringigy(platform)
    If stateToi.Exists(x) Then
        Dim oldi: oldi = stateToi(x)
        Dim cycleLength: cycleLength = i - oldi
        Dim target: target = ((1000000000 - oldi) MOD cycleLength) + oldi
        WScript.Echo "Part two: "
        WScript.Echo getLoad(iToState(target))
        Exit For
    End If
    iToState.Add i, platform
    stateToi.Add x, i
Next
