import { Properties as CarouselProperties } from './interfaces';

export class Container {
    /* The index of the new position relative to
     * the active index, for example -1 or +1
     */
    newPositionIndex = 0;
    isPositionCorrection = false;
    initialPositionX = 0;
    initialElementPositionX = 0;
    isLocked = true;
    pullLimit = 100;
    startTime = 0;
    startX = 0;
    moveX = 0;
    isSwipeInProgress = false;

    get visibleWidth(): number {
        return this.utils.visibleWidth;
    }

    get overflowCellsLimit(): number {
        return this.utils.overflowCellsLimit;
    }

    get images(): any {
        return this.carouselProperties.images;
    }

    get element(): HTMLElement {
        return this.carouselProperties.cellsElement;
    }

    get freeScroll(): boolean {
        return this.carouselProperties.freeScroll;
    }

    get fullCellWidth(): number {
        return this.carouselProperties.cellWidth + this.carouselProperties.margin;
    }

    get numberOfVisibleCells(): number {
        return this.utils.numberOfVisibleCells;
    }

    get transitionDuration(): number {
        return this.carouselProperties.transitionDuration;
    }

    get transitionTimingFunction(): string {
        return this.carouselProperties.transitionTimingFunction;
    }

    get cellLength(): number {
        if (this.images) {
            return this.images.length;
        } else {
            return this.cells.cellLength;
        }
    }

    get cellLengthInLightDOMMode(): number {
        if (this.images) {
            let cellLength = this.numberOfVisibleCells + this.overflowCellsLimit * 2;
            if (cellLength > this.images.length) {
                cellLength = this.images.length;
            }
            return cellLength;
        } else {
            return this.cellLength;
        }
    }

    get tooFewCells(): boolean {
        return this.numberOfVisibleCells > this.cellLength;
    }

    get disabled(): boolean {
        return this.tooFewCells;
    }

    get margin(): number {
        return this.carouselProperties.margin;
    }

    get isLightDOM(): boolean {
        return this.carouselProperties.lightDOM || this.carouselProperties.loop;
    }

    constructor(private carouselProperties: CarouselProperties, private utils: any, private cells: any) {
        this.init();
    }

    updateProperties(carouselProperties: CarouselProperties): void {
        this.carouselProperties = carouselProperties;
    }

    init(): void {
        this.setWidth();
    }

    handleTouchstart(): void {
        this.startX = this.utils.getStartX(event);
        this.startTime = new Date().getTime();
        this.initialElementPositionX = this.getInitialElementPositionX();
    }

    handleHorizontalSwipe(): void {
        if (this.disabled) {
            return;
        }

        if (!this.isSwipeInProgress) {
            this.startX = this.utils.getStartX(event);
            this.startTime = new Date().getTime();
            this.initialElementPositionX = this.getInitialElementPositionX();
        }

        this.isSwipeInProgress = true;
        this.moveX = this.utils.getMoveX(event);
        this.move();
    }

    handleTouchend(simpleProcessing: boolean = false): void {
        if (this.disabled) {
            return;
        }

        /* If touchend was passed to the Slide class */
        if (simpleProcessing) {
            this.isSwipeInProgress = false;
            return;
        }

        this.isSwipeInProgress = false;
        this.finishMoving();
        this.clearInitialValues();
    }

    move(): void {
        let positionX: number = this.getMovePositionX();
        const isPulled = this.detectPulled();
        const direction = this.getDirection();

        if (isPulled) {
            if ((isPulled.edge === 'left' && direction === 'right') || (isPulled.edge === 'right' && direction === 'left')) {
                positionX = this.slowdownOnPull(positionX);
            }
        }

        this.transformPositionX(positionX, 0);

        if (this.freeScroll) {
            this.initialPositionX = positionX;
        }

        if (isPulled) {
            if (isPulled.edge === 'left' && isPulled.overflowX > this.pullLimit) {
                this.initialPositionX = 0;
            }
            if (isPulled.edge === 'right' && isPulled.overflowX > this.pullLimit) {
                this.initialPositionX = positionX;
            }
        }
    }

    getMovePositionX(): number {
        const distance = this.getDistance();
        return this.initialElementPositionX - distance;
    }

    getDistance(): number {
        return this.startX - this.moveX;
    }

    /* If the container is pulled out of the left or right border */
    detectPulled(): any {
        const currentPositionX = this.getCurrentPositionX();

        if (currentPositionX > 0) {
            return {
                edge: 'left',
                positionX: currentPositionX,
                overflowX: Math.abs(currentPositionX),
            };
        }

        if (currentPositionX < this.getEndPosition()) {
            return {
                edge: 'right',
                positionX: currentPositionX,
                overflowX: Math.abs(currentPositionX - this.getEndPosition()),
            };
        }

        return undefined;
    }

