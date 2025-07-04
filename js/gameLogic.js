import { shuffle, isValid, createEmptyBoard } from './utils.js';

export class SudokuGame {
    constructor() {
        this.difficulties = {
            easy: 40,
            medium: 30,
            hard: 20
        };
    }

    generateBoard() {
        const board = createEmptyBoard();
        this.solve(board);
        return board;
    }

    generatePuzzle(difficulty) {
        const solution = this.generateBoard();
        const puzzle = JSON.parse(JSON.stringify(solution));
        const cellsToRemove = 81 - this.difficulties[difficulty];
        
        let removed = 0;
        while (removed < cellsToRemove) {
            const row = Math.floor(Math.random() * 9);
            const col = Math.floor(Math.random() * 9);

            if (puzzle[row][col] !== 0) {
                puzzle[row][col] = 0;
                removed++;
            }
        }
        
        return { puzzle, solution };
    }

    solve(board) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col] === 0) {
                    const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
                    shuffle(nums);
                    
                    for (let num of nums) {
                        if (isValid(board, row, col, num)) {
                            board[row][col] = num;
                            if (this.solve(board)) {
                                return true;
                            }
                            board[row][col] = 0;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    isSolved(board, solution) {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (board[i][j] === 0 || board[i][j] !== solution[i][j]) {
                    return false;
                }
            }
        }
        return true;
    }

    getEmptyCells(board) {
        const emptyCells = [];
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (board[i][j] === 0) {
                    emptyCells.push({ row: i, col: j });
                }
            }
        }
        return emptyCells;
    }
} 