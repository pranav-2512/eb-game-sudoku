export class GameState {
    constructor() {
        this.board = [];
        this.solution = [];
        this.difficulty = 'easy';
        this.moveHistory = [];
        this.currentMoveIndex = -1;
        this.initialBoard = []; // To track which cells were originally filled
    }

    setGameData(puzzle, solution) {
        this.board = JSON.parse(JSON.stringify(puzzle));
        this.solution = JSON.parse(JSON.stringify(solution));
        this.initialBoard = JSON.parse(JSON.stringify(puzzle));
        this.resetHistory();
    }

    setDifficulty(difficulty) {
        this.difficulty = difficulty;
    }

    resetHistory() {
        this.moveHistory = [];
        this.currentMoveIndex = -1;
    }

    saveMove(row, col, oldValue, newValue) {
        // Remove any moves after current position (for redo)
        this.moveHistory = this.moveHistory.slice(0, this.currentMoveIndex + 1);
        
        this.moveHistory.push({
            row: row,
            col: col,
            oldValue: oldValue,
            newValue: newValue
        });
        
        this.currentMoveIndex++;
    }

    canUndo() {
        return this.currentMoveIndex >= 0;
    }

    canRedo() {
        return this.currentMoveIndex < this.moveHistory.length - 1;
    }

    undo() {
        if (this.canUndo()) {
            const move = this.moveHistory[this.currentMoveIndex];
            this.board[move.row][move.col] = move.oldValue;
            this.currentMoveIndex--;
            return true;
        }
        return false;
    }

    redo() {
        if (this.canRedo()) {
            this.currentMoveIndex++;
            const move = this.moveHistory[this.currentMoveIndex];
            this.board[move.row][move.col] = move.newValue;
            return true;
        }
        return false;
    }

    updateCell(row, col, value) {
        const oldValue = this.board[row][col];
        this.board[row][col] = value;
        this.saveMove(row, col, oldValue, value);
    }

    isCellFixed(row, col) {
        return this.initialBoard[row][col] !== 0;
    }

    getBoard() {
        return this.board;
    }

    getSolution() {
        return this.solution;
    }

    getDifficulty() {
        return this.difficulty;
    }
} 