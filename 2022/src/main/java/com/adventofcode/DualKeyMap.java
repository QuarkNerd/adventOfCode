package com.adventofcode;

import java.util.HashMap;
import java.util.Map;

class DualKeyMap<K, V> {
    private Map<K, Map<K, V>> inner;

    DualKeyMap() {
        inner = new HashMap<>();
    }

    public void put(K keyOne, K keyTwo, V value) {
        inner.putIfAbsent(keyOne, new HashMap<>());
        inner.get(keyOne).put(keyTwo, value);
        inner.putIfAbsent(keyTwo, new HashMap<>());
        inner.get(keyTwo).put(keyOne, value);
    }

    public V get(K keyOne, K keyTwo) {
        return inner.get(keyOne).get(keyTwo);
    }
}