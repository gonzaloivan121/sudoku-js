const TOTAL_CELLS = 81;

function get_answer() {
    var bool = check_input();
    if (bool) {
        var grid = read_a_puzzle();
        if (!is_valid_grid(grid)) {
            alert("Invalid input, please try again!");
        } else {
            if (search(grid)) {
                output_ans();
            } else {
                alert("Found no solution!");
            }
        }
    }
}

function check_input() {
    var arr = new Array();

    for (var i = 1; i <= TOTAL_CELLS; i++) {
        arr[i] = Number(document.getElementById(i).value);
        if (isNaN(arr[i])) {
            alert('Input should be any number between 1 and 9 !');
            return false
        }
    }

    if (arr.every(function isZero(x) { return x == 0 })) {
        alert('There is no input!');
        return false
    }

    return true
}

function read_a_puzzle() {
    var arr = new Array();
    var grid = new Array();

    for (var i = 1; i <= TOTAL_CELLS; i++) {
        arr[i] = Number(document.getElementById(i).value);
    }

    for (var i = 0; i < 9; i++) {
        grid[i] = new Array();
        for (var j = 0; j < 9; j++) {
            grid[i][j] = 0;
        }
    }
    
    for (var i = 1; i <= TOTAL_CELLS; i++) {
        grid[Math.floor((i-1) / 9)][(i-1) % 9] = arr[i];
    }

    return grid;
}

function is_valid_grid(grid) {
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            if ((grid[i][j] < 0) || (grid[i][j] > 9) || ((grid[i][j] != 0) && (!is_valid(i, j, grid)))) {
                return false;
            }
        }
    }
    return true;
}

function get_valid_cells(grid) {
    var cell_array = new Array();

    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            if ((grid[i][j] < 0) || (grid[i][j] > 9) || ((grid[i][j] != 0) && (!is_valid(i, j, grid)))) {
                cell_array.push(false);
            } else {
                cell_array.push(true);
            }
        }
    }
    return cell_array;
}

//Check whether grid[i][j] is valid in the grid
function is_valid(i, j, grid) {
    //Check whether grid[i][j] is valid at the i's row
    for (var column = 0; column < 9; column++) {
        if ((column != j) && (grid[i][column] == grid[i][j])) {
            return false
        }
    }

    //Check whether grid[i][j] is valid at the j's column
    for (var row = 0; row < 9; row++) {
        if ((row != i) && (grid[row][j] == grid[i][j])) {
            return false
        }
    }

    //Check whether grid[i][j] is valid at the 3-by-3 box
    for (var row = Math.floor(i / 3) * 3; row < Math.floor(i / 3) * 3 + 3; row++) {
        for (var col = Math.floor(j / 3) * 3; col < Math.floor(j / 3) * 3 + 3; col++) {
            if ((row != i) && (col != j) && (grid[row][col] == grid[i][j])) {
                return false
            }
        }
    }

    return true //The current value at grid[i][j] is valid
}

//Search for a solution
function search(grid) {
    var freeCellList = get_free_cell_list(grid);
    var numberOfFreeCells = freeCellList.length;
    if (numberOfFreeCells == 0) {
        return true
    }

    var k = 0;  //Start from the first free cell

    while (true) {
        var i = freeCellList[k][0];
        var j = freeCellList[k][1];
        if (grid[i][j] == 0) {
            grid[i][j] = 1;
        }

        if (is_valid(i, j, grid)) {
            if (k + 1 == numberOfFreeCells) {
                //no more free cells
                return true  //A solution is found
            }
            else {
                //Move to the next free cell
                k++;
            }
        }
        else {
            if (grid[i][j] < 9) {
                //Fill the free cell with the next possible value
                grid[i][j]++;
            }

            else {
                //grid[i][j] is 9,backtrack
                while (grid[i][j] == 9) {
                    if (k == 0) {
                        return false  //No possible value
                    }
                    grid[i][j] = 0;  //Reset to free cell
                    k--;  //Backtrack to the preceding free cell
                    i = freeCellList[k][0];
                    j = freeCellList[k][1];

                }
                //Fill the free cell with the next possible value
                //search continues from this free cell at k
                grid[i][j]++;
            }
        }
    }

    return true  //A solution is found
}

//output the answer on the web page
function output_ans() {
    var grid = read_a_puzzle();
    var grid_original = read_a_puzzle();

    if (search(grid)) {
        for (var i = 1; i <= TOTAL_CELLS; i++) {
            if (grid[Math.floor((i - 1) / 9)][(i - 1) % 9] != grid_original[Math.floor((i - 1) / 9)][(i - 1) % 9]) {
                document.getElementById(i).value = grid[Math.floor((i - 1) / 9)][(i - 1) % 9];
                document.getElementById(i).style.color = "#44c944";
            }
        }
    }
}

//returns the answer
function return_ans() {
    var grid = read_a_puzzle();
    var arr = [];

    if (search(grid)) {
        for (var i = 1; i <= TOTAL_CELLS; i++) {
            arr.push(grid[Math.floor((i - 1) / 9)][(i - 1) % 9]);
        }
    }

    return arr;
}

//Obtain a list of free cells from the puzzle
function get_free_cell_list(grid) {
    var freeCellList = new Array();
    var index = 0;
    
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            if (grid[i][j] == 0) {
                freeCellList[index] = new Array(i, j);
                index++;
            }
        }
    }

    return freeCellList;
}