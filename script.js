import { Field, Mines, Playground } from '/Minesweeper2.js'

function new_game() {
    let n;
    let countOfMines;
    let startCoordinates;

    n = parseInt(prompt("Введите размер игрового поля (n >= 8): "));
    while (n < 8) {
        n = parseInt(prompt("Введите размер игрового поля (n >= 8): "));
    }

    countOfMines = parseInt(prompt(`Количество мин (менее ${n ** 2}): `));
    startCoordinates = prompt("Начальный выстрел x.y: ").split(".");
    console.log(n, countOfMines, startCoordinates);

    let game = new Playground(n, countOfMines, startCoordinates[0], startCoordinates[1]);
    console.log(game);


    const container = document.getElementById('game-container');
    container.style.gridTemplateColumns = `repeat(${n}, 1fr)`;

    for (let y = 0; y < n; y++) {
        for (let x = 0; x < n; x++) {
            const cell = document.createElement('div');
            cell.classList.add('field');
            cell.dataset.x = x;
            cell.dataset.y = y;
            cell.textContent = game._mines._field[x][y];
            cell.style.backgroundColor = 'lightgrey';
            cell.addEventListener('click', function() {
                // console.log(this.style.backgroundColor);
                if (this.style.backgroundColor === 'lightgrey') {
                    this.style.backgroundColor = 'black'; // Сброс цвета
                } else {
                    this.style.backgroundColor = 'lightgrey'; // Установка нового цвета
                }
            });
            // cell.addEventListener('click', () => handleCellClick(cell));
            container.appendChild(cell);
        }
    }
}

// document.querySelectorAll('.field').forEach(field => {
//     field.addEventListener('click', function() {
//         // Переключение цвета при каждом клике
//         console.log(field);
//         console.log(this.style.backgroundColor);
//         if (this.style.backgroundColor === 'lightgrey') {
//             this.style.backgroundColor = 'black'; // Сброс цвета
//         } else
//             this.style.backgroundColor = 'white';
//     });
// });

const new_game_btn = document.getElementById('new-game-btn');
new_game_btn.addEventListener('click', new_game);

