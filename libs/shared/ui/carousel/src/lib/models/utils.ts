import { Properties as CarouselProperties } from './interfaces';

export class Utils {
    get images(): any {
        return this.carouselProperties.images;
    }

    get margin(): number {
        return this.carouselProperties.margin;
    }

    get overflowCellsLimit(): number {
        if (this.images && this.isImagesLessCellLimit) {
            let overflowCellsLimit = Math.floor((this.images.length - this.numberOfVisibleCells) / 2);

            if (overflowCellsLimit < 0) {
                overflowCellsLimit = 0;
            }

            return overflowCellsLimit;
        } else {
            return this.carouselProperties.overflowCellsLimit;
        }
    }

    get isImagesLessCellLimit(): boolean {
        return this.carouselProperties.overflowCellsLimit * 2 + this.numberOfVisibleCells > this.images.length;
    }

    get numberOfVisibleCells(): number {
        return Math.ceil(this.visibleWidth / this.fullCellWidth);
    }

    get visibleCellsOverflowContainer(): boolean {
        return this.numberOfVisibleCells * this.fullCellWidth - this.margin > this.visibleWidth;
    }

    get fullCellWidth(): number {
        return this.carouselProperties.cellWidth + this.carouselProperties.margin;
    }

    get visibleWidth(): number {
        return <number>this.carouselProperties.visibleWidth || <number>this.carouselProperties?.cellsElement?.parentElement?.clientWidth;
    }

    constructor(private carouselProperties: CarouselProperties) {}

    updateProperties(carouselProperties: CarouselProperties): void {
        this.carouselProperties = carouselProperties;
    }

    getStartX(event: any): number {
        const touches = event.touches;
        const carouselElementPosition = this.getCarouselElementPosition()['left'];
        let startX;

        if (touches) {
            startX = touches[0].clientX - carouselElementPosition;
        } else {
            startX = event.clientX - carouselElementPosition;
        }

        return startX;
    }

    getMoveX(event: any): number {
        const touches = event.touches;
        const carouselElementPositionX = this.getCarouselElementPosition()['left'];

        if (touches) {
            return touches[0].clientX - carouselElementPositionX;
        } else {
            return event.clientX - carouselElementPositionX;
        }
    }

    getCarouselElementPosition(): DOMRect {
        return this.carouselProperties.hostElement.getBoundingClientRect();
    }
}
