function gameOfLifeInTable() {
    var colour_alive,
        colour_dead,
	colour_init,
        spacing = 0,
        cellcount_x,
        cellcount_y,
        universe_type,
        automaton,
        cells,
        neighbour_count = {},
        new_live = [],
        new_die = [],
        may_live = [],
        may_die = [];


    // el cheapo hash table; keys will be JS arrays.
    function neighbour_count_get(key) {
        var k = key.toString();
        if (neighbour_count.hasOwnProperty(k)) {
            return neighbour_count[k];
        }
        return 0;
    }

    function neighbour_count_put(key, val) {
        var k = key.toString();
        neighbour_count[k] = val;
        return val;
    }

    function init(params) {
        cellcount_x = params.cellcount_x;
        cellcount_y = params.cellcount_y;

        colour_alive = params.colour_alive;
        colour_dead = params.colour_dead;
	colour_init = params.colour_init;

        tbd = params.tbody;

        universe_type = params.topology;
        automaton = params.automaton;

        create_structures();
        paint_initial_state(automaton);

	return clocktick;
    }

    function create_structures() {
        var i, j;
        cells = new Array(cellcount_x);
        for (i = 0; i < cellcount_x; i++) {
            cells[i] = new Array(cellcount_y);
            for (j = 0; j < cellcount_y; j++) {
                cells[i][j] = {
                    state: 0
                };
            }
        }

        if (console && console.log) {
            console.log("x*y->" + cellcount_x + "*" + cellcount_y + "=" + cellcount_x * cellcount_y);
        }

        for (i = 0; i < cellcount_y; i++) {
            var tr = document.createElement("tr");
            tr.id = "y" + i;
            for (j = 0; j < cellcount_x; j++) {
                var td = document.createElement("td");
                td.id = "x" + j + "y" + i;
                td.style.backgroundColor = colour_init;
                // td.appendChild(document.createTextNode(" "));
                tr.appendChild(td);
            }
            tbd.appendChild(tr);
        }
    }

    function isdead(cell) {
        return cells[cell[0]][cell[1]].state === 0;
    }

    function islive(cell) {
        return cells[cell[0]][cell[1]].state === 1;
    }

    function setdead(cell) {
        cells[cell[0]][cell[1]].state = 0;
        document.getElementById("x" + cell[0] + "y" + cell[1]).style.backgroundColor = colour_dead;
    }

    function setlive(cell) {
        cells[cell[0]][cell[1]].state = 1;
        document.getElementById("x" + cell[0] + "y" + cell[1]).style.backgroundColor = colour_alive;
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


    var __mem_existant_neighbours = {};
    function existant_neighbours(cell) {
        var cell_str = cell.toString();

        if (!__mem_existant_neighbours.hasOwnProperty(cell_str)) {
            var all = neighbours(cell[0], cell[1]);

            var ret = [];
            all.forEach(function (c) {
                if (c[0] >= 0 && c[0] < cellcount_x && c[1] >= 0 && c[1] < cellcount_y) {
                    ret.push(c);
                }
            });

            __mem_existant_neighbours[ cell_str ] = ret;
        }

        return __mem_existant_neighbours[ cell_str ];
    }

    function glider() {
        return [
            [2, 1],
            [3, 2],
            [1, 3], [2, 3], [3, 3]
        ];
    }

    function gosper_gun() {
        return [
            [25, 1],
            [23, 2], [25, 2],
            [13, 3], [14, 3], [21, 3], [22, 3], [35, 3], [36, 3],
            [12, 4], [16, 4], [21, 4], [22, 4], [35, 4], [36, 4],
            [1, 5], [2, 5], [11, 5], [17, 5], [21, 5], [22, 5],
            [1, 6], [2, 6], [11, 6], [15, 6], [17, 6], [18, 6], [23, 6], [25, 6],
            [11, 7], [17, 7], [25, 7],
            [12, 8], [16, 8],
            [13, 9], [14, 9]
        ];
    }

    function paint_initial_state(live_cells) {
        live_cells.forEach(function (cell) {
            setlive(cell);
            new_live.push(cell);
            inc_count_neigh(cell);
        });

        new_live.forEach(function (c) {
            may_die.push(c);
        });
        new_live = [];
    }


    function vivify(c) {
        if (isdead(c) && (neighbour_count_get(c) === 3)) {
            setlive(c);
            new_live.push(c);
        }
    }

    function kill(c) {
        var neigh_cn = neighbour_count_get(c);
        if (islive(c) &&
            (neigh_cn < 2 || neigh_cn > 3)) {
            setdead(c);
            new_die.push(c);
        }
    }

    function inc_count_neigh(c) {
        existant_neighbours(c).forEach(function (n) {
            var val = neighbour_count_get(n) + 1;
            neighbour_count_put(n, val);
            if (val === 3 && isdead(n)) may_live.push(n);
            else if (val === 4 && islive(n)) may_die.push(n);
        });
    }

    function dec_count_neigh(c) {
        existant_neighbours(c).forEach(function (n) {
            var val = neighbour_count_get(n) - 1;
            neighbour_count_put(n, val);
            if (val === 3 && isdead(n)) may_live.push(n);
            else if (val === 1 && islive(n)) may_die.push(n);
        });
    }

    function clocktick() {
        may_live.forEach(function (cell) { vivify(cell); });
        may_die.forEach( function (cell) { kill(cell);   });
        may_live = [];
        may_die = [];
        new_live.forEach(function (cell) { inc_count_neigh(cell); });
        new_die.forEach( function (cell) { dec_count_neigh(cell); });
        new_live = [];
        new_die = [];
    }

    return {
        "init": init,
        "automatons": {
            "glider": glider,
            "gosper_gun": gosper_gun
        },
        "topologies": {
            "closed": closed,
            "unbounded": unbounded
        }
    };
}