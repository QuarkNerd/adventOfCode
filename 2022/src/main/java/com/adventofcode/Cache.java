package com.adventofcode;

import java.util.HashMap;
import java.util.function.Function;

public class Cache<T, R> {
    private final Function<T, R> function;
    private final HashMap<T, R> cache;

    Cache(Function<T, R> function) {
        this.function = function;
        this.cache = new HashMap<T, R>();
    }

    public R get(T input) {
        this.cache.computeIfAbsent(input, function);
        return this.cache.get(input);
    }
}
