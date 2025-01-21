export class Field {
    constructor(x, y) {
        this._axisX = x;
        this._axisY = y;
        this._field = Array.from({ length: y }, () => Array(x).fill('_'));
    }

    printField() {
        console.log('    ' + [...Array(this._axisX).keys()].join(' '));
        this._field.forEach((line, rowIndex) => {
            console.log(rowIndex + ' | ' + line.join(' '));
        });
    }

    validCoord(x, y) {
        return x >= 0 && x < this._axisX && y >= 0 && y < this._axisY;
    }
}

// const f = new Field(5, 9)
// console.log(f);
// f.printField();
// console.log(f.validCoord(4, 5))


export class Mines extends Field {
    constructor(x, y, countOfMines) {
        super(x, y);

        if (countOfMines > this._axisX * this._axisY - 1) {
            this.__countOfMines = Math.floor((this._axisX * this._axisY) / 2);
        } else {
            this.__countOfMines = countOfMines;
        }


    }

    generateBombs(startX, startY) {
        // if (this.__countOfMines < Math.floor((this._axisX * this._axisY) / 2)) {
            this.__generateBombs1(startX, startY);
        // } else {
        //     this.__generateBombs2(startX, startY);
        // }
    }

    __generateBombs1(startX, startY) {
        const valX = Array.from({ length: this._axisX }, (_, index) => index);
        const valY = Array.from({ length: this._axisY }, (_, index) => index);
        let count = this.__countOfMines;

        // Fill field with bombs
        while (count > 0) {
            const x = valX[Math.floor(Math.random() * valX.length)];
            const y = valY[Math.floor(Math.random() * valY.length)];
            const isNotNearStart =
                Math.abs(x - startX) > 1 ||
                Math.abs(y - startY) > 1;
            // if (this._field[y][x] !== "X" && !(y === startY && x === startX)) {
            if (this._field[y][x] !== "X" && isNotNearStart) {
                this._field[y][x] = "X";
                count--;
            }
        }

        // Fill field values
        for (let x = 0; x < this._axisX; x++) {
            for (let y = 0; y < this._axisY; y++) {
                if (this._field[y][x] !== "X") {
                    this._field[y][x] = this.__countMinesAround(x, y);
                }
            }
        }
    }

    __generateBombs2(startX, startY) {
        const arrOfCoordinates = [];

        for (let x = 0; x < this._axisX; x++) {
            for (let y = 0; y < this._axisY; y++) {
                arrOfCoordinates.push([x, y]);
            }
        }

        arrOfCoordinates.splice(arrOfCoordinates.findIndex(coord => coord[0] === startY && coord[1] === startX), 1);

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
        for (let x = 0; x < this._axisX; x++) {
            for (let y = 0; y < this._axisY; y++) {
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
    constructor(x, y, countOfMines) {
        super(x, y);
        this.__countOfMines = countOfMines;
        this._mines = new Mines(x, y, countOfMines);
        this.__countOfShots = 0;
        this.__bombsWasGenerated = false;
    }

    checkPosition(x, y, setBomb = 0, firstShoot = true) {
        // Проверка корректности координат
        if (!this.validCoord(x, y)) return;

        // Первый запуск - генерация бомб
        if (!this.__bombsWasGenerated) {
            this._mines.generateBombs(x, y);
            this.__bombsWasGenerated = true;
        }

        // Режим выстрела
        if (setBomb === 0) {
            // Выстрел в свободную позицию
            if (this._field[y][x] === "X"){
                return;
            }
            else if (this._mines._field[y][x] === "X") {
                this._field[y][x] = "X";
                this.loseGame();
            }
            else if (this._mines._field[y][x] !== "X" && this._field[y][x] === "_") {
                this.processEmptyCell(x, y);
            }
            else if (this._mines._field[y][x] !== "X" && this._field[y][x] !== "_") {
                this.processNumericCell(x, y);
            }
        }

        // Режим установки/снятия бомбы
        if (setBomb !== 0) {
            if (!this.isNumericCell(x, y)) {
                this.toggleBombMark(x, y);
            }
        }

        // Проверка победы
        if (this.checkIsWin()) {
            this.winGame();
        }
    }
    isNumericCell(x, y) {
        // Проверка, является ли ячейка числовой
        const cell = this._field[y][x];

        // Проверяем, что ячейка не пустая и не бомба,
        // и является числом от 0 до 8
        return cell !== "_" &&
            cell !== "X" &&
            !isNaN(parseInt(cell)) &&
            parseInt(cell) >= 0 &&
            parseInt(cell) <= 8;
    }
    // Обработка пустой ячейки (с нулем)
    processEmptyCell(x, y) {

        // if(this._mines._field[y][x] === 'X') {
        //     this.loseGame();
        // }
        this._field[y][x] = this._mines._field[y][x];
        this.__countOfShots++;

        // Рекурсивное открытие соседних ячеек, если текущая - ноль
        if (this._field[y][x] === "0") {
            this.openAdjacentCells(x, y);
        }
    }

    // Открытие соседних ячеек
    openAdjacentCells(x, y) {
        for (let i = x - 1; i <= x + 1; i++) {
            for (let j = y - 1; j <= y + 1; j++) {
                if ((i === x && j === y) || !this.validCoord(i, j)) continue;
                if (this._field[j][i] === "_") {
                    this.checkPosition(i, j, 0, false);
                }
            }
        }
    }

    // Обработка числовой ячейки
    processNumericCell(x, y) {
        // Проверка корректности расстановки бомб вокруг числа
        if (this.checkBombsAroundNumber(x, y)) {
            this.openAdjacentCells(x, y);
        }
        // else {
        //     console.log('Проверка корректности бомб вокруг числа');
        //     this.loseGame();
        // }
    }

    // Проверка корректности бомб вокруг числа
    checkBombsAroundNumber(x, y) {
        for (let i = x - 1; i <= x + 1; i++) {
            for (let j = y - 1; j <= y + 1; j++) {
                if ((i === x && j === y) || !this.validCoord(i, j)) continue;
                if (this._field[j][i] === "X" && this._mines._field[j][i] !== "X") {
                    this.loseGame();
                }
                if ((this._field[j][i] === "X" || this._mines._field[j][i] === "X") && this._field[j][i] !== this._mines._field[j][i]) {
                    return false;
                }

            }
        }
        return true;
    }

    // Переключение метки бомбы
    toggleBombMark(x, y) {
        this._field[y][x] = (this._field[y][x] === "_") ? "X" : "_";
    }

    checkIsWin() {
        return this.__countOfShots === this._axisX * this._axisY - this.__countOfMines;
    }

    winGame() {
        console.clear();
        console.log("!!!Поздравляем! Вы выиграли игру!!!\n");
        this._mines.printField();
        alert(`Поздравляем! Вы выиграли игру с размерами ${this._axisX}x${this._axisY}`);
    }

    loseGame() {
        // console.clear();
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
        alert("Так грустно, вы проиграли игру...")
    }
}

// const p = new Playground(8, 12, 10);
// console.log(p);
// p.printField();
// p.checkPosition(1, 1)
// p.printField();
// p.checkPosition(5, 1, 1)
// p.printField();

// const m = new Mines(4, 5, 15);
// m.printField();
// m.generateBombs(4, 5)
// m.printField();