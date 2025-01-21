import { Field, Mines, Playground } from '/Minesweeper2.js'

let currentGame; // Глобальная переменная для хранения текущей игры

function new_game() {
    let sizePlayground = prompt("Размер игрового поля X.Y (минимальный размер по осям 8)").split(".").map(Number);
    while (sizePlayground.length !== 2 || sizePlayground[0] < 8 || sizePlayground[1] < 8) {
        sizePlayground = prompt("Введите размер игрового поля X и Y через разделитель '.' (минимальный размер по осям 8)").split(".");
    }

    const [width, height] = sizePlayground;
    let countOfMines = parseInt(prompt(`Количество бомб (менее ${width * height}): `));

    // Проверка количества мин
    while (countOfMines >= width * height || countOfMines <= 0) {
        countOfMines = parseInt(prompt(`Введите корректное количество бомб (менее ${width * height}): `));
    }

    // Создаем новую игру и сохраняем ее глобально
    currentGame = new Playground(width, height, countOfMines);
    console.log('Начало игры', currentGame);

    const container = document.getElementById('game-container');
    container.innerHTML = '';
    container.style.gridTemplateColumns = `repeat(${width}, 1fr)`;
    container.style.gridTemplateRows = `repeat(${height}, 1fr)`;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const cell = document.createElement('div');
            cell.classList.add('field');
            cell.dataset.x = x;
            cell.dataset.y = y;
            cell.textContent = '_';  // Начальное состояние ячейки
            cell.style.backgroundColor = 'white';
            container.appendChild(cell);
        }
    }
}

function initGameEvents() {
    const container = document.getElementById('game-container');

    // Левый клик - открытие ячейки
    container.addEventListener('click', (event) => {
        if (event.target.classList.contains('field')) {
            checkPosition(event);
        }
    });

    // Правый клик - установка флага/бомбы
    container.addEventListener('contextmenu', (event) => {
        event.preventDefault();
        if (event.target.classList.contains('field')) {
            setBomb(event);
        }
    });
}

function checkPosition(event) {
    const cell = event.target;
    const x = parseInt(cell.dataset.x);
    const y = parseInt(cell.dataset.y);

    currentGame.checkPosition(x, y);
    renderPlayground();
    console.log('Клик по ячейке:', x, y);
}

function setBomb(event) {
    const cell = event.target;
    const x = parseInt(cell.dataset.x);
    const y = parseInt(cell.dataset.y);

    currentGame.checkPosition(x, y, 1);
    renderPlayground();
    console.log('Правый клик по ячейке:', x, y);
}

function renderPlayground() {
    const cells = document.querySelectorAll('.field');

    for (let y = 0; y < currentGame._axisY; y++) {
        for (let x = 0; x < currentGame._axisX; x++) {
            const cell = Array.from(cells).find(
                cell =>
                    parseInt(cell.dataset.x) === x &&
                    parseInt(cell.dataset.y) === y
            );

            if (cell) {
                const cellValue = currentGame._field[y][x];
                cell.textContent = cellValue;

                if (cellValue !== '_') {
                    cell.classList.add('active');
                    cell.style.backgroundColor = '#f8f8f8';
                }

                // Цветовая схема для разных значений
                switch(cellValue) {
                    case "X":
                        cell.style.color = 'red';
                        break;
                    case "0":
                        cell.style.color = 'gray';
                        break;
                    case "1":
                        cell.style.color = 'blue';
                        break;
                    case "2":
                        cell.style.color = 'green';
                        break;
                    case "3":
                        cell.style.color = 'red';
                        break;
                    case "4":
                        cell.style.color = 'darkblue';
                        break;
                    case "5":
                        cell.style.color = 'maroon';
                        break;
                }
            }
        }
    }
}

// Инициализация событий при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    const new_game_btn = document.getElementById('new-game-btn');
    new_game_btn.addEventListener('click', () => {
        new_game();
        initGameEvents();
    });
});
