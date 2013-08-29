var cellsz = 10, // width == height
    spacing = 0,
    cellcount_x,
    cellcount_y,
    universe_type,
    curstate,
    nextstate;

function create_structures() {
    var i, j;
    cellcount_x = Math.floor(210 / (cellsz + spacing));
    cellcount_y = Math.floor(80 / (cellsz + spacing));
    curstate = new Array(cellcount_x);
    nextstate = new Array(cellcount_x);
    for (i = 0; i < cellcount_x; i++) {
        curstate[i] = new Array(cellcount_y);
        nextstate[i] = new Array(cellcount_y);
        for (j = 0; j < cellcount_y; j++) {
            curstate[i][j] = 0;
            nextstate[i][j] = 0;
        }
    }
}

// set an unbounded topology - no wrapping around.
function unbounded(x, y) {
    return [ x, y ];
}

// bounded topology - not possible to fall off the edge of the universe.
function closed(x, y) {
    var _x, _y;
    if (x >= 0 && x < cellcount_x) {
        _x =x;
    } else if (x < 0) {
        _x = x + cellcount_x;
    } else if (x >= cellcount_x) {
        _x = cellcount_x - x;
    }

    if (y >= 0 && y < cellcount_y) {
        _y = y;
    } else if (y < 0) {
        _y = y + cellcount_y;
    } else if (y >= cellcount_y) {
        _y = cellcount_y - y;
    }

    // console.log(x + ", " + y + " -> " + _x + ", " + _y);
    return [ _x, _y ];
}

// return "realized" coordinates of a cell's neighbours.
// the choice of local variable f sets the type of the world.
function neighbours(x, y) {
    var f = universe_type;
    return [ f(x - 1, y - 1), f(x, y - 1), f(x + 1, y - 1),
             f(x - 1, y),                  f(x + 1, y),
             f(x - 1, y + 1), f(x, y + 1), f(x + 1, y + 1) ];
}


// helper - to return "dead" in case of out-of-bounds coordinates.
// if we're working with a closed world, x and y should always
// be valid coordinates.
function neighbour_value(x, y) {
    if (x < 0 || x >= cellcount_x || y < 0 || y >= cellcount_y) {
        return 0; // non-existent cell == dead
    }

    return curstate[x][y];
}

// decide if cell at (x, y) should die, be born, or stay unchanged.
function decide(x, y) {
    var n = neighbours(x, y),
	nl = n.length,
	living_neighbours = 0,
	i = 0;

    for ( ; i < nl; i++) {
        living_neighbours += neighbour_value(n[i][0], n[i][1]);
    }

    if (living_neighbours < 2 || living_neighbours > 3) {
        return 0; // die
    }
    if (curstate[x][y] === 0 && living_neighbours === 3) {
        return 1; // neighbours reproduced.
    }
    return curstate[x][y];
}

function clocktick() {
    var i, j, new_state, cell, tmp, touched = 0,
	on = [],
	off = [];

    for (i = 0; i < cellcount_x; i++) {
        for (j = 0; j < cellcount_y; j++) {
            // change fill colour only on cells that change.
            if (curstate[i][j] === 1 && nextstate[i][j] === 0) {
		on.push([ i, j ]);
                touched++;
            } else if (curstate[i][j] === 0 && nextstate[i][j] === 1) {
		off.push([ i, j ]);
                touched++;
            }
            nextstate[i][j] = decide(i, j);
        }
        // console.log("touched " + touched + " cells.");
    }

    _tmp = curstate;
    curstate = nextstate;
    nextstate = _tmp;

    // console.log(on.join(', ') + "\t" + off.join(', '));
    return [ on, off ];
}


// single glider - good with a closed universe.
function single_glider(c) {
var x_off = 1, y_off = 1;
    c[1 + x_off ][0 + y_off] = 1;
    c[2 + x_off ][1 + y_off] = 1;
    c[0 + x_off ][2 + y_off] = 1;
    c[1 + x_off ][2 + y_off] = 1;
    c[2 + x_off ][2 + y_off] = 1;
}

// gosper's gun - should be used with an unbounded universe.
// otherwise, returning gliders can destroy the gun.
function gosper_gun(c) {
    c[25][1] = 1;
    c[23][2] = c[25][2] = 1;
    c[13][3] = c[14][3] = c[21][3] = c[22][3] = c[35][3] = c[36][3] = 1;
    c[12][4] = c[16][4] = c[21][4] = c[22][4] = c[35][4] = c[36][4] = 1;
    c[1][5] = c[2][5] = c[11][5] = c[17][5] = c[21][5] = c[22][5] = 1;
    c[1][6] = c[2][6] = c[11][6] = c[15][6] = c[17][6] = c[18][6] = c[23][6] = c[25][6] = 1;
    c[11][7] = c[17][7] = c[25][7] = 1;
    c[12][8] = c[16][8] = 1;
    c[13][9] = c[14][9] = 1;
}

function paint_initial_state() {
    // paint the initial state completely.
    for (i = 0; i < cellcount_x; i++) {
        for (j = 0; j < cellcount_y; j++) {
            if (curstate[i][j] === 1) {
            } else {
            }
        }
    }
}

// main
create_structures();
// gosper_gun(curstate);
single_glider(curstate);
paint_initial_state();
universe_type = closed;

var tab = [];
for (var i = 0; i < 673; i++) {
    tab.push(clocktick());
}

console.log("var glider_state = " + JSON.stringify(tab) + ";\n");

