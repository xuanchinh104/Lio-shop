import { Properties } from './interfaces';

export class Carousel {
    cellsElement: HTMLElement | undefined;

    /* The slide length has been limited by the limitSlideLength() method */
    isSlideLengthLimited = false;

    isContentImages = true;
    visibleWidth!: number | undefined;
    isLazyLoad = true;
    isContainerLocked = true;
    alignCells: 'left' | 'center' = 'left';
    initialContainerPosition = 0;
    autoplayId: any;
    containerPullLimit = 100;

    get cellLength(): number {
        return this.cells.cellLength;
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

    get lastCellIndex(): number {
        return this.images.length ? this.images.length - 1 : this.cells.cellLength - 1;
    }

    get overflowCellsLimit(): number {
        return this.utils.overflowCellsLimit;
    }

    get cellLimit(): number {
        if (this.isLightDOM) {
            let cellLimit = this.numberOfVisibleCells + this.overflowCellsLimit * 2;

            if (cellLimit < this.numberOfVisibleCells) {
                cellLimit = this.numberOfVisibleCells;
            }

            return cellLimit;
        } else {
            return this.properties.images.length;
        }
    }

    get isLightDOM(): boolean {
        return this.properties.lightDOM || this.properties.loop;
    }

    get images(): any {
        return this.properties.images;
    }

    get margin(): number {
        return this.properties.margin;
    }

    get minSwipeDistance(): number {
        return this.properties.minSwipeDistance;
    }

    get transitionDuration(): number {
        return this.properties.transitionDuration;
    }

    get transitionTimingFunction(): string {
        return this.properties.transitionTimingFunction;
    }

    get fullCellWidth(): number {
        return this.properties.cellWidth + this.margin;
    }

    get numberOfVisibleCells(): number {
        return this.utils.numberOfVisibleCells;
    }

    get lapCounter(): number {
        return Math.floor(this.slide.counter / this.cellLengthInLightDOMMode);
    }

    get slideCounter(): number {
        return this.slide.counter;
    }

    constructor(private properties: Properties, private utils: any, private cells: any, private container: any, private slide: any) {
        this.init();
    }

    updateProperties(properties: Properties): void {
        this.properties = properties;
    }

    init(): void {
        this.cellsElement = this.properties.cellsElement;
        this.visibleWidth = this.properties.visibleWidth || this.cellsElement?.parentElement?.clientWidth;
    }

    destroy(): void {
        clearInterval(this.autoplayId);
    }

    lineUpCells(): void {
        this.cells.lineUp();
    }

    handleTouchstart = (event: any): any => {
        this.container.handleTouchstart();
        this.slide.handleTouchstart(event);
    };

    handleHorizontalSwipe = (event: any): any => {
        this.container.handleHorizontalSwipe();
    };

    handleTouchend = (event: any): any => {
        if (this.properties.freeScroll) {
            this.container.handleTouchend();
        } else {
            this.container.handleTouchend(true);
            this.slide.handleTouchend(event);
        }
    };

    handleTransitionend(): void {
        this.slide.handleTransitionend();
    }

    getImage(index: number): any {
        return this.cells.getImage(index);
    }

    next(length: number = 1): void {
        if (!this.isNextArrowDisabled()) {
            this.slide.next(length);
        }
    }

    prev(length: number = 1): void {
        this.slide.prev(length);
    }

    isNextArrowDisabled = (): boolean => this.slide.isNextArrowDisabled();

    isPrevArrowDisabled = (): boolean => this.slide.isPrevArrowDisabled();

    autoplay(): void {
        this.autoplayId = setInterval(() => {
            this.next();
        }, this.properties.autoplayInterval);
    }

    stopAutoplay(): void {
        if (this.autoplayId) {
            clearInterval(this.autoplayId);
        }
    }
}
