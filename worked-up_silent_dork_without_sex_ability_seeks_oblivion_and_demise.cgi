#! /usr/bin/perl

use strict;
use warnings;
use Time::Local;
use POSIX qw(tzset mktime);

$ENV{TZ} = 'Europe/Oslo';

my $now = time(); # this is independent of the timezone.

# 15:39
my $t_gmt = timegm(
        42, # seconds
        39, # minutes
        15, # hour
        19, # day of month
        10 - 1, # month
        2012); #year

# In 2012 daylight saving time ended on 28-Oct
# http://www.timeanddate.com/worldclock/timezone.html?n=187&syear=2010

# leap seconds?
my $diff_gmt = ($now - $t_gmt) / 86400;

my $t_local = mktime(
	42,
	39,
	15,
	19,
	10 - 1,
	2012 - 1900,
	0, 0, 1);

my $diff_local = ($now - $t_local) / 86400;

if (defined($ENV{GATEWAY_INTERFACE})) {
	print("Content-Type: text/plain; charset=utf-8\n");
	print("Cache-Control: max-age=300\n");
	print("Access-Control-Allow-Origin: *\n\n");
}

print('local=', $diff_local, "\n");
print('  gmt=', $diff_gmt, "\n");
