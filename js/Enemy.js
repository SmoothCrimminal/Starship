export default class Enemy {

    #interval = null;
    #explosionSound = new Audio('../sounds/explo3.mp3');

    constructor(container, enemiesInterval, enemyClass, explosionClass, lives = 1) {
        this.container = container;
        this.element = document.createElement('div');
        this.enemyClass = enemyClass;
        this.explosionClass = explosionClass;
        this.enemiesInterval = enemiesInterval;
        this.lives = lives;
    }

    init() {
        this.#setEnemy();    
        this.#updatePosition();
    }

    #setEnemy() {
        this.element.classList.add(this.enemyClass);
        this.container.appendChild(this.element);
        this.element.style.top = '0px';
        this.element.style.left = `${this.#getRandomPosition()}px`;
    }

    #getRandomPosition() {
        return Math.floor(Math.random() * window.innerWidth - this.element.offsetWidth);
    }

    #updatePosition() {
        this.#interval = setInterval(() => this.#setPosition(), this.enemiesInterval)
    }

    #setPosition() {
        this.element.style.top = `${this.element.offsetTop + 1}px`;
    }

    explode() {
        this.element.classList.remove(this.enemyClass);
        this.element.classList.add(this.explosionClass);
        clearInterval(this.#interval);
        const animationTime = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--explosionsDuration'), 10);
        setTimeout(() => this.element.remove(), animationTime);
        this.#explosionSound.play();
    }

    hit() {
        this.lives--;
        if (!this.lives) {
            this.explode();
        }
    }
}