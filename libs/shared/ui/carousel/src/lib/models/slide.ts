import { Properties as CarouselProperties } from './interfaces';

export interface Properties {
    carouselProperties: CarouselProperties;
}

export class Slide {
    slideLength = 0;
    isSlideInProgress = false;
    direction: 'left' | 'right' | undefined;
    counter = 0;
    _counter = 0;
    distance = 0;
    distanceAbs = 0;
    visibleWidth!: number;
    isNotClickOnArrow = false;
    initialPositionX = 0;
    currentPositionX = 0;

    /* The slide length has been limited by the limitSlideLength() method */
    isSlideLengthLimited = false;

    get fullCellWidth(): number {
        return this.carouselProperties.cellWidth + this.carouselProperties.margin;
    }

    get margin(): number {
        return this.carouselProperties.margin;
    }

    get minSwipeDistance(): number {
        return this.carouselProperties.minSwipeDistance;
    }

    get numberOfVisibleCells(): number {
        return this.utils.numberOfVisibleCells;
    }

    get visibleCellsOverflowContainer(): any {
        return this.utils.visibleCellsOverflowContainer;
    }

    /* The position to which the container returns after each slide
     * in the light DUM tree mode.
     */
    get fixedContainerPosition(): number {
        return -(this.overflowCellsLimit * this.fullCellWidth);
    }

    get overflowCellsLimit(): number {
        return this.utils.overflowCellsLimit;
    }

    get images(): any {
        return this.carouselProperties.images;
    }

    /* Number of cell elements in the DUM tree */
    get cellLength(): number {
        if (this.isLightDOM) {
            return this.cells.cellLengthInLightDOMMode;
        } else {
            if (this.images) {
                return this.images.length;
            } else {
                return this.cells.cellLength;
            }
        }
    }

    get isLightDOM(): boolean {
        return this.carouselProperties.lightDOM || this.carouselProperties.loop;
    }

    constructor(private carouselProperties: CarouselProperties, private utils: any, private cells: any, private container: any) {
        this.init();
    }

    updateProperties(carouselProperties: CarouselProperties): void {
        this.carouselProperties = carouselProperties;
        this.setVisibleWidth();
    }

    init(): void {
        this.visibleWidth = this.carouselProperties.visibleWidth || this.carouselProperties.hostElement.clientWidth;
    }

    handleTouchstart(): void {
        /* Touchstart event is not called for arrow */
        this.isNotClickOnArrow = true;
        this.isSlideLengthLimited = false;

        if (!this.isSlideInProgress) {
            this.initialPositionX = this.container.getCurrentPositionX();
        }
    }

    handleTouchend(): void {
        if (!this.isNotClickOnArrow) {
            return;
        }
        this.currentPositionX = this.container.getCurrentPositionX();
        this.distanceAbs = Math.abs(this.initialPositionX - this.currentPositionX);
        this.distance = this.initialPositionX - this.currentPositionX;
        this.direction = this.getDirection();
        this.isNotClickOnArrow = false;
        this.handleSlide();
    }

    handleTransitionend(): void {
        this.setCounter();
        this.isSlideInProgress = false;

        if (this.isLightDOM) {
            this.alignContainerFast();
        }
    }

    handleSlide(customSlideLength: number | undefined = undefined): void {
        const isUsingButton = customSlideLength;
        let newPositionX;

        if ((isUsingButton && this.isSlideInProgress) || !this.direction) {
            return;
        }

        /* Custom slide length is used in arrows */
        if (customSlideLength) {
            this.slideLength = this.limitSlideLength(customSlideLength);

            if (!this.isSlideInProgress) {
                this.initialPositionX = this.container.getCurrentPositionX();
            }
        } else {
            this.slideLength = this.getSlideLength(this.distanceAbs);
        }

        /* Store intermediate counter value */
        this._counter = this.getPreliminaryCounter();

        if (this.direction === 'left') {
            if (!customSlideLength) {
                this.slideLength = this.limitSlideLength(this.getSlideLength(this.distanceAbs));
            }

            this._counter = this.getPreliminaryCounter();
            const isSlidesEnd = this.isSlidesEnd(this._counter);
            newPositionX = this.getPositionByIndex(this._counter);

            if (isSlidesEnd) {
                this._counter = this.counter;

                newPositionX = this.getPositionByIndex(this.counter);
                this.slideLength = 0;
            }
        }

        if (this.direction === 'right') {
            if (!customSlideLength) {
                this.slideLength = this.getSlideLength(this.distanceAbs);
            }

            if (this._counter < 0) {
                this._counter = this.counter;
                this.slideLength = this.counter;
            }

            newPositionX = this.getPositionByIndex(this.counter - this.slideLength);
        }

        if (this.container.getCurrentPositionX() !== newPositionX) {
            this.isSlideInProgress = true;
            this.container.transformPositionX(newPositionX);
        }
    }

