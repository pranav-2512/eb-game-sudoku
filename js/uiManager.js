export class UIManager {
    constructor() {
        this.boardElement = document.getElementById('sudoku-board');
        this.undoBtn = document.getElementById('undo-btn');
        this.redoBtn = document.getElementById('redo-btn');
        this.solveBtn = document.getElementById('solve-btn');
        this.helpBtn = document.getElementById('help-btn');
        this.newGameBtn = document.getElementById('new-game-btn');
        this.easyBtn = document.getElementById('easy-btn');
        this.mediumBtn = document.getElementById('medium-btn');
        this.hardBtn = document.getElementById('hard-btn');
        
        this.onCellUpdate = null;
        this.onNewGame = null;
        this.onSolve = null;
        this.onHelp = null;
        this.onUndo = null;
        this.onRedo = null;
        this.onDifficultyChange = null;
    }

    initialize() {
        this.setupEventListeners();
        this.setActiveDifficulty('easy');
    }

    setupEventListeners() {
        this.easyBtn.addEventListener('click', () => this.setActiveDifficulty('easy'));
        this.mediumBtn.addEventListener('click', () => this.setActiveDifficulty('medium'));
        this.hardBtn.addEventListener('click', () => this.setActiveDifficulty('hard'));
        
        this.newGameBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to start a new game? Your progress will be lost.')) {
                this.onNewGame?.();
            }
        });
        
        this.solveBtn.addEventListener('click', () => this.onSolve?.());
        this.helpBtn.addEventListener('click', () => this.onHelp?.());
        this.undoBtn.addEventListener('click', () => this.onUndo?.());
        this.redoBtn.addEventListener('click', () => this.onRedo?.());
    }

    setActiveDifficulty(level) {
        [this.easyBtn, this.mediumBtn, this.hardBtn].forEach(btn => 
            btn.classList.remove('active')
        );
        document.getElementById(`${level}-btn`).classList.add('active');
        this.onDifficultyChange?.(level);
    }

    renderBoard(board, isCellFixed) {
        this.boardElement.innerHTML = '';
        
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                const cell = this.createCell(i, j, board[i][j], isCellFixed(i, j));
                this.boardElement.appendChild(cell);
            }
        }
    }

    createCell(row, col, value, isFixed) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        
        const input = this.createInput(row, col, value);
        if (isFixed) {
            input.readOnly = true;
            input.classList.add('fixed');
        } else {
            input.readOnly = false;
            input.classList.remove('fixed');
        }
        cell.appendChild(input);
        
        return cell;
    }

    createInput(row, col, value) {
        const input = document.createElement('input');
        input.setAttribute('type', 'number');
        input.setAttribute('min', '1');
        input.setAttribute('max', '9');
        
        if (value !== 0) {
            input.value = value;
        }
        
        input.addEventListener('input', (e) => {
            const newValue = parseInt(e.target.value);
            
            if (newValue > 0 && newValue < 10) {
                this.onCellUpdate?.(row, col, newValue);
            } else if (e.target.value === '') {
                this.onCellUpdate?.(row, col, 0);
            } else {
                e.target.value = '';
            }
        });
        
        return input;
    }

    updateUndoRedoButtons(canUndo, canRedo) {
        this.undoBtn.disabled = !canUndo;
        this.redoBtn.disabled = !canRedo;
    }

    showWinMessage() {
        alert('Congratulations! You solved the Sudoku!');
    }

    // Callback setters
    setOnCellUpdate(callback) {
        this.onCellUpdate = callback;
    }

    setOnNewGame(callback) {
        this.onNewGame = callback;
    }

    setOnSolve(callback) {
        this.onSolve = callback;
    }

    setOnHelp(callback) {
        this.onHelp = callback;
    }

    setOnUndo(callback) {
        this.onUndo = callback;
    }

    setOnRedo(callback) {
        this.onRedo = callback;
    }

    setOnDifficultyChange(callback) {
        this.onDifficultyChange = callback;
    }
} 