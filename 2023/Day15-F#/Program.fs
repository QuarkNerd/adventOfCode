// For more information see https://aka.ms/fsharp-console-apps
// |> vs ||>
// all methods static
// Array and type array are diff cased
// Reassignment require <- not =, system got confused thught I was doing equalit
open System.Text.RegularExpressions

type Lens(label:string, length:int) = 
    member val label = label with get, set
    member val length = length with get, set

let hash step =
    (0, Seq.toArray step) ||> Array.fold ( fun acc ch -> 
        (((int ch) + acc)*17)%256
    )

let input = System.IO.File.ReadAllText "../../../input"
let steps = input.Split ','
let values = steps |> Array.map (hash)
printfn $"Part One: {Array.sum(values)}"

let boxes = Array.init 256 (fun _ -> Array.empty<Lens>)

for step in steps do
   let label = (Regex.Match(step, @"[a-z]+")).Groups[0].Value
   let boxNum = hash(label)
   if step.Contains "-" then
       boxes[boxNum] <- boxes[boxNum] |> Array.filter (fun (a: Lens) -> a.label <> label)
   else 
       let focalLength = (step.Split '=')[1] |> int
       let lens = boxes[boxNum] |> Array.filter (fun (a: Lens) -> a.label = label)
       if lens.Length = 1 then 
           lens[0].length <- focalLength
       else
           boxes[boxNum] <- Array.append boxes[boxNum] [|Lens(label, focalLength)|]

let a = boxes |> Array.mapi (fun i box -> 
    Array.sum(box |>  Array.mapi (fun j lens -> (i+1) * (j+1) * lens.length))
)

printfn $"Part two {Array.sum(a)}"

