use strict;
use warnings;
use POSIX qw(tzset);

my $t1 = time();

$ENV{TZ} = 'Europe/Oslo';
tzset();
my $t2 = time();

print($t1, "\n");
print($t2, "\n");
