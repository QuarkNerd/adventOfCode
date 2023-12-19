// dmd solution.d

import std.stdio;
import std.file;
import std.regex;
import std.array;
import std.conv;
import std.uni : isWhite;
import std.range;
import std.typecons;
import std.algorithm.comparison;
import std.algorithm.iteration;
import std.meta;

auto numberCtr = ctRegex!(`\d+`);
auto nameCtr = ctRegex!(`[a-z]+`);
auto ruleCtr = ctRegex!(`\{(.+)\}`);

struct Range {
   long start;
   long end;
   bool isValid()
   {
      return end >= start;
   }
}

alias PartRange = Range[char];

long[char] parseStringToPart(string line) {
   string[] split = line.split(",");
   long[char] p;
   p['x'] = to!long(matchFirst(split[0], numberCtr)[0]);
   p['m'] = to!long(matchFirst(split[1], numberCtr)[0]);
   p['a'] = to!long(matchFirst(split[2], numberCtr)[0]);
   p['s'] = to!long(matchFirst(split[3], numberCtr)[0]);
   return p;
}

string applyRule(long[char] part, string[] rules) {
   foreach (string rule; rules[0 .. $-1])
   {
      char ratingName = rule[0];
      long rating = part[ratingName];
      char comparator = rule[1];
      long limit =  to!long(matchFirst(rule, numberCtr)[0]);
      string next =  rule.split(":")[1];
      if ((comparator == '>' && rating > limit) ||
            (comparator == '<' && rating < limit))
            {
               return next;
            }
   }
   return rules[$-1];
}

Tuple!(string, PartRange)[] applyRuleToRange(PartRange partRange, string[] rules) {
   
   Tuple!(string, PartRange)[] result;
   foreach (string rule; rules[0 .. $-1])
   {
      char ratingName = rule[0];
      char comparator = rule[1];
      long limit =  to!long(matchFirst(rule, numberCtr)[0]);
      string next =  rule.split(":")[1];

      Range currentRatingRange = partRange[ratingName];
      Range followRuleRatingRange;
      Range remainingRuleRatingRange;
      if (comparator == '>')
      {
         followRuleRatingRange = Range(
            max(limit + 1, currentRatingRange.start), 
            currentRatingRange.end
         );
         remainingRuleRatingRange = Range(
            currentRatingRange.start, 
            min(limit, currentRatingRange.end)
         );
      } else {
         followRuleRatingRange = Range(
            currentRatingRange.start,
            min(limit - 1, currentRatingRange.end)
         );
         remainingRuleRatingRange = Range(
            max(limit, currentRatingRange.start),
            currentRatingRange.end
         );
      }

      if (followRuleRatingRange.isValid()) {
         PartRange followRulePartRange = partRange.dup;
         followRulePartRange[ratingName] = followRuleRatingRange;
         result ~= tuple(next, followRulePartRange);
      }
      if (!remainingRuleRatingRange.isValid()) {
         return result;
      }
      partRange[ratingName] = remainingRuleRatingRange;
   }
   result ~= tuple(rules[$-1], partRange);
   return result;
}

long solvePartOne(string[][string] workflows, string partsString) {
   long total = 0;
   foreach (string partString; partsString.split("\r\n"))
   {
      string ruleName = "in";
      long[char] part = parseStringToPart(partString);

      while (ruleName != "A" && ruleName != "R")
      {
         ruleName = applyRule(part, workflows[ruleName]);
      }
      if (ruleName == "A") {
         total += part['x'] + part['m'] + part['a'] + part['s'];
      }
   }
   return total;
}

long calculateValidCombinations(string[][string] workflows, PartRange range, string ruleName) {
   if (ruleName == "R") {
      return 0;
   }
   if (ruleName == "A") {
      return range.values.fold!((a, b) => a * (b.end - b.start + 1))(to!long(1));
   }
   Tuple!(string, PartRange)[] processed = applyRuleToRange(range, workflows[ruleName]);

   long total = 0;
   foreach (x; processed) 
   {
      total += calculateValidCombinations(workflows, x[1], x[0]);
   }

   return total;
}

long solvePartTwo(string[][string] workflows) {
   long total = 0;
   PartRange start;
   start['x'] = Range(1, 4000);
   start['m'] = Range(1, 4000);
   start['a'] = Range(1, 4000);
   start['s'] = Range(1, 4000);

   return calculateValidCombinations(workflows, start, "in");
}

void main(string[] args) {
   string[] input = readText("input").split("\r\n\r\n");

   long total = 0;
   string[][string] workflows;
   foreach (string n; input[0].split("\r\n"))
   {
      string name = matchFirst(n, nameCtr)[0];
      string[] rule = matchFirst(n, ruleCtr)[1].split(",");
      workflows[name] = rule;
   }
   writeln(solvePartOne(workflows, input[1])); 
   writeln(solvePartTwo(workflows));
}