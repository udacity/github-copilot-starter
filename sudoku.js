// This file contains only JavaScript for the Sudoku game. No HTML or CSS should be here.
(function () {
    var board = [];
    var solution = [];
    var SIZE = 9;
    var EMPTY = 0;

    function deepCopy(arr) {
        var copy = [];
        for (var i = 0; i < arr.length; i++) {
            copy[i] = arr[i].slice();
        }
        return copy;
    }

    function createEmptyBoard() {
        var arr = [];
        for (var i = 0; i < SIZE; i++) {
            arr[i] = [];
            for (var j = 0; j < SIZE; j++) {
                arr[i][j] = EMPTY;
            }
        }
        return arr;
    }

    function isSafe(board, row, col, num) {
        for (var x = 0; x < SIZE; x++) {
            if (board[row][x] === num || board[x][col] === num) {
                return false;
            }
        }
        var startRow = row - row % 3;
        var startCol = col - col % 3;
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                if (board[startRow + i][startCol + j] === num) {
                    return false;
                }
            }
        }
        return true;
    }

    function fillBoard(board) {
        for (var row = 0; row < SIZE; row++) {
            for (var col = 0; col < SIZE; col++) {
                if (board[row][col] === EMPTY) {
                    var possibleNumbers = [];
                    for (var num = 1; num <= SIZE; num++) possibleNumbers.push(num);
                    for (var shuffleIdx = possibleNumbers.length - 1; shuffleIdx > 0; shuffleIdx--) {
                        var randomIdx = Math.floor(Math.random() * (shuffleIdx + 1));
                        var temp = possibleNumbers[shuffleIdx];
                        possibleNumbers[shuffleIdx] = possibleNumbers[randomIdx];
                        possibleNumbers[randomIdx] = temp;
                    }
                    for (var tryIdx = 0; tryIdx < possibleNumbers.length; tryIdx++) {
                        var candidate = possibleNumbers[tryIdx];
                        if (isSafe(board, row, col, candidate)) {
                            board[row][col] = candidate;
                            if (fillBoard(board)) return true;
                            board[row][col] = EMPTY;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    function removeCells(board, clues) {
        var attempts = SIZE * SIZE - clues;
        while (attempts > 0) {
            var row = Math.floor(Math.random() * SIZE);
            var col = Math.floor(Math.random() * SIZE);
            if (board[row][col] !== EMPTY) {
                board[row][col] = EMPTY;
                attempts--;
            }
        }
    }

    function renderBoard() {
        var boardDiv = document.getElementById('sudoku-board');
        boardDiv.innerHTML = '';
        for (var i = 0; i < SIZE; i++) {
            var rowDiv = document.createElement('div');
            rowDiv.className = 'sudoku-row';
            for (var j = 0; j < SIZE; j++) {
                var input = document.createElement('input');
                input.type = 'text';
                input.maxLength = 1;
                input.className = 'sudoku-cell';
                if (board[i][j] !== EMPTY) {
                    input.value = board[i][j];
                    input.disabled = true;
                    input.className += ' prefilled';
                } else {
                    input.value = '';
                    input.oninput = (function (row, col, inp) {
                        return function () {
                            var val = inp.value.replace(/[^1-9]/g, '');
                            inp.value = val;
                            board[row][col] = val ? parseInt(val, 10) : EMPTY;
                            inp.className = 'sudoku-cell';
                        };
                    })(i, j, input);
                }
                rowDiv.appendChild(input);
            }
            boardDiv.appendChild(rowDiv);
        }
    }

    function checkSolution() {
        var correct = true;
        var boardDiv = document.getElementById('sudoku-board');
        var cells = boardDiv.getElementsByTagName('input');
        for (var i = 0; i < SIZE; i++) {
            for (var j = 0; j < SIZE; j++) {
                var idx = i * SIZE + j;
                if (solution[i][j] !== board[i][j]) {
                    cells[idx].className = 'sudoku-cell incorrect';
                    correct = false;
                } else if (!cells[idx].disabled) {
                    cells[idx].className = 'sudoku-cell';
                }
            }
        }
        var msg = document.getElementById('message');
        if (correct) {
            msg.style.color = '#388e3c';
            msg.innerHTML = 'Congratulations! You solved it!';
        } else {
            msg.style.color = '#d32f2f';
            msg.innerHTML = 'Some cells are incorrect.';
        }
    }

    function newGame() {
        var clues = 35; // Medium difficulty
        var newBoard = createEmptyBoard();
        fillBoard(newBoard);
        solution = deepCopy(newBoard);
        removeCells(newBoard, clues);
        board = deepCopy(newBoard);
        renderBoard();
        document.getElementById('message').innerHTML = '';
    }

    window.newGame = newGame;
    window.checkSolution = checkSolution;

    // Start game on load
    newGame();
})();