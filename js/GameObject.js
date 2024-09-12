export default class GameObject {
    #interval = null;

    constructor(container, enemiesInterval) {
        this.container = container;
        this.element = document.createElement('div');
        this.enemiesInterval = enemiesInterval;
    }

    getRandomPosition() {
        return Math.floor(Math.random() * window.innerWidth - this.element.offsetWidth);
    }

    updatePosition() {
        this.#interval = setInterval(() => this.#setPosition(), this.enemiesInterval)
    }

    #setPosition() {
        this.element.style.top = `${this.element.offsetTop + 1}px`;
    }

    clearGameInterval() {
        clearInterval(this.#interval);
    }
}