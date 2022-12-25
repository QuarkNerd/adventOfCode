package com.adventofcode;

import org.json.JSONArray;

import java.util.Arrays;

public class Day_13 extends SolverBase {
    public static void main(String[] args) { (new Day_13()).run(); }

    public SolutionPair solve(String input) {
        IPacket[][] packetPair = Arrays.stream(input.trim().split(System.lineSeparator() + System.lineSeparator())).map(
                pair -> {
                    String[] spl =  pair.split(System.lineSeparator());
                    return new IPacket[] { IPacket.parse(spl[0]), IPacket.parse(spl[1]) };
                }).toArray(IPacket[][]::new);

        IPacket decoderOne = IPacket.parse("[[2]]");
        IPacket decoderTwo = IPacket.parse("[[6]]");

        int partOne = 0;
        int lessThanDecoderOne = 0;
        int lessThanDecoderTwo = 0;
        for (int i = 0; i < packetPair.length; i++) {
            IPacket[] q = packetPair[i];
            if (q[0].compareTo(q[1]) == -1) {
                partOne+=i+1;
            }
            if (q[0].compareTo(decoderOne) == -1) {
                lessThanDecoderOne++;
            }
            if (q[1].compareTo(decoderOne) == -1) {
                lessThanDecoderOne++;
            }
            if (q[0].compareTo(decoderTwo) == -1) {
                lessThanDecoderTwo++;
            }
            if (q[1].compareTo(decoderTwo) == -1) {
                lessThanDecoderTwo++;
            }

        }
        return new SolutionPair(partOne,(lessThanDecoderTwo+2)*(lessThanDecoderOne+1));
    }

    static abstract class IPacket implements Comparable<IPacket> {

        public static IPacket parse(String inp) {
            JSONArray jsonarray = new JSONArray(inp);
            return IPacket.parse(jsonarray);
        }

        public static IPacket parse(JSONArray jsonArray) {
            IPacket[] value = new IPacket[jsonArray.length()];

            for (int i = 0; i < value.length; i++) {
                JSONArray array = jsonArray.optJSONArray(i);
                if (array != null) {
                    value[i] = IPacket.parse(array);
                } else {
                    value[i] = new PacketNum(jsonArray.getInt(i));
                }
            }

            return new Packet(value);
        }

        @Override
        public int compareTo(IPacket o2) {
            IPacket o1 = this;
            boolean isO1Numeric = o1 instanceof PacketNum;
            boolean isO2Numeric = o2 instanceof PacketNum;

            if (isO1Numeric && isO2Numeric) {
                return ((PacketNum) o1).value.compareTo(((PacketNum) o2).value);
            }
            if (!isO1Numeric && !isO2Numeric) {
                IPacket[] one = ((Packet) o1).value;
                IPacket[] two = ((Packet) o2).value;

                for (int i = 0; i < (one.length < two.length ? one.length : two.length); i++) {
                    int result = one[i].compareTo(two[i]);
                    if (result != 0) return result;
                }
                return Integer.compare(one.length, two.length);
            }

            if (isO1Numeric) {
                return (new Packet(new IPacket[] {o1})).compareTo(o2);
            }

            if (isO2Numeric) {
                return o1.compareTo(new Packet(new IPacket[] {o2}));
            }

            throw new RuntimeException("Unreachable");
        }
    }

    static class Packet extends IPacket {
        public final IPacket[] value;

        Packet(IPacket[] value) {
            this.value = value;
        }
    }

    static class PacketNum extends IPacket {
        public final Integer value;

        PacketNum(Integer value) {
            this.value = value;
        }

    }
}
