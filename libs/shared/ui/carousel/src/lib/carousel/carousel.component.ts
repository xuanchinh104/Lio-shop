import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    HostBinding,
    HostListener,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
} from '@angular/core';

import { Images, Properties as CarouselProperties } from '../models/interfaces';
import { Touches } from '../models/touchs';
import { Carousel } from '../models/carousel';
import { Container } from '../models/container';
import { Cells } from '../models/cells';
import { Slide } from '../models/slide';
import { Utils } from '../models/utils';

@Component({
    selector: 'ui-carousel, [carousel]',
    templateUrl: './carousel.component.html',
    styleUrls: ['./carousel.component.sass'],
})
export class CarouselComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {
    carousel: any;
    container: any;
    utils: any;
    cells: any;
    slide: any;
    _id!: string;
    _images!: Images;
    touches: any;
    landscapeMode: any;
    minTimeout = 30;
    isVideoPlaying = false;
    _isCounter = false;
    _width!: number;
    _cellWidth: number | '100%' = 200;
    _loop = false;
    _lightDOM = false;
    isMoving = false;
    isNgContent = false;
    cellLength!: number;
    dotsArr: any;
    carouselProperties!: CarouselProperties;
    savedCarouselWidth!: number;

    get isContainerLocked(): boolean {
        if (!this.carousel) {
            return false;
        }
        return this.carousel.isContainerLocked;
    }

    get slideCounter(): number {
        return this.carousel?.slideCounter;
    }

    get lapCounter(): number | undefined {
        if (!this.carousel) {
            return;
        }

        return this.carousel.lapCounter;
    }

    get isLandscape(): boolean {
        return window.innerWidth > window.innerHeight;
    }

    get isSafari(): boolean {
        const ua = navigator.userAgent.toLowerCase();
        if (ua.indexOf('safari') !== -1) {
            return !(ua.indexOf('chrome') > -1);
        }

        return false;
    }

    get counter(): string {
        let counter;

        if (this.loop) {
            counter = this.slideCounter % this.cellLength;
        } else {
            counter = this.slideCounter;
        }

        return counter + 1 + this.counterSeparator + this.cellLength;
    }

    get cellsElement(): HTMLElement {
        return this.elementRef.nativeElement.querySelector('.carousel-cells');
    }

    get isArrows(): boolean {
        return this.arrows && !this.freeScroll;
    }

    get isCounter(): boolean {
        return this._isCounter && this.cellLength > 1;
    }

    get activeDotIndex(): number {
        return this.slideCounter % this.cellLength;
    }

    get cellLimit(): number {
        return this.carousel.cellLimit;
    }

    get carouselWidth(): number {
        return this.elementRef.nativeElement.clientWidth;
    }

    @Output() events: EventEmitter<any> = new EventEmitter<any>();

    @Input() id!: number;
    @Input() height = 200;
    @Input() width!: number;
    @Input() autoplay = false;
    @Input() autoplayInterval = 5000;
    @Input() pauseOnHover = true;
    @Input() dots = false;
    @Input() borderRadius!: number;
    @Input() margin = 10;
    @Input() objectFit: 'contain' | 'cover' | 'none' = 'cover';
    @Input() minSwipeDistance = 10;
    @Input() transitionDuration = 200;
    @Input() transitionTimingFunction: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear' = 'ease-out';
    @Input() videoProperties: any;
    @Input() counterSeparator = ' / ';
    @Input() overflowCellsLimit = 3;
    @Input() listeners: 'auto' | 'mouse and touch' = 'mouse and touch';
    @Input() cellsToShow!: number;
    @Input() cellsToScroll = 1;
    @Input() freeScroll = false;
    @Input() arrows = true;
    @Input() arrowsOutside = false;
    @Input() arrowsTheme: 'light' | 'dark' = 'light';

    @Input()
    set images(images: Images & any) {
        this._images = images;
    }

    get images(): any {
        return this._images;
    }

