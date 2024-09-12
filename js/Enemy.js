import GameObject from "./GameObject.js";

export default class Enemy extends GameObject {
    #explosionSound = new Audio('../sounds/explo3.mp3');

    constructor(container, enemiesInterval, enemyClass, explosionClass, lives = 1) {
        super(container);

        this.enemyClass = enemyClass;
        this.explosionClass = explosionClass;
        this.enemiesInterval = enemiesInterval;
        this.lives = lives;
    }

    init() {
        this.#setEnemy();    
        this.updatePosition();
    }

    #setEnemy() {
        this.element.classList.add(this.enemyClass);
        this.container.appendChild(this.element);
        this.element.style.top = '0px';
        this.element.style.left = `${this.getRandomPosition()}px`;
    }

    explode() {
        this.element.classList.remove(this.enemyClass);
        this.element.classList.add(this.explosionClass);
        this.clearGameInterval();
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