class Game2048 {
    constructor() {
        this.gridSize = 4;
        this.grid = Array(this.gridSize).fill().map(() => Array(this.gridSize).fill(0));
        this.score = 0;
        this.gameOver = false;
        this.gridContainer = document.getElementById('grid-container');
        this.scoreElement = document.getElementById('score');
        this.gameOverModal = document.getElementById('gameOverModal');
        this.rankingsModal = document.getElementById('rankingsModal');
        this.finalScoreElement = document.getElementById('finalScore');
        this.rankingsList = document.getElementById('rankingsList');

        // 이벤트 리스너 설정
        document.addEventListener('keydown', this.handleKeyPress.bind(this));
        document.getElementById('submitScore').addEventListener('click', this.submitScore.bind(this));
        document.getElementById('restartGame').addEventListener('click', this.restart.bind(this));
        document.getElementById('showRankings').addEventListener('click', this.showRankings.bind(this));
        document.getElementById('closeRankings').addEventListener('click', () => this.rankingsModal.style.display = 'none');

        // 모바일 터치 이벤트
        let touchStartX, touchStartY;
        document.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        });

        document.addEventListener('touchend', (e) => {
            if (this.gameOver) return;
            
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            
            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;
            
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                if (deltaX > 0) this.move('right');
                else this.move('left');
            } else {
                if (deltaY > 0) this.move('down');
                else this.move('up');
            }
        });

        this.initializeGrid();
        this.addNewTile();
        this.addNewTile();
        this.updateDisplay();
    }

    initializeGrid() {
        this.gridContainer.innerHTML = '';
        for (let i = 0; i < this.gridSize * this.gridSize; i++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            this.gridContainer.appendChild(cell);
        }
    }

    addNewTile() {
        const emptyCells = [];
        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {
                if (this.grid[i][j] === 0) {
                    emptyCells.push({x: i, y: j});
                }
            }
        }
        
        if (emptyCells.length > 0) {
            const {x, y} = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            this.grid[x][y] = Math.random() < 0.9 ? 2 : 4;
        }
    }

    updateDisplay() {
        this.gridContainer.innerHTML = '';
        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                
                if (this.grid[i][j] !== 0) {
                    const tile = document.createElement('div');
                    tile.className = `tile tile-${this.grid[i][j]}`;
                    tile.textContent = this.grid[i][j];
                    cell.appendChild(tile);
                }
                
                this.gridContainer.appendChild(cell);
            }
        }
        this.scoreElement.textContent = this.score;
    }

    move(direction) {
        if (this.gameOver) return;

        const previousGrid = JSON.stringify(this.grid);
        let moved = false;

        switch (direction) {
            case 'left':
                moved = this.moveLeft();
                break;
            case 'right':
                this.grid = this.grid.map(row => row.reverse());
                moved = this.moveLeft();
                this.grid = this.grid.map(row => row.reverse());
                break;
            case 'up':
                this.grid = this.transpose(this.grid);
                moved = this.moveLeft();
                this.grid = this.transpose(this.grid);
                break;
            case 'down':
                this.grid = this.transpose(this.grid);
                this.grid = this.grid.map(row => row.reverse());
                moved = this.moveLeft();
                this.grid = this.grid.map(row => row.reverse());
                this.grid = this.transpose(this.grid);
                break;
        }

        if (moved) {
            this.addNewTile();
            this.updateDisplay();
            
            if (this.isGameOver()) {
                this.gameOver = true;
                this.showGameOver();
            }
        }
    }

    moveLeft() {
        let moved = false;
        
        for (let i = 0; i < this.gridSize; i++) {
            let row = this.grid[i].filter(cell => cell !== 0);
            let newRow = [];
            
            for (let j = 0; j < row.length; j++) {
                if (j + 1 < row.length && row[j] === row[j + 1]) {
                    newRow.push(row[j] * 2);
                    this.score += row[j] * 2;
                    j++;
                    moved = true;
                } else {
                    newRow.push(row[j]);
                }
            }
            
            while (newRow.length < this.gridSize) {
                newRow.push(0);
            }
            
            if (JSON.stringify(this.grid[i]) !== JSON.stringify(newRow)) {
                moved = true;
            }
            
            this.grid[i] = newRow;
        }
        
        return moved;
    }

    transpose(grid) {
        return grid[0].map((_, i) => grid.map(row => row[i]));
    }

    handleKeyPress(event) {
        if (this.gameOver) return;

        switch (event.key) {
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

    isGameOver() {
        // 빈 칸이 있는지 확인
        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {
                if (this.grid[i][j] === 0) return false;
            }
        }
        
        // 인접한 같은 숫자가 있는지 확인
        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {
                if (j < this.gridSize - 1 && this.grid[i][j] === this.grid[i][j + 1]) return false;
                if (i < this.gridSize - 1 && this.grid[i][j] === this.grid[i + 1][j]) return false;
            }
        }
        
        return true;
    }

    showGameOver() {
        this.finalScoreElement.textContent = this.score;
        this.gameOverModal.style.display = 'block';
    }

    async submitScore() {
        const nickname = document.getElementById('nickname').value.trim();
        if (!nickname) {
            alert('닉네임을 입력해주세요!');
            return;
        }

        try {
            const response = await fetch('/api/rankings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nickname,
                    score: this.score
                })
            });

            if (response.ok) {
                this.gameOverModal.style.display = 'none';
                this.showRankings();
            } else {
                alert('점수 등록에 실패했습니다.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('점수 등록 중 오류가 발생했습니다.');
        }
    }

    async showRankings() {
        try {
            const response = await fetch('/api/rankings');
            const rankings = await response.json();
            
            this.rankingsList.innerHTML = rankings.map((rank, index) => `
                <div>
                    ${index + 1}. ${rank.nickname} - ${rank.score}점
                    <small style="color: #999">${new Date(rank.created_at).toLocaleString()}</small>
                </div>
            `).join('');
            
            this.rankingsModal.style.display = 'block';
        } catch (error) {
            console.error('Error:', error);
            alert('랭킹 조회 중 오류가 발생했습니다.');
        }
    }

    restart() {
        this.grid = Array(this.gridSize).fill().map(() => Array(this.gridSize).fill(0));
        this.score = 0;
        this.gameOver = false;
        this.gameOverModal.style.display = 'none';
        this.addNewTile();
        this.addNewTile();
        this.updateDisplay();
    }
}

// 게임 시작
new Game2048(); 