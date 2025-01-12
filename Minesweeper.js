export class Field {
    constructor(n) {
        this._n = n;
        this._field = Array.from({ length: n }, () => Array(n).fill('_'));
    }

    printField() {
        console.log('    ' + [...Array(this._n).keys()].join(' '));
        this._field.forEach((line, rowIndex) => {
            console.log(rowIndex + ' | ' + line.join(' '));
        });
    }

    validCoord(x, y) {
        return x >= 0 && x < this._n && y >= 0 && y < this._n;
    }
}



export class Mines extends Field {
    constructor(n, countOfMines, startX, startY) {
        super(n);

        if (countOfMines > this._n ** 2 - 1) {
            this.__countOfMines = Math.floor(this._n ** 2 / 2);
        } else {
            this.__countOfMines = countOfMines;
        }

        this.__startX = startX;
        this.__startY = startY;

        if (this.__countOfMines < Math.floor(this._n ** 2 / 2)) {
            this.__generateBombs1();
        } else {
            this.__generateBombs2();
        }
    }

    __generateBombs1() {
        const val = Array.from({ length: this._n }, (_, index) => index);
        let count = this.__countOfMines;

        // Fill field with bombs
        while (count > 0) {
            const x = val[Math.floor(Math.random() * val.length)];
            const y = val[Math.floor(Math.random() * val.length)];
            if (this._field[y][x] !== "X" && !(y === this.__startY && x === this.__startX)) {
                this._field[y][x] = "X";
                count--;
            }
        }

        // Fill field values
        for (let x = 0; x < this._n; x++) {
            for (let y = 0; y < this._n; y++) {
                if (this._field[y][x] !== "X") {
                    this._field[y][x] = this.__countMinesAround(x, y);
                }
            }
        }
    }

    __generateBombs2() {
        const arrOfCoordinates = [];

        for (let x = 0; x < this._n; x++) {
            for (let y = 0; y < this._n; y++) {
                arrOfCoordinates.push([x, y]);
            }
        }

        arrOfCoordinates.splice(arrOfCoordinates.findIndex(coord => coord[0] === this.__startY && coord[1] === this.__startX), 1);

        let count = this.__countOfMines;

        // Fill field with bombs
        while (count > 0) {
            const num = Math.floor(Math.random() * arrOfCoordinates.length);
            const [bombX, bombY] = arrOfCoordinates[num];
            this._field[bombY][bombX] = "X";
            arrOfCoordinates.splice(num, 1);
            count--;
        }

        // Fill field values
        for (let x = 0; x < this._n; x++) {
            for (let y = 0; y < this._n; y++) {
                if (this._field[y][x] !== "X") {
                    this._field[y][x] = this.__countMinesAround(x, y);
                }
            }
        }
    }

    __countMinesAround(x, y) {
        let count = 0;

        for (let i = x - 1; i <= x + 1; i++) {
            for (let j = y - 1; j <= y + 1; j++) {
                if ((i === x && j === y) || !this.validCoord(i, j)) continue;
                if (this.validCoord(i, j) && this._field[j][i] === "X") {
                    count++;
                }
            }
        }

        return String(count);
    }
}


export class Playground extends Field {
    constructor(n, countOfMines, startX, startY) {
        super(n);
        this.__countOfMines = countOfMines;
        this._mines = new Mines(n, countOfMines, startX, startY);
        this.__countOfShots = 0;
        this._lose = false;
        this._checkPosition(startX, startY);
    }

