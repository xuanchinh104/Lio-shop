import {
    Component,
    OnDestroy,
    Input,
    OnInit,
    OnChanges,
    SimpleChange,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    HostListener,
    ViewChild,
    ElementRef,
} from '@angular/core';
import { AscSpinnerService } from './asc-spinner.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LOADERS, DEFAULTS, Size, AscSpinner, PRIMARY_SPINNER } from './asc-spinner.enum';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { SafeAny } from '@asc/shared/utils';

@Component({
    selector: 'asc-spinner',
    templateUrl: 'asc-spinner.component.html',
    styleUrls: ['asc-spinner.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('fadeIn', [
            state('in', style({ opacity: 1 })),
            transition(':enter', [style({ opacity: 0 }), animate(300)]),
            transition(':leave', animate(200, style({ opacity: 0 }))),
        ]),
    ],
})
export class AscSpinnerComponent implements OnDestroy, OnInit, OnChanges {
    /**
     * To set backdrop color
     * Only supports RGBA color format
     * @memberof NgxSpinnerComponent
     */
    @Input() bdColor: string;
    /**
     * To set spinner size
     *
     * @memberof NgxSpinnerComponent
     */
    @Input() size: Size;
    /**
     * To set spinner color(DEFAULTS.SPINNER_COLOR)
     *
     * @memberof NgxSpinnerComponent
     */
    @Input() color: string;
    /**
     * To set type of spinner
     *
     * @memberof NgxSpinnerComponent
     */
    @Input() type: string;
    /**
     * To toggle fullscreen mode
     *
     * @memberof NgxSpinnerComponent
     */
    @Input() fullScreen: boolean;
    /**
     * Spinner name
     *
     * @memberof NgxSpinnerComponent
     */
    @Input() name: string;
    /**
     * z-index value
     *
     * @memberof NgxSpinnerComponent
     */
    @Input() zIndex: number;
    /**
     * Custom template for spinner/loader
     *
     * @memberof NgxSpinnerComponent
     */
    @Input() template?: string;
    /**
     * Show/Hide the spinner
     *
     * @type {boolean}
     * @memberof NgxSpinnerComponent
     */
    @Input() showSpinner: boolean;

    /**
     * To enable/disable animation
     *
     * @type {boolean}
     * @memberof NgxSpinnerComponent
     */
    @Input() disableAnimation = false;
    /**
     * Spinner Object
     *
     * @memberof NgxSpinnerComponent
     */
    spinner: AscSpinner = new AscSpinner();
    /**
     * Array for spinner's div
     *
     * @memberof NgxSpinnerComponent
     */
    divArray: Array<number>;
    /**
     * Counter for div
     *
     * @memberof NgxSpinnerComponent
     *
     */
    divCount: number;
    /**
     * Show spinner
     *
     * @memberof NgxSpinnerComponent
     **/
    show: boolean;
    /**
     * Unsubscribe from spinner's observable
     *
     * @memberof NgxSpinnerComponent
     **/
    ngUnsubscribe: Subject<void> = new Subject();
    /**
     * Element Reference
     *
     * @memberof NgxSpinnerComponent
     */
    @ViewChild('overlay') spinnerDOM: SafeAny;

    @HostListener('document:keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent): void {
        if (this.spinnerDOM?.nativeElement) {
            if (this.fullScreen || (!this.fullScreen && this.isSpinnerZone(event.target))) {
                event.returnValue = false;
                event.preventDefault();
            }
        }
    }

    /**
     * Creates an instance of NgxSpinnerComponent.
     *
     * @memberof NgxSpinnerComponent
     */
    constructor(private spinnerService: AscSpinnerService, private changeDetector: ChangeDetectorRef, private elementRef: ElementRef) {
        this.bdColor = DEFAULTS.BD_COLOR;
        this.zIndex = DEFAULTS.Z_INDEX;
        this.color = DEFAULTS.SPINNER_COLOR;
        this.type = DEFAULTS.SPINNER_TYPE;
        this.size = 'large';
        this.fullScreen = true;
        this.name = PRIMARY_SPINNER;
        // this.template = null;
        this.showSpinner = false;

        this.divArray = [];
        this.divCount = 0;
        this.show = false;
    }
    /**
     * Initialization method
     *
     * @memberof NgxSpinnerComponent
     */
    ngOnInit(): void {
        this.setDefaultOptions();
        this.spinnerService
            .getSpinner(this.name)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((spinner: AscSpinner) => {
                this.setDefaultOptions();
                Object.assign(this.spinner, spinner);
                if (spinner.show) {
                    this.onInputChange();
                }
                this.changeDetector.detectChanges();
            });
    }

    /**
     * To check event triggers inside the Spinner Zone
     *
     * @param {*} element
     * @returns {boolean}
     * @memberof NgxSpinnerComponent
     */
    isSpinnerZone(element: SafeAny): boolean {
        if (element === this.elementRef.nativeElement.parentElement) {
            return true;
        }
        return element.parentNode && this.isSpinnerZone(element.parentNode);
    }

    /**
     * To set default ngx-spinner options
     *
     * @memberof NgxSpinnerComponent
     */
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    setDefaultOptions = () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.spinner = new AscSpinner({
            name: this.name,
            bdColor: this.bdColor,
            size: this.size,
            color: this.color,
            type: this.type,
            fullScreen: this.fullScreen,
            divArray: this.divArray,
            divCount: this.divCount,
            show: this.show,
            zIndex: this.zIndex,
            template: this.template,
            showSpinner: this.showSpinner,
        });
    };
    /**
     * On changes event for input variables
     *
     * @memberof NgxSpinnerComponent
     */
    ngOnChanges(changes: { [propKey: string]: SimpleChange }): void {
        for (const propName in changes) {
            if (propName) {
                const changedProp = changes[propName];
                if (changedProp.isFirstChange()) {
                    return;
                } else if (typeof changedProp.currentValue !== 'undefined' && changedProp.currentValue !== changedProp.previousValue) {
                    if (changedProp.currentValue !== '') {
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        this.spinner[propName] = changedProp.currentValue;
                        if (propName === 'showSpinner') {
                            if (changedProp.currentValue) {
                                this.spinnerService.show(this.spinner.name, this.spinner);
                            } else {
                                this.spinnerService.hide(this.spinner.name);
                            }
                        }
                    }
                }
            }
        }
    }
    /**
     * To get class for spinner
     *
     * @memberof NgxSpinnerComponent
     */
    getClass(type: string, size: Size): string {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.spinner.divCount = LOADERS[type];
        this.spinner.divArray = Array(this.spinner.divCount)
            .fill(0)
            .map((x, i) => i);
        let sizeClass = '';
        switch (size.toLowerCase()) {
            case 'small':
                sizeClass = 'la-sm';
                break;
            case 'medium':
                sizeClass = 'la-2x';
                break;
            case 'large':
                sizeClass = 'la-3x';
                break;
            default:
                break;
        }
        return 'la-' + type + ' ' + sizeClass;
    }
    /**
     * Check if input variables have changed
     *
     * @memberof NgxSpinnerComponent
     */
    onInputChange(): void {
        if (this.spinner) {
            this.spinner.class = this.getClass(<string>this.spinner.type, <Size>this.spinner.size);
        }
    }
    /**
     * Component destroy event
     *
     * @memberof NgxSpinnerComponent
     */
    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
