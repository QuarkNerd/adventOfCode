// go run solution.go //"throw errors" // new lines instructs declares? // nil value of stuct
package main

import (
   "fmt"
   "io/ioutil"
   "strings"
   "strconv"
)

type hotSpringRecord struct {
   record string
   schema string
}

// (expected) 0 = expecting next to be .     -1, = anything goes, "> 0" = expecting that many #
type state struct {
   expected int
   remainingBrokenSprings string
}

func main() {
   fileContent, _ := ioutil.ReadFile("input")
   text := string(fileContent)
   lines := strings.Split(text,"\r\n")

   sum := 0
   for _, s := range lines {
      parsed := parse(s)
	   sum = sum + solve_for_hotSpringRecord(parsed)
   }
   fmt.Println(sum)
}

func parse(x string) hotSpringRecord {
   split := strings.Fields(x)
   record := split[0]
   schema := split[1]
   // part two only
   record = strings.Repeat(record + "?", 4) + record
   schema = strings.Repeat(schema + ",", 4) + schema
   // part two only (above)
   return hotSpringRecord{record: record, schema: schema}
}

func solve_for_hotSpringRecord(x hotSpringRecord) int {
   states := map[state]int{
      {expected: -1, remainingBrokenSprings: x.schema}: 1,
   }

   for i := 0; i < len(x.record); i++ {
      nextStates := make(map[state]int)

      for st, count := range states {
         switch x.record[i] {
            case '#': 
               success, new := process_broken(st)
               if (success) {
                  nextStates[new] = nextStates[new] + count
               }
            case '.':
               success, new := process_working(st)
               if (success) {
                  nextStates[new] = nextStates[new] + count
               }
            case '?':
               success, new := process_broken(st)
               if (success) {
                  nextStates[new] = nextStates[new] + count
               }
               success, new = process_working(st)
               if (success) {
                  nextStates[new] = nextStates[new] + count
               }
            default:
               fmt.Println("Wrong")
         }
      }

      states = nextStates
	}

   total := 0
   for st, count := range states {
      if (len(st.remainingBrokenSprings) == 0 && st.expected < 1) {
         total = total + count
      }
   }
   return total
}

func process_working(st state) (bool, state) {
   if (st.expected > 0) { return false, st }
   if (st.expected == 0) {
      st.expected = -1
      return true, st
   }
   return true, st
}

func process_broken(st state) (bool, state) {
   if (st.expected == 0) { return false, st }
   if (st.expected > 0) {
      st.expected -= 1
      return true, st
   }
   if (len(st.remainingBrokenSprings) == 0) { return false, st }
   remSlice := toIntArray(strings.Split(st.remainingBrokenSprings,","))
   nextBrokenLength := remSlice[0]
   remainingBrokenSprings := remSlice[1:]
   return true, state{expected: nextBrokenLength - 1, remainingBrokenSprings: toString(remainingBrokenSprings)}
}

func toIntArray(inp []string) []int {
    var result []int

    for _, str := range inp {
        num, _ := strconv.Atoi(str)
        result = append(result, num)
    }

    return result
}

func toString(inp []int) string {
    strArr := make([]string, len(inp))
    for i, num := range inp {
        strArr[i] = strconv.Itoa(num)
    }
    return strings.Join(strArr, ",")
}

func sum(numbers []int) int {
    sum := 0
    for _, num := range numbers {
        sum += num
    }
    return sum
}
