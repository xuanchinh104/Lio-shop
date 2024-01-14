import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AscSpinner, PRIMARY_SPINNER, Spinner } from './asc-spinner.enum';

@Injectable({
    providedIn: 'root',
})
export class AscSpinnerService {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    spinnerObservable = new BehaviorSubject<AscSpinner>(null);

    /**
     * Creates an instance of NgxSpinnerService.
     * @memberof NgxSpinnerService
     */
    constructor() {
        // code here
    }

    /**
     * Get subscription of desired spinner
     * @memberof NgxSpinnerService
     **/
    getSpinner(name: string): Observable<AscSpinner> {
        return this.spinnerObservable.asObservable().pipe(filter((x: AscSpinner) => x && x.name === name));
    }

    /**
     * To show spinner
     *
     * @memberof NgxSpinnerService
     */
    show(name: string = PRIMARY_SPINNER, spinner?: Spinner): Promise<unknown> {
        return new Promise((resolve, _reject) => {
            setTimeout(() => {
                if (spinner && Object.keys(spinner).length) {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    spinner['name'] = name;
                    this.spinnerObservable.next(
                        new AscSpinner({
                            ...spinner,
                            show: true,
                        })
                    );
                    resolve(true);
                } else {
                    this.spinnerObservable.next(
                        new AscSpinner({
                            name,
                            show: true,
                        })
                    );
                    resolve(true);
                }
            }, 10);
        });
    }

    /**
     * To hide spinner
     *
     * @memberof NgxSpinnerService
     */
    hide(name: string = PRIMARY_SPINNER, debounce: number = 10): Promise<unknown> {
        return new Promise((resolve, _reject) => {
            setTimeout(() => {
                this.spinnerObservable.next(
                    new AscSpinner({
                        name,
                        show: false,
                    })
                );
                resolve(true);
            }, debounce);
        });
    }
}
