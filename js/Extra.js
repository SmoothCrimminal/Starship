import GameObject from "./GameObject.js";

export default class Extra extends GameObject {
    constructor(container, bonusType, interval) {
        super(container, interval)

        this.bonusType = bonusType;
    }

    create() {
        this.element.classList.add(this.bonusType);
        this.container.appendChild(this.element);
        this.element.style.top = '0px';
        this.element.style.left = `${this.getRandomPosition()}px`;
        this.updatePosition();
    }

    remove() {
        this.clearGameInterval();
        this.element.classList.remove(this.bonusType);
        this.element.remove();
    }
}