    _checkPosition(x, y, setBomb = 0) {
        // Это выстрел, а не установка бомбы
        if (setBomb === 0 && this.validCoord(x, y)) {
            // Выстрел в свободную позицию, если это не бомба
            if (this._mines._field[y][x] !== "X" && this._field[y][x] === "_") {
                this._field[y][x] = this._mines._field[y][x];
                this.__countOfShots++;

                // Открыть позиции вокруг нуля с координатами x,y
                if (this._field[y][x] === "0") {
                    for (let i = x - 1; i <= x + 1; i++) {
                        for (let j = y - 1; j <= y + 1; j++) {
                            if ((i === x && j === y) || !this.validCoord(i, j)) continue;
                            if (this.validCoord(i, j) && this._field[j][i] === "_") {
                                // Рекурсия
                                this._checkPosition(i, j);
                            }
                        }
                    }
                }
            }
            // Выстрел по числам для открытия позиций вокруг
            else if (this._mines._field[y][x] !== "X" && this._field[y][x] !== "_") {
                let isEqual = true;

                // Условие на равенство (поля площадки == поля мин)
                for (let i = x - 1; i <= x + 1; i++) {
                    for (let j = y - 1; j <= y + 1; j++) {
                        if ((i === x && j === y) || !this.validCoord(i, j)) continue;
                        if (this.validCoord(i, j) && this._field[j][i] === "X" && this._field[j][i] !== this._mines._field[j][i]) {
                            isEqual = false;
                        }
                    }
                }

                if (isEqual) {
                    for (let i = x - 1; i <= x + 1; i++) {
                        for (let j = y - 1; j <= y + 1; j++) {
                            if ((i === x && j === y) || !this.validCoord(i, j)) continue;
                            if (this.validCoord(i, j) && this._field[j][i] === "_") {
                                this._checkPosition(i, j);
                            }
                        }
                    }
                } else {
                    this._lose = true; // Конец игры, проигрыш
                }
            } else {
                this._lose = true; // Конец игры, проигрыш
            }
        }
        // Установка бомбы на площадке
        else if (this.validCoord(x, y) && this._field[y][x] === "_") {
            this._field[y][x] = "X";
        }
        // Удаление бомбы с площадки
        else {
            this._field[y][x] = "_";
        }
    }

    checkIsWin() {
        return this.__countOfShots === this._n ** 2 - this.__countOfMines;
    }

    winGame() {
        console.clear();
        console.log("!!!Поздравляем! Вы выиграли игру!!!\n");
        this._mines.printField();
    }

    loseGame() {
        console.clear();
        console.log("Так грустно, вы проиграли игру...\n");

        for (let i = 0; i < this._n; i++) {
            for (let j = 0; j < this._n; j++) {
                if (this._field[i][j] === "X") {
                    this._field[i][j] = "_";
                }
            }
        }

        for (let i = 0; i < this._n; i++) {
            for (let j = 0; j < this._n; j++) {
                if (this._mines._field[i][j] === "X") {
                    this._field[i][j] = this._mines._field[i][j];
                }
            }
        }

        this.printField();
    }
}
/*
// Ввод параметров для игры
let n = parseInt(prompt("Введите размер игрового поля (n >= 8): "));
while (n < 8) {
    n = parseInt(prompt("Введите размер игрового поля (n >= 8): "));
}

let countOfMines = parseInt(prompt(`Количество мин (менее ${n ** 2}): `));
let startCoordinates = prompt("Начальный выстрел x.y: ").split(".");
let startX = parseInt(startCoordinates[0]);
let startY = parseInt(startCoordinates[1]);

// Создание игры
const game = new Playground(n, countOfMines, startX, startY);
const timeOfGameStart = Date.now() / 1000; // Время начала игры в секундах

// Игровой цикл
while (true) {
    console.clear();
    let [x, y, bomb] = [0, 0, 0]
    while (true) {
        try {
            // !!!ЧИТЫ!!!
            game._mines.printField();
            console.log("");

            game.printField();
            console.log("\nЕсли вы хотите установить бомбу, то параметр не должен равняться 0 и быть целым числом");
            let shotInput = prompt("Позиция выстрела или установка бомбы (x.y.bomb): ");
            [x, y, bomb] = shotInput.split(".").map(Number);
            break;
        } catch (error) {
            console.clear();
            console.log("!!!НЕПРАВИЛЬНЫЙ ВВОД!!! Попробуйте снова ввести позицию выстрела");
        }
    }

    game._checkPosition(x, y, bomb);

    // Проверка на выигрыш или проигрыш
    if (game.checkIsWin()) {
        game.winGame();
        console.log("\n", `Параметры: размер ${n}, количество бомб ${countOfMines}`);
        console.log(`Время игры: ${Math.round((Date.now() / 1000 - timeOfGameStart) * 100) / 100} сек`);
        break;
    } else if (game._lose) {
        game.loseGame();
        console.log("\n", `Время игры: ${Math.round((Date.now() / 1000 - timeOfGameStart) * 100) / 100} сек`);
        break;
    }
}
*/