    @Input() set cellWidth(value: number | '100%') {
        if (value) {
            this._cellWidth = value;
        }
    }

    // eslint-disable-next-line @typescript-eslint/adjacent-overload-signatures
    @Input() set isCounter(value: boolean) {
        if (value) {
            this._isCounter = value;
        }
    }

    @Input() set loop(value: boolean) {
        if (value) {
            this._loop = value;
        }
    }

    get loop(): boolean {
        if (this.images) {
            return this._loop;
        } else {
            return false;
        }
    }

    @Input() set lightDOM(value: boolean) {
        if (value) {
            this._lightDOM = value;
        }
    }

    get lightDOM(): boolean {
        if (this.images) {
            return this._lightDOM;
        } else {
            return false;
        }
    }

    @HostBinding('class.carousel') hostClassCarousel = true;
    @HostBinding('style.height') hostStyleHeight!: string;
    @HostBinding('style.width') hostStyleWidth!: string;

    @HostListener('window:resize', ['$event'])
    onWindowResize(event: any): void {
        if (this.utils.visibleWidth !== this.savedCarouselWidth) {
            this.resize();
        }
    }

    @HostListener('mousemove', ['$event'])
    onMousemove(event: MouseEvent): void {
        if (this.autoplay && this.pauseOnHover) {
            this.carousel.stopAutoplay();
        }
    }

    @HostListener('mouseleave', ['$event'])
    onMouseleave(event: MouseEvent): void {
        if (this.autoplay && this.pauseOnHover) {
            this.carousel.autoplay();
        }
    }

    constructor(private elementRef: ElementRef, private ref: ChangeDetectorRef) {}

    ngOnInit(): void {
        this.isNgContent = this.cellsElement.children.length > 0;

        this.touches = new Touches({
            element: this.cellsElement,
            listeners: this.listeners,
            mouseListeners: {
                mousedown: 'handleMousedown',
                mouseup: 'handleMouseup',
            },
        });

        this.touches.on('touchstart', this.handleTouchstart);
        this.touches.on('horizontal-swipe', this.handleHorizontalSwipe);
        this.touches.on('touchend', this.handleTouchend);
        this.touches.on('mousedown', this.handleTouchstart);
        this.touches.on('mouseup', this.handleTouchend);
        this.touches.on('tap', this.handleTap);

        this.setDimensions();
    }