    next(length: number = 1): void {
        this.direction = 'left';
        this.handleSlide(length);
    }

    prev(length: number = 1): void {
        this.direction = 'right';
        this.handleSlide(length);
    }

    select(index: number): void {
        if (index > this.cellLength - 1) {
            return;
        }

        if (index > this.counter) {
            const length = index - this.counter;
            this.next(length);
        }

        if (index < this.counter) {
            const length = this.counter - index;
            this.prev(length);
        }
    }

    getPreliminaryCounter(): number {
        if (this.direction === 'left') {
            return this.counter + this.slideLength;
        }

        if (this.direction === 'right') {
            return this.counter - this.slideLength;
        }

        return 0;
    }

    /*
     * Limits the length of the slide during calls to the next() and prev()
     * methods if the specified position is outside the cell length
     */
    limitSlideLength(slideLength: number): number {
        if (slideLength > 1) {
            for (let i = 0; i < slideLength; i++) {
                const newCounter = this.counter + (slideLength - i);

                if (!this.isSlidesEnd(newCounter)) {
                    slideLength = slideLength - i;
                    this.isSlideLengthLimited = i > 0;
                    break;
                }
            }
        }
        return slideLength;
    }

    /* Offset the container to show the last cell completely */
    getPositionCorrection(counter: number): number {
        let correction = 0;
        const isLastSlide = this.isLastSlide(counter);

        if (this.carouselProperties.loop || this.direction === 'right') {
            return 0;
        }

        if (this.isSlideLengthLimited || isLastSlide) {
            const cellsWidth = this.cells.cellLengthInLightDOMMode * this.fullCellWidth;

            if (this.visibleWidth < cellsWidth) {
                correction = -(this.numberOfVisibleCells * this.fullCellWidth - this.visibleWidth - this.margin);
            }

            if (correction >= -this.margin) {
                correction = 0;
            }
        }

        return correction;
    }

    getSlideLength(distanceAbs: number): number {
        const isLastSlide = this.isLastSlide(this.counter);

        /* If the last cell does not fit entirely, then the
         * length of the swipe to the left, from the extreme
         * right position, may be shorter than usual.
         */
        if (isLastSlide && this.direction === 'right') {
            distanceAbs = distanceAbs + (this.visibleWidth % this.fullCellWidth);
        }

        let length = Math.floor(distanceAbs / this.fullCellWidth);

        if (distanceAbs % this.fullCellWidth >= this.minSwipeDistance) {
            length++;
        }

        return length;
    }

    getDistanceAbs(): number {
        return Math.abs(this.initialPositionX - this.currentPositionX);
    }

    getDirection(): 'left' | 'right' | undefined {
        const direction = Math.sign(this.initialPositionX - this.currentPositionX);

        if (direction === -1) {
            return 'right';
        }
        if (direction === 1) {
            return 'left';
        }

        return undefined;
    }

    isSlidesEnd(counter: number): boolean {
        const margin = this.visibleCellsOverflowContainer ? 1 : 0;
        const imageLength = this.images ? this.images.length : this.cells.cellLength;

        if (this.carouselProperties.loop) {
            return false;
        } else {
            return imageLength - counter + margin < this.numberOfVisibleCells;
        }
    }

    isLastSlide(counter: number): boolean {
        return this.isSlidesEnd(counter + 1);
    }

    setCounter(): void {
        if (this.direction === 'left') {
            this.counter = this.counter + this.slideLength;
        }

        if (this.direction === 'right') {
            this.counter = this.counter - this.slideLength;
        }
    }

