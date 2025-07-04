import { SudokuGame } from './gameLogic.js';
import { GameState } from './stateManager.js';
import { UIManager } from './uiManager.js';

export class GameController {
    constructor() {
        this.gameLogic = new SudokuGame();
        this.gameState = new GameState();
        this.uiManager = new UIManager();
        
        this.setupCallbacks();
        this.uiManager.initialize();
        this.startNewGame();
    }

    setupCallbacks() {
        this.uiManager.setOnCellUpdate((row, col, value) => {
            this.handleCellUpdate(row, col, value);
        });

        this.uiManager.setOnNewGame(() => {
            this.startNewGame();
        });

        this.uiManager.setOnSolve(() => {
            this.solveGame();
        });

        this.uiManager.setOnHelp(() => {
            this.provideHelp();
        });

        this.uiManager.setOnUndo(() => {
            this.undoMove();
        });

        this.uiManager.setOnRedo(() => {
            this.redoMove();
        });

        this.uiManager.setOnDifficultyChange((difficulty) => {
            this.gameState.setDifficulty(difficulty);
        });
    }

    startNewGame() {
        const { puzzle, solution } = this.gameLogic.generatePuzzle(this.gameState.getDifficulty());
        this.gameState.setGameData(puzzle, solution);
        this.updateUI();
    }

    handleCellUpdate(row, col, value) {
        if (!this.gameState.isCellFixed(row, col)) {
            this.gameState.updateCell(row, col, value);
            this.updateUI();
            
            if (this.gameLogic.isSolved(this.gameState.getBoard(), this.gameState.getSolution())) {
                this.uiManager.showWinMessage();
            }
        }
    }

    solveGame() {
        this.gameState.setGameData(
            this.gameState.getSolution(), 
            this.gameState.getSolution()
        );
        this.gameState.resetHistory();
        this.updateUI();
    }

    provideHelp() {
        const emptyCells = this.gameLogic.getEmptyCells(this.gameState.getBoard());
        
        if (emptyCells.length > 0) {
            const randomIndex = Math.floor(Math.random() * emptyCells.length);
            const cellToFill = emptyCells[randomIndex];
            const correctValue = this.gameState.getSolution()[cellToFill.row][cellToFill.col];
            
            this.gameState.updateCell(cellToFill.row, cellToFill.col, correctValue);
            this.updateUI();
        }
    }

    undoMove() {
        if (this.gameState.undo()) {
            this.updateUI();
        }
    }

    redoMove() {
        if (this.gameState.redo()) {
            this.updateUI();
        }
    }

    updateUI() {
        this.uiManager.renderBoard(
            this.gameState.getBoard(),
            (row, col) => this.gameState.isCellFixed(row, col)
        );
        
        this.uiManager.updateUndoRedoButtons(
            this.gameState.canUndo(),
            this.gameState.canRedo()
        );
    }
} 