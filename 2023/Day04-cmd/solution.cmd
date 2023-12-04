@echo off
setlocal EnableDelayedExpansion

set /a count=0
FOR /F "delims=" %%A in ('findstr /N "^" "%~dp0\input"') DO (
    set "line=%%A"
    set "line=!line:*:=!" & rem Remove all characters to the first colon
    set "line=!line:*:=!" & rem Remove all characters to the next colon
    set /a count+=1
    set "cardArray[!count!]=!line!"
    set cardCountArray[!count!]=1
)

@REM construct matches array
for /l %%i in (1, 1, %count%) do (
    @REM echo %%i
    set /a matches = 0
    set /a allNumbersCount = 0
    for %%a in (!cardArray[%%i]!) do (
        @REM echo %%a
        @REM loop through numberArray for match
        for /l %%j in (1, 1, !allNumbersCount!) do (
            IF "!numberArray[%%j]!" == "%%a" (
                set /a matches+=1
            )
        )
        set /a allNumbersCount+=1
        set "numberArray[!allNumbersCount!]=%%a"
    )
    set matchesArray[%%i]=!matches!
)

set /a partOneTotal=0
set /a partTwoTotal=0
for /l %%i in (1, 1, %count%) do (
    set /a matches=!matchesArray[%%i]!
    if matches NEQ 0 (
        set /a "partOneTotal+=( 1<<(matches-1) )"
    )

    for /l %%j in (1, 1, !matches!) do (
        set /a index=%%j + %%i
        set /a cardCountArray[!index!]+=!cardCountArray[%%i]!
    )

    @REM echo !partTwoTotal!
    set /a partTwoTotal+=!cardCountArray[%%i]!
)
echo Part one:  !partOneTotal!
echo Part two:  !partTwoTotal!

endlocal