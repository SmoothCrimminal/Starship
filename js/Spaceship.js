import Missile from "./Missile.js";

export default class Spaceship {
    missiles = [];
    #moveModifier = 2;
    #leftArrow = false;
    #rightArrow = false;
    #currentBullets = 3;
    #bulletsCount = 3;
    #collectAudio = new Audio();

    constructor(element, container) {
        this.element = element;
        this.container = container;
    }
    
    init() {
        this.setPosition();
        this.#eventListeners();
        this.#gameLoop();
    }

    setPosition() {
        this.element.style.bottom = '0px';
        this.element.style.left = `${window.innerWidth / 2 - this.#getPosition()}px`;
    }

    increaseSpeed() {
        this.#moveModifier++;
    }

    increaseBullets() {
        this.#bulletsCount++;
    }

    collect(audioSource) {
        this.#collectAudio.src = audioSource;
        this.#collectAudio.play();
    }

    getCoordinates() {
        return {
            top: this.element.offsetTop,
            right: this.element.offsetLeft + this.element.offsetWidth,
            bottom: this.element.offsetTop + this.element.offsetHeight,
            left: this.element.offsetLeft
        }
    }

    #getPosition() {
        return this.element.offsetLeft + this.element.offsetWidth / 2;
    }

    #eventListeners() {
        window.addEventListener('keydown', ({keyCode}) => {
            switch (keyCode) {
                case 37:
                    this.#leftArrow = true;
                    break;
                case 39:
                    this.#rightArrow = true;
                    break;
            }
        });

        window.addEventListener('keyup', ({keyCode}) => {
            switch (keyCode) {
                case 32:
                    this.#shot();
                    break;
                case 37:
                    this.#leftArrow = false;
                    break;
                case 39:
                    this.#rightArrow = false;
                    break;
            }
        });
    }

    #gameLoop = () => {
        this.#whatKey();
        requestAnimationFrame(this.#gameLoop);
    }

    #whatKey() {
        if (this.#leftArrow && this.#getPosition() > 12) {
            this.element.style.left = `${parseInt(this.element.style.left, 10) - this.#moveModifier}px`;
            this.element.style.transform = 'rotateY(-30deg)';
        }
        else if (this.#rightArrow && this.#getPosition() + 12 < window.innerWidth) {
            this.element.style.left = `${parseInt(this.element.style.left, 10) + this.#moveModifier}px`;
            this.element.style.transform = 'rotateY(30deg)';
        }
        else {
            this.element.style.transform = 'rotateY(0deg)';
        }
    }

    #shot() {
        if (this.#currentBullets <= 0) {
            setTimeout(1000);

            this.#currentBullets = this.#bulletsCount;
            return;
        }

        this.#currentBullets--;
        const missile = new Missile(this.#getPosition(), this.element.offsetTop, this.container);
        missile.init();
        this.missiles.push(missile);
        const shotAudio = new Audio('../sounds/singleshot.mp3');
        shotAudio.play();
    }
}