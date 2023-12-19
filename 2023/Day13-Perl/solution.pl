use File::Slurp;
use feature qw(say);

sub IsReflectedAroundYEqualTo {
    @world = @{$_[0]};
    $y = $_[1];
    $worldLength = scalar(@world);
    $countToCompare = $worldLength - $y < $y ? $worldLength - $y : $y;
    $smudgeCount = 0;
    for( $j = 0; $j < $countToCompare; $j += 1 ) {
        $cross = $world[$y - 1 - $j] & $world[$y + $j];
        $smudgeCount += $cross =~ tr/"//;
    }

    return $smudgeCount == 1 ? 1 : 0; # Part Two
    # return $smudgeCount == 0 ? 1 : 0; # Part One
}

sub FindYReflecton {
    @world = @{$_[0]};

    for( $i = 1; $i < scalar(@world); $i += 1 ) {
        if (IsReflectedAroundYEqualTo(\@world, $i)) {
            return $i
        }
    }

    return -1;
}

sub TransposeWorld {
    my @world = @{$_[0]};
    my @tr;
    for my $row (0..@world-1) {
        for my $col (0..length(@world[$row])-1) {
            $tr[$col][$row] = substr($world[$row], $col, 1);
        }
    }
    return map {join("", @{$_})} @tr;
}


my $file_content = read_file('input');
my @worldArray = split('\n\n', $file_content);

my $total = 0;
foreach $world (@worldArray)
{
    my @parsed = split('\n', $world);
    my $yval = FindYReflecton(\@parsed);
    if ($yval != -1) {
        $total = $total + 100*$yval;
    } else {
        @xval = TransposeWorld(\@parsed);
        $total = $total + FindYReflecton(\@xval);
    }
}
say $total;
