def draw_grid(board):
    for i in range(3):
        row = " | ".join(board[i])
        print(row)
        if i < 2:
            print("--+---+--")

# Пустое поле 3x3
board = [[" " for _ in range(3)] for _ in range(3)]