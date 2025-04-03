import pygame
import numpy as np
import random
import sys

# 초기화
pygame.init()

# 상수 정의
WINDOW_SIZE = 600
GRID_SIZE = 4
CELL_SIZE = WINDOW_SIZE // GRID_SIZE
PADDING = 10

# 색상 정의
COLORS = {
    0: (205, 205, 205),
    2: (238, 228, 218),
    4: (237, 224, 200),
    8: (242, 177, 121),
    16: (245, 149, 99),
    32: (246, 124, 95),
    64: (246, 94, 59),
    128: (237, 207, 114),
    256: (237, 204, 97),
    512: (237, 200, 80),
    1024: (237, 197, 63),
    2048: (237, 194, 46)
}

# 폰트 설정
FONT = pygame.font.Font(None, 36)

class Game2048:
    def __init__(self):
        self.screen = pygame.display.set_mode((WINDOW_SIZE, WINDOW_SIZE))
        pygame.display.set_caption('2048 게임')
        self.board = np.zeros((GRID_SIZE, GRID_SIZE), dtype=int)
        self.add_new_tile()
        self.add_new_tile()
        self.score = 0

    def add_new_tile(self):
        empty_cells = [(i, j) for i in range(GRID_SIZE) for j in range(GRID_SIZE) if self.board[i][j] == 0]
        if empty_cells:
            i, j = random.choice(empty_cells)
            self.board[i][j] = 2 if random.random() < 0.9 else 4

    def move(self, direction):
        # 방향에 따른 회전
        if direction in ['UP', 'DOWN']:
            self.board = self.board.T

        # 왼쪽으로 이동
        for i in range(GRID_SIZE):
            row = self.board[i]
            # 0이 아닌 숫자만 추출
            non_zero = row[row != 0]
            merged = []
            j = 0
            
            # 같은 숫자 합치기
            while j < len(non_zero) - 1:
                if non_zero[j] == non_zero[j + 1]:
                    merged.append(non_zero[j] * 2)
                    self.score += non_zero[j] * 2
                    j += 2
                else:
                    merged.append(non_zero[j])
                    j += 1
            
            if j < len(non_zero):
                merged.append(non_zero[j])
                
            # 0으로 채우기
            new_row = np.zeros(GRID_SIZE, dtype=int)
            if direction in ['LEFT', 'UP']:
                new_row[:len(merged)] = merged
            else:  # RIGHT, DOWN
                new_row[GRID_SIZE - len(merged):] = merged
            self.board[i] = new_row

        # 원래 방향으로 되돌리기
        if direction in ['UP', 'DOWN']:
            self.board = self.board.T

    def draw(self):
        self.screen.fill((187, 173, 160))
        
        # 그리드 그리기
        for i in range(GRID_SIZE):
            for j in range(GRID_SIZE):
                value = self.board[i][j]
                x = j * CELL_SIZE + PADDING
                y = i * CELL_SIZE + PADDING
                
                # 타일 그리기
                pygame.draw.rect(self.screen, COLORS.get(value, (205, 205, 205)),
                               (x, y, CELL_SIZE - 2*PADDING, CELL_SIZE - 2*PADDING),
                               border_radius=5)
                
                if value != 0:
                    # 숫자 텍스트
                    text = FONT.render(str(value), True, (0, 0, 0) if value <= 4 else (255, 255, 255))
                    text_rect = text.get_rect(center=(x + CELL_SIZE/2 - PADDING, y + CELL_SIZE/2 - PADDING))
                    self.screen.blit(text, text_rect)

        # 점수 표시
        score_text = FONT.render(f'점수: {self.score}', True, (0, 0, 0))
        self.screen.blit(score_text, (10, WINDOW_SIZE - 40))

        pygame.display.flip()

    def is_game_over(self):
        # 빈 칸이 있는지 확인
        if 0 in self.board:
            return False
        
        # 합칠 수 있는 타일이 있는지 확인
        for i in range(GRID_SIZE):
            for j in range(GRID_SIZE):
                current = self.board[i][j]
                if j < GRID_SIZE - 1 and current == self.board[i][j + 1]:
                    return False
                if i < GRID_SIZE - 1 and current == self.board[i + 1][j]:
                    return False
        return True

    def run(self):
        clock = pygame.time.Clock()
        while True:
            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    pygame.quit()
                    sys.exit()
                
                if event.type == pygame.KEYDOWN:
                    if event.key == pygame.K_LEFT:
                        self.move('LEFT')
                    elif event.key == pygame.K_RIGHT:
                        self.board = np.fliplr(self.board)
                        self.move('LEFT')
                        self.board = np.fliplr(self.board)
                    elif event.key == pygame.K_UP:
                        self.move('UP')
                    elif event.key == pygame.K_DOWN:
                        self.move('DOWN')
                    
                    self.add_new_tile()
                    self.draw()

            if self.is_game_over():
                game_over_text = FONT.render('게임 오버!', True, (255, 0, 0))
                text_rect = game_over_text.get_rect(center=(WINDOW_SIZE/2, WINDOW_SIZE/2))
                self.screen.blit(game_over_text, text_rect)
                pygame.display.flip()
                pygame.time.wait(2000)
                pygame.quit()
                sys.exit()

            self.draw()
            clock.tick(60)

if __name__ == '__main__':
    game = Game2048()
    game.run() 