    getPositionByIndex(_counter: number): number {
        let correction = this.getPositionCorrection(this.counter + this.slideLength);
        let position;

        if (correction !== 0) {
            correction = correction + this.fullCellWidth;
        }

        if (this.direction === 'right') {
            correction = 0;
        }

        if ((this.isLightDOM && this.isLightDOMMode(_counter)) || (this.isLightDOM && this.ifLeftDOMModeAtEnd(_counter))) {
            const initialPosition = this.getPositionWithoutCorrection(this.initialPositionX);
            const counterDifference = _counter - this.counter;
            position = initialPosition - (counterDifference * this.fullCellWidth - correction);
        } else {
            position = -(_counter * this.fullCellWidth - correction);
        }

        position = this.provideSafePosition(position);

        return position;
    }

    provideSafePosition(position: number): number {
        const endPosition = this.container.getEndPosition();

        if (this.direction === 'left') {
            if (position > 0) {
                position = 0;
            }
        }

        if (this.direction === 'right') {
            if (position < endPosition) {
                position = endPosition;
            }
        }

        return position;
    }

    getPositionWithoutCorrection(value: number): number {
        const remainder = Math.round(value) % this.fullCellWidth;

        if (remainder !== 0) {
            return value - (this.fullCellWidth + remainder);
        } else {
            return value;
        }
    }

    isNextArrowDisabled(): boolean {
        return (
            this.isLastSlide(this.counter) ||
            (!this.visibleCellsOverflowContainer && this.cellLength <= this.numberOfVisibleCells) ||
            (this.visibleCellsOverflowContainer && this.cellLength < this.numberOfVisibleCells)
        );
    }

    isPrevArrowDisabled(): boolean {
        return this.counter === 0;
    }

    alignContainerFast(): void {
        if (this.isLightDOMMode(this.counter)) {
            const positionX = this.fixedContainerPosition;
            this.container.transformPositionX(positionX, 0);

            this.cells.setCounter(this.counter);
            this.cells.lineUp();
        } else if (this.ifLeftDOMModeToBeginning(this.counter)) {
            /* If we have already exited the light DOM mode but
             * the cells are still out of place
             */
            if (this.cells.ifSequenceOfCellsIsChanged()) {
                const positionX = -(this.counter * this.fullCellWidth);
                this.container.transformPositionX(positionX, 0);

                this.cells.setCounter(this.counter);
                this.cells.lineUp();
            }
        } else if (this.ifLeftDOMModeAtEnd(this.counter)) {
            const containerPositionX = this.container.getCurrentPositionX();
            const containerWidth = this.container.getWidth();
            this.visibleWidth;

            if (this.isLastSlide(this.counter) && containerWidth + containerPositionX >= this.visibleWidth) {
                return;
            }

            let correction = this.getPositionCorrection(this.counter);

            if (correction !== 0) {
                correction = correction + this.fullCellWidth;
            }

            if (this.direction === 'right') {
                correction = 0;
            }

            const positionX = this.fixedContainerPosition + correction;

            this.container.transformPositionX(positionX, 0);
            this.cells.setCounter(this.counter);
            this.cells.lineUp();
        }
    }

    isLightDOMMode(counter: number): boolean | undefined {
        let flag;
        const remainderOfCells = this.images.length - this.overflowCellsLimit - this.numberOfVisibleCells;

        if (!this.isLightDOM) {
            return false;
        }

        if (counter > this.overflowCellsLimit && this.direction === 'left' && counter <= remainderOfCells) {
            flag = true;
        }

        if (counter >= this.overflowCellsLimit && this.direction === 'right' && counter < remainderOfCells) {
            flag = true;
        }

        if (this.counter > this.overflowCellsLimit && this.direction === 'left' && this.counter <= remainderOfCells) {
            flag = true;
        }

        if (this.counter >= this.overflowCellsLimit && this.direction === 'right' && this.counter < remainderOfCells) {
            flag = true;
        }

        return flag;
    }

    ifLeftDOMModeAtEnd(counter: number): boolean | undefined {
        let flag;
        const remainderOfCells = this.images.length - this.overflowCellsLimit - this.numberOfVisibleCells;

        if (counter >= remainderOfCells) {
            flag = true;
        }

        if (this.counter >= remainderOfCells) {
            flag = true;
        }

        return flag;
    }

    ifLeftDOMModeToBeginning(counter: number): boolean | undefined {
        let flag;

        if (counter <= this.overflowCellsLimit) {
            flag = true;
        }

        if (this.counter <= this.overflowCellsLimit) {
            flag = true;
        }

        return flag;
    }

    setVisibleWidth(): void {
        this.visibleWidth = this.carouselProperties.visibleWidth || this.carouselProperties.hostElement.clientWidth;
    }
}
