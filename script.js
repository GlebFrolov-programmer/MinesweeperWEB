import { Field, Mines, Playground } from './Minesweeper.js'
import {GameSettings} from './SettingsModal.js'

let settings = new GameSettings();
let currentGame; // Глобальная переменная для хранения текущей игры

function new_game(customSettings = null) {
    const gameSettings = customSettings || settings.preset;
    const { width, height, mines } = gameSettings;

    // Далее код создания игры без изменений
    currentGame = new Playground(width, height, mines);

    // Создаем новую игру и сохраняем ее глобально
    // currentGame = new Playground(width, height, countOfMines);
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

    // Клонирование контейнера для полного удаления всех обработчиков
    const oldContainer = container;
    const newContainer = oldContainer.cloneNode(true);
    oldContainer.parentNode.replaceChild(newContainer, oldContainer);

    // Левый клик - открытие ячейки
    newContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('field')) {
            checkPosition(event);
        }
    });

    // Правый клик - установка флага/бомбы
    newContainer.addEventListener('contextmenu', (event) => {
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
                    // cell.style.backgroundColor = '#f8f8f8';
                    cell.style.backgroundColor = '#fff';
                }
                else if (cell.classList.contains('active')) {
                    cell.classList.remove('active');
                }

                // Цветовая схема для разных значений
                switch(cellValue) {
                    case "X":
                        cell.style.color = 'red';
                        break;
                    case "0":
                        cell.style.color = 'grey';
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
                    case "6":
                        cell.style.color = 'pink';
                        break;
                    case "7":
                        cell.style.color = 'orange';
                        break;
                }
            }
        }
    }
    console.log('Следующий шаг игры', currentGame);
}

// Инициализация событий при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Автоматический запуск игры с настройками по умолчанию (легкий уровень)
    new_game();
    initGameEvents();

    const new_game_btn = document.getElementById('new-game-btn');
    new_game_btn.addEventListener('click', () => {
        new_game();
        initGameEvents();
    })

    const new_settings = document.getElementById('settings-btn');
    // Открытие модального окна с настройками
    new_settings.addEventListener('click', (event) => {
        console.log(new_settings);
        settings.openModal();
    });

    // обработчик для применения настроек
    const applySettingsBtn = document.getElementById('applySettings');
    applySettingsBtn.addEventListener('click', () => {
        const newSettings = settings.applySettings();
        if (newSettings) {
            new_game(newSettings); // Передаем новые настройки
            initGameEvents();
        }
    });
    // обработчик для отмены настроек
    const cancelButton = document.getElementById('cancelSettings');
    cancelButton.addEventListener('click', () => {
        settings.closeModal();
    });
});
