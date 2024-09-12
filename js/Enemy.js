import GameObject from "./GameObject.js";
import Missile from "./Missile.js";

export default class Enemy extends GameObject {
    #explosionSound = new Audio('../sounds/explo3.mp3');
    #shootsInterval = null;
    missiles = [];
    shoots = false;


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

        this.shoots = Math.random() > 0.5
        if (this.shoots) {
            this.#shootsInterval = setInterval(() => this.#shot(), 5000);
        }
    }

    #setEnemy() {
        this.element.classList.add(this.enemyClass);
        this.container.appendChild(this.element);
        this.element.style.top = '0px';
        this.element.style.left = `${this.getRandomPosition()}px`;
    }

    #shot() {
        const missile = new Missile(this.#getPosition(), this.element.offsetTop, this.container);
        missile.init(true);
        this.missiles.push(missile);
        const shotAudio = new Audio('../sounds/singleshot.mp3');
        shotAudio.play();
    }

    #getPosition() {
        return this.element.offsetLeft + this.element.offsetWidth / 2;
    }

    explode() {
        this.element.classList.remove(this.enemyClass);
        this.element.classList.add(this.explosionClass);
        this.clearGameInterval();
        const animationTime = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--explosionsDuration'), 10);
        setTimeout(() => this.element.remove(), animationTime);
        this.#explosionSound.play();
        if (this.shoots) {
            clearInterval(this.#shootsInterval);
            this.missiles.forEach(missile => missile.remove());
            this.missiles.length = 0;
        }
    }

    hit() {
        this.lives--;
        if (!this.lives) {
            this.explode();
        }
    }
}