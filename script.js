document.addEventListener('DOMContentLoaded', () => {
    const boardElement = document.getElementById('sudoku-board');
    const newGameBtn = document.getElementById('new-game-btn');
    const solveBtn = document.getElementById('solve-btn');
    const helpBtn = document.getElementById('help-btn');
    const easyBtn = document.getElementById('easy-btn');
    const mediumBtn = document.getElementById('medium-btn');
    const hardBtn = document.getElementById('hard-btn');

    let board = [];
    let solution = [];
    let difficulty = 'easy'; 
    let winAudio = null;

    const difficulties = {
        easy: 40,
        medium: 30,
        hard: 20
    };

    // Modal logic for difficulty selection
    const difficultyModal = document.getElementById('difficulty-modal');
    const closeDifficultyModal = document.getElementById('close-difficulty-modal');
    const modalDifficultyBtns = document.querySelectorAll('.difficulty-modal-buttons .difficulty-btn');

    function setActiveDifficulty(level) {
        difficulty = level;
        [easyBtn, mediumBtn, hardBtn].forEach(btn => btn.classList.remove('active'));
        document.getElementById(`${level}-btn`).classList.add('active');
    }

    easyBtn.addEventListener('click', () => setActiveDifficulty('easy'));
    mediumBtn.addEventListener('click', () => setActiveDifficulty('medium'));
    hardBtn.addEventListener('click', () => setActiveDifficulty('hard'));
    newGameBtn.addEventListener('click', () => {
        openDifficultyModal();
    });
    solveBtn.addEventListener('click', solveSudoku);
    helpBtn.addEventListener('click', provideHelp);

    function openDifficultyModal() {
        difficultyModal.style.display = 'flex';
    }
    function closeModal() {
        difficultyModal.style.display = 'none';
    }

    closeDifficultyModal.addEventListener('click', closeModal);
    difficultyModal.addEventListener('click', (e) => {
        if (e.target === difficultyModal) closeModal();
    });

    modalDifficultyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const level = btn.getAttribute('data-difficulty');
            setActiveDifficulty(level);
            newGame();
            closeModal();
        });
    });

    function generateBoard() {
        board = Array(9).fill(0).map(() => Array(9).fill(0));
        solution = Array(9).fill(0).map(() => Array(9).fill(0));
        
        // This is a simple backtracking solver to generate a full board
        solve(board);
        
        for(let i=0; i<9; i++) {
            for(let j=0; j<9; j++) {
                solution[i][j] = board[i][j];
            }
        }
    }

    function generatePuzzle() {
        let puzzle = JSON.parse(JSON.stringify(solution));
        let cellsToRemove = 81 - difficulties[difficulty];
        
        while (cellsToRemove > 0) {
            let row = Math.floor(Math.random() * 9);
            let col = Math.floor(Math.random() * 9);

            if (puzzle[row][col] !== 0) {
                puzzle[row][col] = 0;
                cellsToRemove--;
            }
        }
        board = puzzle;
    }

    function drawBoard() {
        boardElement.innerHTML = '';
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                if (board[i][j] !== 0) {
                    cell.textContent = board[i][j];
                    cell.classList.add('fixed');
                } else {
                    const input = document.createElement('input');
                    input.setAttribute('type', 'number');
                    input.setAttribute('min', '1');
                    input.setAttribute('max', '9');
                    input.addEventListener('input', (e) => {
                        const value = parseInt(e.target.value);
                        if(value > 0 && value < 10) {
                           board[i][j] = value;
                           if (isSolved()) {
                               showWinAnimation();
                           }
                        } else if(e.target.value === '') {
                            board[i][j] = 0;
                        }
                        else {
                            e.target.value = '';
                        }
                    });
                    cell.appendChild(input);
                }
                boardElement.appendChild(cell);
            }
        }
    }

    function newGame() {
        generateBoard();
        generatePuzzle();
        drawBoard();
    }

    function solveSudoku() {
        board = JSON.parse(JSON.stringify(solution));
        drawBoard();
    }
    
    function provideHelp() {
        // Find a random empty cell and fill it with the correct number
        let emptyCells = [];
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (board[i][j] === 0) {
                    emptyCells.push({row: i, col: j});
                }
            }
        }

        if (emptyCells.length > 0) {
            let randomIndex = Math.floor(Math.random() * emptyCells.length);
            let cellToFill = emptyCells[randomIndex];
            board[cellToFill.row][cellToFill.col] = solution[cellToFill.row][cellToFill.col];
            drawBoard();
        }
    }

    function isSolved() {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (board[i][j] === 0 || board[i][j] !== solution[i][j]) {
                    return false;
                }
            }
        }
        return true;
    }

    function solve(board) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col] === 0) {
                    let nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
                    shuffle(nums);
                    for (let num of nums) {
                        if (isValid(board, row, col, num)) {
                            board[row][col] = num;
                            if (solve(board)) {
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

    function isValid(board, row, col, num) {
        for (let i = 0; i < 9; i++) {
            if (board[row][i] === num || board[i][col] === num) {
                return false;
            }
        }

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

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function loadWinAudio() {
        if (!winAudio) {
            winAudio = new Audio('https://cdn.pixabay.com/audio/2022/07/26/audio_124bfae5b6.mp3'); // Royalty-free cute win sound
            winAudio.volume = 0.5;
        }
    }

    function showWinAnimation() {
        loadWinAudio();
        if (winAudio) {
            winAudio.currentTime = 0;
            winAudio.play();
        }
        // Remove any existing overlay
        const oldOverlay = document.getElementById('win-overlay');
        if (oldOverlay) oldOverlay.remove();
        // Create overlay
        let overlay = document.createElement('div');
        overlay.id = 'win-overlay';
        overlay.style.cssText = `position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:9999;display:flex;align-items:center;justify-content:center;pointer-events:none;`;
        // Winner message
        let msg = document.createElement('div');
        msg.textContent = '🎉 You Win! 🎉';
        msg.style.cssText = 'font-size:3rem;font-weight:900;color:#fff;text-shadow:0 4px 24px #764ba2,0 0 16px #fff;animation:popWin 1s cubic-bezier(.68,-0.55,.27,1.55);';
        overlay.appendChild(msg);
        // Sparkles
        for(let i=0;i<40;i++){
            let sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.style.cssText = `position:absolute;width:8px;height:8px;border-radius:50%;background:linear-gradient(135deg,#fff,#ffd700,#ff00cc);opacity:0.85;left:${Math.random()*100}vw;top:${Math.random()*100}vh;transform:scale(${0.7+Math.random()*1.2});animation:sparkleAnim 1.2s ${Math.random()}s ease-out forwards;`;
            overlay.appendChild(sparkle);
        }
        document.body.appendChild(overlay);
        setTimeout(()=>{overlay.remove();},1800);
    }

    // Initial game start
    setActiveDifficulty('easy');
    newGame();
}); 