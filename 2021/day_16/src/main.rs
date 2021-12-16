fn main() {
    let input: String = include_str!("input").split("").filter(|x| !x.is_empty()).map(|digit| {
        let dec = u8::from_str_radix(digit, 16).unwrap();
        let bin = format!("{:b}", dec);
        format!("{:0>4}", bin)
    }).collect();
    let packet = parse_next_packet(input).0;

    println!("Part one: {}", packet.get_sum_version_num());
    println!("Part two: {}", packet.get_value());
}

fn parse_next_packet(inp: String) -> (Box<dyn Packet>, String) {
    let header: Header = inp.parse().unwrap();
    
    if header.type_id == 4 {
        let (value, remaining) = parse_literal(inp[6..].to_owned());
        let packet = LiteralPacket {
            header,
            value
        };
        
        return (Box::new(packet), remaining);
    }

    let remaining_string: String;
    let inner_packets;
    match &inp[6..7] {
        "0" => {
            let inner_packet_bits_len = usize::from_str_radix(&inp[7..22], 2).unwrap();
            inner_packets = parse_all_packets(inp[22..(22+inner_packet_bits_len)].to_owned());
            remaining_string = inp[(22+inner_packet_bits_len)..].to_owned();
        },
        "1" => {
            let inner_packet_len = usize::from_str_radix(&inp[7..18], 2).unwrap();
            let (packets, new_remaing_string) = parse_n_packets(inp[18..].to_owned(), inner_packet_len);
            inner_packets = packets;
            remaining_string = new_remaing_string;
        }
        _ => panic!("Invalid bit")
    };

    let inner_packets = inner_packets.into_iter().collect();

    let operation = match header.type_id  {
        0 => Operation::Sum,
        1 => Operation::Product,
        2 => Operation::Min,
        3 => Operation::Max,
        5 => Operation::GreaterThan,
        6 => Operation::LessThan,
        7 => Operation::EqualTo,
        _ => panic!("Invalid type_id")
    };

    let packet = OperationalPacket {
        header,
        operation,
        inner: inner_packets
    };

    (Box::new(packet), remaining_string)
}

fn parse_all_packets(bit_string: String) -> Vec<Box<dyn Packet>> {
    let mut packets = vec!();
    let mut remaining_string = bit_string;

    while remaining_string.len() != 0 {
        let (p, new_remaing_string) = parse_next_packet(remaining_string);
        remaining_string = new_remaing_string;
        packets.push(p);
    };
    
    packets
}

fn parse_n_packets(bit_string: String, n: usize) -> (Vec<Box<dyn Packet>>, String) {
    let mut packets = vec!();
    let mut remaining_string = bit_string;

    for _ in 0..n {
        let (packet, new_remaing_string) = parse_next_packet(remaining_string);
        remaining_string = new_remaing_string;
        packets.push(packet);
    };
    
    (packets, remaining_string)
}

fn parse_literal(bit_string: String) -> (usize, String) {
    let index = bit_string.chars().step_by(5).enumerate().find(|(_, ch)| ch == &'0').unwrap().0*5 + 5;
    let number: String = bit_string[0..index].chars().enumerate().filter(|(i, _)| i%5 != 0).map(|(_, ch)| ch).collect();

    (usize::from_str_radix(&number, 2).unwrap(), bit_string[index..].to_owned())
}

trait Packet {
    fn get_value(&self) -> usize;
    fn get_sum_version_num(&self) -> usize;
}

struct LiteralPacket {
    header: Header,
    value: usize
}

impl Packet for LiteralPacket {
    fn get_value(&self) -> usize {
        self.value
    }

    fn get_sum_version_num(&self) -> usize {
        self.header.version as usize
    }
}

struct OperationalPacket {
    header: Header,
    operation: Operation,
    inner: Vec<Box<dyn Packet>>
}

impl Packet for OperationalPacket {
    fn get_value(&self) -> usize {
        use Operation::*;
        match self.operation {
            Sum => self.inner.iter().map(|x| x.get_value()).sum(),
            Product => self.inner.iter().map(|x| x.get_value()).product(),
            Min => self.inner.iter().map(|x| x.get_value()).min().unwrap(),
            Max => self.inner.iter().map(|x| x.get_value()).max().unwrap(),
            GreaterThan => if self.inner[0].get_value() > self.inner[1].get_value() { 1 } else { 0 },
            LessThan => if self.inner[0].get_value() < self.inner[1].get_value() { 1 } else { 0 },
            EqualTo => if self.inner[0].get_value() == self.inner[1].get_value() { 1 } else { 0 },
        }
    }

    fn get_sum_version_num(&self) -> usize {
        (self.header.version as usize) + self.inner.iter().map(|x| x.get_sum_version_num()).sum::<usize>()
    }
}

enum Operation {
    Sum,
    Product,
    Min,
    Max,
    GreaterThan,
    LessThan,
    EqualTo,
}

#[derive(Clone, Copy)]
struct Header {
    version: u8,
    type_id: u8
}

impl std::str::FromStr for Header {
    type Err = &'static str;
    
    fn from_str<'a>(s: &'a str) -> Result<Self, Self::Err> {
        let version = u8::from_str_radix(&s[0..3], 2).unwrap();
        let type_id = u8::from_str_radix(&s[3..6], 2).unwrap();
        Ok(
            Header {
                version,
                type_id
            }
        )
    }
}
