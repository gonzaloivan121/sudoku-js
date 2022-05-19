class DIFFICULTY {
    static Easy = 1;
    static Medium = 2;
    static Hard = 3;
    static Hell = 4;
    static Impossible = 5;

    static Get_Difficulty(d) {
        for (const difficulty in this) {
            if (this[difficulty] === d) return difficulty;
        }
    }
};

var initialized = false;
var difficulty_container = document.getElementById("difficulty");

var points = 0;

var begins_x = [1, 10, 19, 28, 37, 46, 55, 64, 73];
var ends_x = [9, 18, 27, 36, 45, 54, 63, 72, 81];
var begins_y = [1, 2, 3, 4, 5, 6, 7, 8, 9];
var ends_y = [73, 74, 75, 76, 77, 78, 79, 80, 81];

initialize();

function initialize() {
    if (!initialized) {
        for (const property in DIFFICULTY) {
            var difficulty_option = document.createElement("option");
            difficulty_option.value = DIFFICULTY[property];
            difficulty_option.innerHTML = property;
            difficulty_container.appendChild(difficulty_option);
        }

        for (var i = 1; i <= TOTAL_CELLS; i++) {
            var cell = document.getElementById(i);
            cell.addEventListener("focus", (ev) => {
                var c = ev.target;
                if (c.style.color !== "white") {
                    c.style.color = "white";
                }
                focus_cell(parseInt(c.id));
            });
            cell.addEventListener("focusout", () => {
                focusout_cells();
            });
        }

        initialized = true;
    }
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

function generate_board() {
    clear_board();

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
    }

    return { Difficulty: DIFFICULTY.Get_Difficulty(difficulty), Iterations: iterations };
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
