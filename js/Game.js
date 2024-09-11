import Spaceship from "./Spaceship.js";
import Enemy from "./Enemy.js";

class Game {
    #htmlElements = {
        ship: document.querySelector('[data-spaceship]'),
        container: document.querySelector('[data-container]'),
        score: document.querySelector('[data-score]'),
        lives: document.querySelector('[data-lives]'),
        modal: document.querySelector('[data-modal]'),
        scoreInfo: document.querySelector('[data-score-info]'),
        button: document.querySelector('[data-button]'),
    };
    #spaceship = new Spaceship(this.#htmlElements.ship, this.#htmlElements.container);
    #enemies = [];
    #lives = 0;
    #score = 0;
    #enemiesInterval = 30;
    #checkPositionInterval = null;
    #createEnemyInterval = null;
    #audio = new Audio('../sounds/main_theme.mp3');

    init() {
        this.#htmlElements.button.addEventListener('click', () => {
            this.#spaceship.init();
            this.#newGame();
        })
    }

    #newGame() {
        this.#lives = 3;
        this.#score = 0;
        this.#htmlElements.modal.classList.add('hide');
        this.#updateLivesText();
        this.#updateScoreText();
        this.#spaceship.element.style.left = '0px';
        this.#spaceship.setPosition();
        this.#checkPositionInterval = setInterval(() => this.#checkPosition(), 1);
        this.#createEnemyInterval = setInterval(() => this.#randomEnemy(), 1000);
        
        this.#audio.loop = true;
        this.#audio.play();
    }

    #endGame() {
        this.#htmlElements.modal.classList.remove('hide');
        this.#htmlElements.scoreInfo.textContent = `You loose! Your score is: ${this.#score}`;
        this.#enemies.forEach(enemy => enemy.explode());
        this.#enemies.length = 0;
        clearInterval(this.#checkPositionInterval);
        clearInterval(this.#createEnemyInterval);
        this.#audio.pause();
    }

    #checkPosition() {
        this.#enemies.forEach((enemy, enemyIndex, enemiesArray) => {
            const enemyPosition = {
                top: enemy.element.offsetTop,
                right: enemy.element.offsetLeft + enemy.element.offsetWidth,
                bottom: enemy.element.offsetTop + enemy.element.offsetHeight,
                left: enemy.element.offsetLeft
            };

            if (enemyPosition.top > window.innerHeight) {
                enemy.explode();
                enemiesArray.splice(enemyIndex, 1);
                this.#updateLives();
            }
            this.#spaceship.missiles.forEach((missile, missileIndex, missileArray) => {
                const missilePosition = {
                    top: missile.element.offsetTop,
                    right: missile.element.offsetLeft + missile.element.offsetWidth,
                    bottom: missile.element.offsetTop + missile.element.offsetHeight,
                    left: missile.element.offsetLeft
                };
                
                if (missilePosition.bottom >= enemyPosition.top && 
                    missilePosition.top <= enemyPosition.bottom &&
                    missilePosition.right >= enemyPosition.left &&
                    missilePosition.left <= enemyPosition.right) {
                        enemy.hit();

                        if (!enemy.lives) {
                            enemiesArray.splice(enemyIndex, 1);
                        }
                        
                        missile.remove();
                        missileArray.splice(missileIndex, 1);
                        this.#updateScore();
                    }

                if (missilePosition.bottom < 0) {
                    missile.remove();
                    missileArray.splice(missileIndex, 1);
                }
            });
        });
    }

    #randomEnemy() {
        const randomNumber = Math.floor(Math.random() * 5) + 1;
        randomNumber % 5 === 0 ? this.#createEnemy('enemy-big', this.#enemiesInterval * 2, 'explosion-big', 3) : this.#createEnemy('enemy', this.#enemiesInterval);
    }

    #createEnemy(enemySize, enemiesInterval, explosion = 'explosion', enemyLives = 1) {
        const enemy = new Enemy(this.#htmlElements.container, enemiesInterval, enemySize, explosion, enemyLives);
        enemy.init();
        this.#enemies.push(enemy);
    }

    #updateScore() {
        this.#score++;
        if (!(this.#score % 50)) {
            this.#enemiesInterval--;
        }
        this.#updateScoreText();
    }

    #updateScoreText() {
        this.#htmlElements.score.textContent = `Score: ${this.#score}`;
    }

    #updateLives() {
        this.#lives--;
        this.#updateLivesText();
        this.#htmlElements.container.classList.add('hit');
        setTimeout(() => this.#htmlElements.container.classList.remove('hit'), 100);

        if (!this.#lives) {
            this.#endGame();
        }
    }

    #updateLivesText() {
        this.#htmlElements.lives.textContent = `Lives: ${this.#lives}`;
    }
}

window.onload = function() {
    const game = new Game();
    game.init();
}