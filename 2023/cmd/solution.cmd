@echo off
setlocal EnableDelayedExpansion

rem Create an array
set /a count=0

FOR /F "delims=" %%L in ('findstr /N "^" "%~dp0\input"') DO (
    set "line=%%L"
    set "line=!line:*:=!" & rem Remove all characters to the first colon
    set /a count+=1
    set "array[!count!]=!line!"
)

@REM echo %count%

set /a max=0
set /a current=0

rem Display the array elements
for /l %%i in (1, 1, %count%) do (
    IF "!array[%%i]!" == "" (
        IF !current! GTR !max! (
            set /a max=!current!
        )
        set /a current=0
    ) ELSE (
        set /a current+=!array[%%i]!
    )
)

echo !max!

endlocal