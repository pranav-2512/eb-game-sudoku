// Utility functions
export function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

export function isValid(board, row, col, num) {
    // Check row
    for (let i = 0; i < 9; i++) {
        if (board[row][i] === num) return false;
    }
    
    // Check column
    for (let i = 0; i < 9; i++) {
        if (board[i][col] === num) return false;
    }
    
    // Check 3x3 box
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[startRow + i][startCol + j] === num) {
                return false;
            }
        }
    }
    
    return true;
}

export function createEmptyBoard() {
    return Array(9).fill(0).map(() => Array(9).fill(0));
} 