package com.adventofcode;

import com.google.common.io.Resources;

import java.lang.reflect.Constructor;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.List;
import java.util.NavigableMap;
import java.util.SortedMap;
import java.util.function.ToIntFunction;
import java.util.stream.Collectors;

public class Util {
    static public String getInput(String fileName) {
        URL url = Resources.getResource(fileName);
        String input;
        try {
            input = Resources.toString(url, StandardCharsets.UTF_8);
        } catch (Exception e) {
            throw new RuntimeException();
        }
        return input;
    }

    static public List<String> split(String input, String deliminator) {
        return Arrays.stream(input.split(deliminator)).collect(Collectors.toList());
    }

    static public <E> Integer mapSum(List<E> lines, ToIntFunction<E> mapper) {
        return lines.stream()
                .mapToInt(mapper)
                .reduce(0, Integer::sum);
    }

    public static boolean doDuplicatesExist(CharSequence checkString)
    {
        return checkString.length() != checkString.chars().distinct().count();
    }

    public static Integer safeParseInteger(String strNum) {
        if (strNum == null) {
            return null;
        }

        Integer d;
        try {
            d = Integer.valueOf(strNum);
        } catch (NumberFormatException nfe) {
            return null;
        }
        return d;
    }

    // wow very type much safe code
    static public <E> List<E> cloneRecursively(List<E> list) {
        try {
            Class<?> clazz = list.getClass();
            Constructor<?> ctor = clazz.getConstructor();
            List newList = (List) ctor.newInstance(new Object[]{});


            Object a = list.get(0);

            if (a instanceof List) {
                List m = list.stream().map(x -> cloneRecursively((List)x)).collect(Collectors.toList());
                newList.addAll(m);
                return newList;
            }

            newList.addAll(list);
            return newList;
        } catch (Exception e) {
            throw new RuntimeException("The super safe method failed");
        }
    }

    static public <E> SortedMap<String, E> getByPrefix(
            NavigableMap<String, E> myMap,
            String prefix ) {
        return myMap.subMap( prefix, prefix + Character.MAX_VALUE );
    }
}
