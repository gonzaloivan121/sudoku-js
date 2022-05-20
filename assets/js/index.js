class DIFFICULTY {
    static Easy = 1;
    static Medium = 2;
    static Hard = 3;
    static Hell = 4;
    static Impossible = 5;
};

var initialized = false;
var difficulty_container = document.getElementById("difficulty");

var lifes = 3;
var game_over = false;

const begins_x = [1, 10, 19, 28, 37, 46, 55, 64, 73];
const ends_x = [9, 18, 27, 36, 45, 54, 63, 72, 81];
const begins_y = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const ends_y = [73, 74, 75, 76, 77, 78, 79, 80, 81];

var result_arr = [];
var starting_cells = [];

initialize();

function initialize() {
    if (!initialized) {
        initialize_difficulty();
        initialize_lifes();

        for (var i = 1; i <= TOTAL_CELLS; i++) {
            var cell = document.getElementById(i);
            set_focus_on_cell(cell);
            set_focusout_on_cell(cell);
            set_input_on_cell(cell);
        }

        generate_board();

        initialized = true;
    }
}

function initialize_lifes() {
    update_lifes();
}

function update_lifes() {
    document.getElementById("lifes").innerText = lifes;
}

function reset_lifes() {
    lifes = 3;
    update_lifes();
}

function loose_a_life() {
    if (!game_over) {
        lifes--;
        update_lifes();
    
        if (lifes == 0) {
            set_game_over();
        }
    }
}

function set_game_over() {
    game_over = true;
    for (var i = 1; i <= TOTAL_CELLS; i++) {
        var cell = document.getElementById(i);
        cell.disabled = true;
        cell.style.background = "#952828";
        cell.style.color = "white";
    }
}

function initialize_difficulty() {
    for (const property in DIFFICULTY) {
        var difficulty_option = document.createElement("option");
        difficulty_option.value = DIFFICULTY[property];
        difficulty_option.innerHTML = property;
        difficulty_container.appendChild(difficulty_option);
    }
}

function set_focus_on_cell(cell) {
    cell.addEventListener("focus", (e) => {
        if (e.target.style.color !== "white") {
            e.target.style.color = "white";
        }
        focus_cell(parseInt(e.target.id));
    });
}

function set_focusout_on_cell(cell) {
    cell.addEventListener("focusout", () => {
        focusout_cells();
    });
}

function set_input_on_cell(cell) {
    cell.addEventListener("input", (e) => {
        if (isNaN(e.target.value)) {
            e.target.value = "";
        } else {
            if (e.target.value < 1 || e.target.value > 9) {
                e.target.value = "";
            } else {
                check_correct(e.target);
            }
        }
    });
}

function focusout_cells() {
    for (var i = 1; i <= TOTAL_CELLS; i++) {
        var cell = document.getElementById(i);
        cell.classList.remove("highlighted");
    }
}

function focus_cell(id) {
    var x = id % 9;
    if (x === 0) x = 9;
    var y = 0;
    for (var i = id; i > 0; i-=9) {
        y++;
    }
    
    var begin_x = begins_x[y - 1];
    var end_x = ends_x[y - 1];

    var begin_y = begins_y[x - 1];
    var end_y = ends_y[x - 1];

    for (var i = begin_x; i <= end_x; i++) {
        var cell = document.getElementById(i);
        cell.classList.add("highlighted");
    }

    for (var i = begin_y; i <= end_y; i+=9) {
        var cell = document.getElementById(i);
        cell.classList.add("highlighted");
    }
}

function check_correct(cell) {
    if (cell.value != result_arr[cell.id - 1]) {
        cell.style.color = "#952828";
        loose_a_life();
    } else {
        cell.style.color = "white";
    }
}

function clear_cell(cell) {
    cell.value = "";
    cell.style.color = "white";
    cell.style.background = "transparent";
    cell.disabled = false;
}

function restart_cell(cell, starting_cell) {
    cell.value = starting_cell.value;
    cell.style.color = starting_cell.color;
    cell.style.background = starting_cell.background;
    cell.disabled = starting_cell.disabled;
}

function restart_board(clear = false) {
    reset_lifes();

    for (var i = 1; i <= TOTAL_CELLS; i++) {
        var cell = document.getElementById(i);
        if (clear) {
            clear_cell(cell);
            clear_starting_cells();
        } else {
            if (starting_cells.length !== 0) {
                var starting_cell = starting_cells[i - 1];
                restart_cell(cell, starting_cell);
            }
        }
    }

    game_over = false;
}

function clear_starting_cells() {
    starting_cells = [];
}

function generate_board() {
    restart_board(true);
    clear_starting_cells();

    var difficulty = parseInt(difficulty_container.value);
    var iterations = 0;

    switch (difficulty) {
        case DIFFICULTY.Easy:
            iterations = random(60, 70);
            break;
        case DIFFICULTY.Medium:
            iterations = random(40, 50);
            break;
        case DIFFICULTY.Hard:
            iterations = random(15, 30);
            break;
        case DIFFICULTY.Hell:
            iterations = random(5, 10);
            break;
        case DIFFICULTY.Impossible:
            iterations = random(3, 5);
            break;
    }

    for (var i = 0; i < iterations; i++) {
        var random_cell = random(1, TOTAL_CELLS);
        var random_number = random(1, 9);
        generate_cell(random_cell, random_number);
    }

    var grid = read_a_puzzle();

    if (!search(grid)) {
        generate_board();
    } else {
        result_arr = return_ans();
        generate_starting_cells();
    }
}

function generate_starting_cells() {
    for (let i = 1; i <= TOTAL_CELLS; i++) {
        var cell = document.getElementById(i);
        starting_cells.push({
            value: cell.value,
            color: cell.style.color,
            background: cell.style.background,
            disabled: cell.disabled
        });
    }
}

function generate_cell(random_cell, random_number) {
    var cell = document.getElementById(random_cell);
    cell.value = random_number;

    var grid = read_a_puzzle();
    if (!is_valid_grid(grid)) {
        cell.value = "";
        cell.disabled = false;
    } else {
        cell.disabled = true;
        cell.style.color = "darkgrey";
    }
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function check_board() {
    var grid = read_a_puzzle();
    var valid_cells = get_valid_cells(grid);

    for (var i = 1; i <= valid_cells.length; i++) {
        var cell = document.getElementById(i);

        if (valid_cells[i-1] && !cell.disabled && cell.value !== "") {
            cell.style.color = "#44c944";
        }

        if (!valid_cells[i-1] && !cell.disabled && cell.value !== "") {
            cell.style.color = "#952828";
        }
    }
}