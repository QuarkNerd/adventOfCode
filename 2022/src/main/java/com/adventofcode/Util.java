package com.adventofcode;

import com.google.common.io.Resources;

import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.List;
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
}