    ngAfterViewInit(): void {
        this.initCarousel();
        this.cellLength = this.getCellLength();
        this.dotsArr = Array(this.cellLength).fill(1);
        this.ref.detectChanges();
        this.carousel.lineUpCells();
        this.savedCarouselWidth = this.carouselWidth;

        /* Start detecting changes in the DOM tree */
        this.detectDomChanges();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.width || changes.height || changes.images) {
            this.setDimensions();
            this.initCarousel();
            this.carousel.lineUpCells();
            this.ref.detectChanges();
        }
    }

    ngOnDestroy(): void {
        this.touches.destroy();
        // this.carousel.destroy();
    }

    initCarousel(): void {
        this.carouselProperties = {
            id: this.id,
            cellsElement: this.elementRef.nativeElement.querySelector('.carousel-cells'),
            hostElement: this.elementRef.nativeElement,
            images: this.images,
            cellWidth: this.getCellWidth(),
            loop: this.loop,
            autoplayInterval: this.autoplayInterval,
            overflowCellsLimit: this.overflowCellsLimit,
            visibleWidth: this.width,
            margin: this.margin,
            minSwipeDistance: this.minSwipeDistance,
            transitionDuration: this.transitionDuration,
            transitionTimingFunction: this.transitionTimingFunction,
            videoProperties: this.videoProperties,
            eventHandler: this.events,
            freeScroll: this.freeScroll,
            lightDOM: this.lightDOM,
        };

        this.utils = new Utils(this.carouselProperties);
        this.cells = new Cells(this.carouselProperties, this.utils);
        this.container = new Container(this.carouselProperties, this.utils, this.cells);
        this.slide = new Slide(this.carouselProperties, this.utils, this.cells, this.container);
        this.carousel = new Carousel(this.carouselProperties, this.utils, this.cells, this.container, this.slide);

        if (this.autoplay) {
            this.carousel.autoplay();
        }
    }

    resize(): void {
        this.landscapeMode = this.isLandscape;
        this.savedCarouselWidth = this.carouselWidth;

        this.carouselProperties.cellWidth = this.getCellWidth();
        this.cells.updateProperties(this.carouselProperties);
        this.carousel.updateProperties(this.carouselProperties);
        this.container.updateProperties(this.carouselProperties);
        this.slide.updateProperties(this.carouselProperties);
        this.utils.updateProperties(this.carouselProperties);
        this.carousel.lineUpCells();
        this.slide.select(0);
        this.ref.detectChanges();
    }

    detectDomChanges(): void {
        const observer = new MutationObserver(mutations => {
            this.onDomChanges();
        });

        const config = {
            attributes: true,
            childList: true,
            characterData: true,
        };
        observer.observe(this.cellsElement, config);
    }

    onDomChanges(): void {
        this.cellLength = this.getCellLength();
        this.carousel.lineUpCells();
        this.ref.detectChanges();
    }

    setDimensions(): void {
        this.hostStyleHeight = this.height + 'px';
        this.hostStyleWidth = this.width + 'px';
    }

    getImage(index: number): any {
        return this.carousel.getImage(index);
    }

    handleTouchstart = (event: any): void => {
        this.touches.addEventListeners('mousemove', 'handleMousemove');
        this.carousel.handleTouchstart(event);
        this.isMoving = true;
    };

    handleHorizontalSwipe = (event: any): void => {
        event.preventDefault();
        this.carousel.handleHorizontalSwipe(event);
    };

    handleTouchend = (event: any): void => {
        const touches = event.touches;
        this.carousel.handleTouchend(event);
        this.touches.removeEventListeners('mousemove', 'handleMousemove');
        this.isMoving = false;
    };

    handleTap = (event: any): void => {
        const outboundEvent: any = {
            name: 'click',
        };
        const nodes = Array.prototype.slice.call(this.cellsElement.children);
        const cellElement = event.srcElement.closest('.carousel-cell');
        const i = nodes.indexOf(cellElement);
        const cellIndex = nodes.indexOf(cellElement);

        if (this.images) {
            // outboundEvent.fileIndex = this.carousel.getFileIndex(i);
            // outboundEvent.file = this.carousel.getFile(cellIndex);
        } else {
            outboundEvent.cellIndex = cellIndex;
        }
    };

    handleTransitionendCellContainer(event: any): void {
        if (event.target['className'] === 'carousel-cells') {
            this.carousel.handleTransitionend();
        }
    }

    getCellWidth(): number {
        const elementWidth = this.carouselWidth;

        if (this.cellsToShow) {
            const margin = this.cellsToShow > 1 ? this.margin : 0;
            const totalMargin = margin * (this.cellsToShow - 1);
            return (elementWidth - totalMargin) / this.cellsToShow;
        }

        if (this._cellWidth === '100%') {
            return elementWidth;
        } else {
            return this._cellWidth;
        }
    }

    next(): void {
        this.carousel.next(this.cellsToScroll);
        this.carousel.stopAutoplay();
    }

    prev(): void {
        this.carousel.prev(this.cellsToScroll);
        this.carousel.stopAutoplay();
    }

    isNextArrowDisabled(): boolean | undefined {
        if (!this.carousel) {
            return;
        }
        return this.carousel.isNextArrowDisabled();
    }

    isPrevArrowDisabled(): boolean | undefined {
        if (!this.carousel) {
            return;
        }
        return this.carousel.isPrevArrowDisabled();
    }

    getCellLength(): number {
        if (this.images) {
            return this.images.length;
        } else {
            return this.cellsElement.children.length;
        }
    }
}
