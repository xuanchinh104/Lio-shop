import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { DayOfWeekDescription } from '../../dashboard.enum';
import { interval } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
    selector: 'ui-timer',
    templateUrl: './timer.component.html',
    styleUrls: ['./timer.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimerComponent {
    currentDate = new Date();
    dayOfWeek = DayOfWeekDescription[new Date().getDay()];

    currentTimer$ = interval(1000).pipe(map(() => this.formatTime()));

    private formatTime(): string {
        const date = new Date();
        const hh = String(date.getHours()).padStart(2, '0');
        const mm = String(date.getMinutes()).padStart(2, '0');
        const ss = String(date.getSeconds()).padStart(2, '0');
        return `${hh}:${mm}:${ss}`;
    }
}
