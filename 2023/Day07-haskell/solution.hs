-- ghc -o solution solution.hs
import System.IO
import Data.List(group, sort, sortBy, words) 
import Debug.Trace 

getCardValue :: Char -> Bool -> Int
getCardValue 'A' _ = 14  
getCardValue 'K' _ = 13  
getCardValue 'Q'_ = 12 
getCardValue 'J' False = 11  
getCardValue 'J' True = 1
getCardValue 'T' _ = 10  
getCardValue x _ = fromEnum x - fromEnum '0' 

getCardCounts :: String -> [Int]
getCardCounts hand = sort [length x | x <- group (sort hand)]

getHandTypeValueFromCounts :: [Int] -> Int
getHandTypeValueFromCounts [1,1,1,1,1] = 1
getHandTypeValueFromCounts [1,1,1,_] = 3
getHandTypeValueFromCounts [1,2,2] = 4
getHandTypeValueFromCounts [1,1,_] = 5
getHandTypeValueFromCounts [2,_] = 6
getHandTypeValueFromCounts [1,_] = 7
getHandTypeValueFromCounts [_] = 8
getHandTypeValueFromCounts [] = 8

getHandCardOrderValue :: String -> Bool -> Int
getHandCardOrderValue hand isPartTwo = foldl (\x y -> x*15 + y) 0 [ getCardValue x isPartTwo | x <- hand]

getHandValue :: String -> Int
getHandValue line = 1000000 * (getHandTypeValueFromCounts (getCardCounts hand)) + (getHandCardOrderValue hand False)
  where hand = head (words line)

getHandValuePartTwo :: String -> Int
getHandValuePartTwo line = 1000000 * (getHandTypeValueFromCounts (getCardCounts handNoJ)) + (getHandCardOrderValue hand True)
  where handNoJ = filter(/='J') hand
        hand = head (words line)

comapreBy :: (a -> Int) -> a -> a -> Ordering
comapreBy getValue one two | getValue(one) < getValue(two) = LT
                           | otherwise = GT

main :: IO ()
main = do
    fileHandle <- openFile "input" ReadMode
    contents <- hGetContents fileHandle
    let lns = lines contents
    let sorted = sortBy(comapreBy(getHandValue)) lns
    let partOneSolution = foldl (\x y -> ([x!!0 + x!!1 * read (last(words y)), x!!1 + 1])) [0, 1] sorted
    print (partOneSolution!!0)
    let sorted = sortBy(comapreBy(getHandValuePartTwo)) lns
    let partTwoSolution = foldl (\x y -> ([x!!0 + x!!1 * read (last(words y)), x!!1 + 1])) [0, 1] sorted
    print (partTwoSolution!!0)
    hClose fileHandle
