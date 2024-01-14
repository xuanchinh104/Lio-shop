import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class SharedConfigurationService {
    moduleId$ = new BehaviorSubject(0);

    setModuleSelected(idModule: number): void {
        this.moduleId$.next(idModule);
    }
}