    slowdownOnPull(_positionX: number): number {
        let distance = Math.abs(this.getDistance());
        const endPosition = this.getEndPosition();
        const isPulled = this.detectPulled();

        if (!isPulled) {
            return 0;
        }

        const decelerationRatio = 3 + isPulled.overflowX / 50;
        let positionX = 0;

        if (isPulled.edge === 'left') {
            if (this.initialElementPositionX < 0) {
                distance = distance - Math.abs(this.initialElementPositionX);
            }

            const rubberPositionX = distance / decelerationRatio;
            positionX = rubberPositionX;

            if (this.initialElementPositionX > 0) {
                positionX = this.initialElementPositionX + rubberPositionX;
            }

            if (positionX > this.pullLimit) {
                positionX = this.pullLimit;
            }
        }

        if (isPulled.edge === 'right') {
            const rubberPositionX = endPosition + (this.initialElementPositionX - distance - endPosition) / decelerationRatio;
            const containerWidth = this.getWidth();

            positionX = rubberPositionX;

            if (this.initialElementPositionX < -(containerWidth - this.visibleWidth)) {
                positionX = containerWidth - this.visibleWidth + this.initialElementPositionX + rubberPositionX;
            }

            if (positionX < endPosition - this.pullLimit) {
                positionX = endPosition - this.pullLimit;
            }
        }

        return positionX;
    }

    finishMoving(): void {
        const positionX = this.getMovePositionX();
        let newPositionX = 0;

        if (this.freeScroll) {
            newPositionX = this.getInertia();
        }

        /* Align container while pulling */
        newPositionX = this.getAlignedPositionOnPull(newPositionX);

        this.transformPositionX(newPositionX);
        this.setInitialPosition(positionX);
    }

    /* Returns the new position of the container with inertia */
    getInertia(): number {
        const distance = this.getDistance();
        const currentTime = new Date().getTime();
        const tapLength = currentTime - this.startTime;
        const inertia = (distance / tapLength) * 100;

        return this.initialPositionX - inertia;
    }

    getAlignedPositionOnPull(newPositionX: number): number {
        const direction = this.getDirection();

        if (direction === 'left') {
            const endPosition = this.getEndPosition();
            if (newPositionX < endPosition) {
                return endPosition;
            }
        }
        if (direction === 'right') {
            if (newPositionX > 0) {
                return 0;
            }
        }

        return newPositionX;
    }

    getCurrentPositionX(): number {
        const parentPosition = this.element?.parentElement?.getBoundingClientRect();
        const position = this.element.getBoundingClientRect();
        if (parentPosition) {
            return position.left - parentPosition.left;
        }
        return 0;
    }

    getEndPosition(): number {
        if (this.isLightDOM) {
            const imagesInContainer = this.cells.imageUtils.getImages();
            return -(imagesInContainer.length * this.fullCellWidth - this.visibleWidth - this.margin);
        } else {
            const width = this.getWidth();
            const visibleWidth = this.element?.parentElement?.clientWidth;
            if (visibleWidth) {
                return visibleWidth - width;
            }
            return 0;
        }
    }

    transformPositionX(value: number, duration = this.transitionDuration): void {
        if (value === undefined) {
            return;
        }

        this.element.style.transition = 'transform ' + duration + 'ms ' + this.transitionTimingFunction;
        this.element.style.transform = 'translateX(' + value + 'px)';
    }

    getWidth(): number {
        let width = this.cellLengthInLightDOMMode * this.fullCellWidth;
        const totalImageWidth = this.cellLength * this.fullCellWidth;

        if (totalImageWidth < width) {
            width = totalImageWidth;
        }

        return this.isLightDOM ? width : totalImageWidth;
    }

    setWidth(): void {
        const width = this.getWidth();
        this.element.style.width = width + 'px';
    }

    setInitialPosition(position: number): void {
        this.initialPositionX = position;
    }

    getElementPosition(): DOMRect {
        return this.element.getBoundingClientRect();
    }

    getInitialElementPositionX(): any {
        const carouselElementPosition = this.utils.getCarouselElementPosition()['left'];
        return this.getElementPosition()['left'] - carouselElementPosition;
    }

    clearInitialValues(): void {
        this.startX = this.moveX = 0;
    }

    getDirection(): string | undefined {
        const direction = Math.sign(this.startX - this.moveX);

        if (direction === -1) {
            return 'right';
        }
        if (direction === 1) {
            return 'left';
        }

        return undefined;
    }
}
