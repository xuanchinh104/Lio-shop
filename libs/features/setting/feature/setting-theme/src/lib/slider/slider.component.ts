import { ChangeDetectionStrategy, Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface SliderConfig {
    title: string;
    description: string;
    link: string;
    image: string;
    value?: string;
    limit?: number;
    suffix?: string;
    css?: string;
    template?: string;
}
@Component({
    selector: 'asc-slider',
    templateUrl: './slider.component.html',
    styleUrls: ['./slider.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: forwardRef(() => SliderComponent),
        },
    ],
})
export class SliderComponent implements ControlValueAccessor {
    @Input() numberOfItem = 1;
    // @Output() ngModelChange = new EventEmitter();

    slideShowList: SliderConfig[] = [];

    value: SliderConfig[] = [];

    // eslint-disable-next-line @typescript-eslint/ban-types
    onChange!: Function;
    constructor() {
        // code here
    }

    get isArray(): boolean {
        return Array.isArray(this.slideShowList);
    }

    onTouched(): void {
        // code here
    }

    writeValue(obj: any): void {
        if (Array.isArray(obj) && obj.length > 0) {
            this.slideShowList = obj;
            this.value = obj;
            this.onChangeCallback(this.value);
        } else {
            this.slideShowList = [];
            for (let i = 0; i < this.numberOfItem; i++) {
                this.slideShowList.push({
                    title: '',
                    description: '',
                    link: '',
                    image: '',
                });
            }

            this.value = this.slideShowList;
            // this.onChange(this.value)
            // this.ngModelChange.emit(this.slideShowList);
            this.onChangeCallback(this.value);
        }
    }

    registerOnChange(fn: any): void {
        this.onChangeCallback = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    addItem(): void {
        this.slideShowList.push({
            title: '',
            description: '',
            link: '',
            image: '',
        });

        // this.onChange(this.slideShowList);
        this.onChangeCallback(this.slideShowList);
    }

    removeItem(index: number): void {
        this.slideShowList.splice(index, 1);
        // this.onChange(this.slideShowList);
        this.onChangeCallback(this.slideShowList);
    }

    private onChangeCallback: (_: any) => void = () => {
        // code here
    };
}
