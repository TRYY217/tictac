from Logic.words import zero
from Logic.words import X
from  Logic.numbers import num
from Logic.game_field import draw_grid, board
from Logic.render_grid import cells

print('За какую сторону вы хотите играть')
choice_team = input()
if choice_team in X:
     print('Вы будете играть за крестик')
elif choice_team in zero:
    print('Вы будете играть за нолик')
else:
   print('Введите название команды')

while True:
    if choice_team in zero:
        pass
    elif choice_team in X:
        print('Введите число от 1 до 9')
        word = input()
    if choice_team in X and word in num:
       cells[word] = 'X'
       print(cells)
    else:
       print('введите именно число от 1 до 9')
       continue
    if cells[word] == 'X':
        print('Эта клетка занята')
        continue

    draw_grid(board)
