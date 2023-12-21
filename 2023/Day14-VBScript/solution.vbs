Const ForReading = 1
Dim file, content
Dim fso
Dim world 

Set fso = CreateObject("Scripting.FileSystemObject")
Set file = fso.OpenTextFile("input", ForReading)
content = file.ReadAll

WScript.Echo content
world = Split(content, vbCrLf)
' WScript.Echo content
WScript.Echo "content"
WScript.Echo world(0)

Dim load : load = 0
Dim height : height = UBound(world) + 1
For i = 0 to Len(world(0)) Step 1
    Dim nextRockLoad : nextRockLoad = height

    for j = 0 to height - 1 Step 1
        Dim char : char = Mid(world(j), i + 1, 1)
        ' Dim O : O = "O"
        If char = "O" Then
            load = load + nextRockLoad
            nextRockLoad = nextRockLoad - 1
        ElseIf char = "#" Then
            nextRockLoad = height - j - 1
        End If
    Next
Next
WScript.Echo load

' Part two not yet done