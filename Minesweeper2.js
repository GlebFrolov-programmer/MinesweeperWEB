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
        if (this.__countOfMines < Math.floor((this._axisX * this._axisY) / 2)) {
            this.__generateBombs1(startX, startY);
        } else {
            this.__generateBombs2(startX, startY);
        }
    }

    __generateBombs1(startX, startY) {
        const valX = Array.from({ length: this._axisX }, (_, index) => index);
        const valY = Array.from({ length: this._axisY }, (_, index) => index);
        let count = this.__countOfMines;

        // Fill field with bombs
        while (count > 0) {
            const x = valX[Math.floor(Math.random() * valX.length)];
            const y = valY[Math.floor(Math.random() * valY.length)];
            if (this._field[y][x] !== "X" && !(y === startY && x === startX)) {
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
        // this._lose = false;
    }

    checkPosition(x, y, setBomb = 0) {

        if (setBomb !== 0 && /^[+-]?\d+(\.\d+)?$/.test(this._field[y][x])) {
            return;
        }

        if (this.__bombsWasGenerated === false) {
            this._mines.generateBombs(x, y);
            this.__bombsWasGenerated = true;
        }

        // Это выстрел без установки бомбы
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
                                this.checkPosition(i, j);
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
                                this.checkPosition(i, j);
                            }
                        }
                    }
                } else {
                    this.loseGame();
                    // this._lose = true; // Конец игры, проигрыш
                }
            } else {
                this.loseGame();
                // this._lose = true; // Конец игры, проигрыш
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

const p = new Playground(6, 12, 10);

// p.printField();
p.checkPosition(1, 1)
p.printField();
p.checkPosition(5, 1, 1)
p.printField();

// const m = new Mines(4, 5, 15);
// m.printField();
// m.generateBombs(4, 5)
// m.printField();