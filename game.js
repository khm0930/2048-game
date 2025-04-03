class Game2048 {
    constructor() {
        this.grid = Array(4).fill().map(() => Array(4).fill(0));
        this.score = 0;
        this.bestScore = localStorage.getItem('bestScore') || 0;
        this.gameOver = false;
        this.gridContainer = document.querySelector('.grid-container');
        this.scoreDisplay = document.querySelector('.score');
        this.bestScoreDisplay = document.querySelector('.best-score');
        this.gameMessage = document.querySelector('.game-message');
        this.retryButton = document.querySelector('.retry-button');
        
        // 터치 이벤트를 위한 변수들
        this.touchStartX = null;
        this.touchStartY = null;
        
        this.init();
    }

    init() {
        this.bestScoreDisplay.textContent = this.bestScore;
        this.addRandomTile();
        this.addRandomTile();
        this.updateDisplay();
        
        // 키보드 이벤트
        document.addEventListener('keydown', this.handleKeyPress.bind(this));
        this.retryButton.addEventListener('click', this.restart.bind(this));
        
        // 터치 이벤트
        document.addEventListener('touchstart', this.handleTouchStart.bind(this), false);
        document.addEventListener('touchmove', this.handleTouchMove.bind(this), false);
        document.addEventListener('touchend', this.handleTouchEnd.bind(this), false);
    }

    handleTouchStart(event) {
        const firstTouch = event.touches[0];
        this.touchStartX = firstTouch.clientX;
        this.touchStartY = firstTouch.clientY;
        event.preventDefault(); // 스크롤 방지
    }

    handleTouchMove(event) {
        if (!this.touchStartX || !this.touchStartY) {
            return;
        }
        event.preventDefault(); // 스크롤 방지
    }

    handleTouchEnd(event) {
        if (!this.touchStartX || !this.touchStartY) {
            return;
        }

        const touchEndX = event.changedTouches[0].clientX;
        const touchEndY = event.changedTouches[0].clientY;

        const deltaX = touchEndX - this.touchStartX;
        const deltaY = touchEndY - this.touchStartY;

        // 최소 스와이프 거리 (픽셀)
        const minSwipeDistance = 50;

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // 수평 스와이프
            if (Math.abs(deltaX) > minSwipeDistance) {
                if (deltaX > 0) {
                    this.move('right');
                } else {
                    this.move('left');
                }
            }
        } else {
            // 수직 스와이프
            if (Math.abs(deltaY) > minSwipeDistance) {
                if (deltaY > 0) {
                    this.move('down');
                } else {
                    this.move('up');
                }
            }
        }

        // 터치 좌표 초기화
        this.touchStartX = null;
        this.touchStartY = null;
    }

    addRandomTile() {
        const emptyCells = [];
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (this.grid[i][j] === 0) {
                    emptyCells.push({i, j});
                }
            }
        }
        
        if (emptyCells.length > 0) {
            const {i, j} = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            this.grid[i][j] = Math.random() < 0.9 ? 2 : 4;
        }
    }

    rotateGrid(grid, times = 1) {
        let newGrid = JSON.parse(JSON.stringify(grid));
        for (let t = 0; t < times; t++) {
            const rotated = Array(4).fill().map(() => Array(4).fill(0));
            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 4; j++) {
                    rotated[j][3 - i] = newGrid[i][j];
                }
            }
            newGrid = rotated;
        }
        return newGrid;
    }

    moveLeft(grid) {
        let moved = false;
        const newGrid = Array(4).fill().map(() => Array(4).fill(0));
        
        for (let i = 0; i < 4; i++) {
            let row = grid[i].filter(cell => cell !== 0);
            let pos = 0;
            
            // Merge tiles
            for (let j = 0; j < row.length - 1; j++) {
                if (row[j] === row[j + 1]) {
                    row[j] *= 2;
                    this.score += row[j];
                    row.splice(j + 1, 1);
                    moved = true;
                }
            }
            
            // Fill the new row
            for (let j = 0; j < row.length; j++) {
                newGrid[i][j] = row[j];
            }
            
            // Check if moved
            if (JSON.stringify(grid[i]) !== JSON.stringify(newGrid[i])) {
                moved = true;
            }
        }
        
        return { grid: newGrid, moved };
    }

    move(direction) {
        let rotations = 0;
        let grid = JSON.parse(JSON.stringify(this.grid));
        
        // Rotate grid to make all moves like moving left
        switch(direction) {
            case 'up':
                rotations = 3;
                break;
            case 'right':
                rotations = 2;
                break;
            case 'down':
                rotations = 1;
                break;
            default:
                rotations = 0;
        }
        
        // Rotate to position
        grid = this.rotateGrid(grid, rotations);
        
        // Move left
        const { grid: newGrid, moved } = this.moveLeft(grid);
        
        // Rotate back
        grid = this.rotateGrid(newGrid, (4 - rotations) % 4);
        
        if (moved) {
            this.grid = grid;
            this.addRandomTile();
            this.updateScore();
            this.updateDisplay();
            
            if (this.isGameOver()) {
                this.gameOver = true;
                this.showGameOver();
            }
        }
    }

    updateDisplay() {
        // Clear existing tiles
        const tiles = document.querySelectorAll('.tile');
        tiles.forEach(tile => tile.remove());
        
        // Add new tiles
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (this.grid[i][j] !== 0) {
                    const tile = document.createElement('div');
                    tile.className = `tile tile-${this.grid[i][j]}`;
                    tile.textContent = this.grid[i][j];
                    
                    // Calculate position
                    const gridCell = this.gridContainer.children[i * 4 + j];
                    const rect = gridCell.getBoundingClientRect();
                    const containerRect = this.gridContainer.getBoundingClientRect();
                    
                    tile.style.left = (rect.left - containerRect.left) + 'px';
                    tile.style.top = (rect.top - containerRect.top) + 'px';
                    tile.style.width = rect.width + 'px';
                    tile.style.height = rect.height + 'px';
                    
                    this.gridContainer.appendChild(tile);
                }
            }
        }
    }

    isGameOver() {
        // Check for empty cells
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (this.grid[i][j] === 0) return false;
            }
        }
        
        // Check for possible merges
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                const current = this.grid[i][j];
                if (j < 3 && current === this.grid[i][j + 1]) return false;
                if (i < 3 && current === this.grid[i + 1][j]) return false;
            }
        }
        
        return true;
    }

    updateScore() {
        this.scoreDisplay.textContent = this.score;
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            localStorage.setItem('bestScore', this.bestScore);
            this.bestScoreDisplay.textContent = this.bestScore;
        }
    }

    showGameOver() {
        this.gameMessage.classList.add('game-over');
        this.gameMessage.querySelector('p').textContent = '게임 오버!';
    }

    handleKeyPress(event) {
        if (this.gameOver) return;
        
        switch(event.key) {
            case 'ArrowLeft':
                this.move('left');
                break;
            case 'ArrowRight':
                this.move('right');
                break;
            case 'ArrowUp':
                this.move('up');
                break;
            case 'ArrowDown':
                this.move('down');
                break;
        }
    }

    restart() {
        this.grid = Array(4).fill().map(() => Array(4).fill(0));
        this.score = 0;
        this.gameOver = false;
        this.gameMessage.classList.remove('game-over');
        this.updateScore();
        this.addRandomTile();
        this.addRandomTile();
        this.updateDisplay();
    }
}

// Start the game
new Game2048(); 