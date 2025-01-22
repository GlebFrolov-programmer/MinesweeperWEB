export class GameSettings {
    constructor() {
        this.preset = this.applyGameSettings('default');
    }

    openModal() {
        const modal = document.getElementById('settingsModal');
        modal.style.display = 'block';
    }

    closeModal() {
        const modal = document.getElementById('settingsModal');
        modal.style.display = 'none';
    }

    selectDifficulty(difficulty) {
        if (difficulty === 'custom') {
            document.getElementById('customSettings').classList.remove('hidden');
        } else {
            // Применить настройки к игре
            this.preset = this.applyGameSettings(difficulty);
        }
    }

    applyGameSettings(settings) {
        const presets = {
            easy: { width: 9, height: 9, mines: 10 },
            medium: { width: 16, height: 16, mines: 40 },
            hard: { width: 30, height: 16, mines: 99 },
            expert: { width: 50, height: 50, mines: 500 }
        };
        // Логика применения настроек к игровому полю
        if (settings === 'default' || !(settings in presets)) {
            return presets.easy;
        } else {
            return presets[settings];
        }
    }

    // Применение настроек
    applySettings() {
        const difficulty = document.querySelector('input[name="difficulty"]:checked').value;

        let gameSettings;
        if (difficulty === 'custom') {
            const customWidth = document.getElementById('customWidth').value;
            const customHeight = document.getElementById('customHeight').value;
            const customMines = document.getElementById('customMines').value;

            gameSettings = {
                width: parseInt(customWidth),
                height: parseInt(customHeight),
                mines: parseInt(customMines)
            };
        } else {
            gameSettings = this.applyGameSettings(difficulty);
        }

        // Проверка корректности настроек
        if (gameSettings.width < 8 || gameSettings.height < 8 ||
            gameSettings.mines >= gameSettings.width * gameSettings.height - 9 ||
            gameSettings.mines <= 0) {
            alert('Некорректные настройки игры');
            return null;
        }

        this.preset = gameSettings;
        this.closeModal();

        return gameSettings;
    }
}
