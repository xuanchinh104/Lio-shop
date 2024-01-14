import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'daysAgo',
    pure: true,
})
export class DaysAgoDirective implements PipeTransform {
    transform(time: any, args?: any): any {
        if (time) {
            switch (typeof time) {
                case 'number':
                    break;
                case 'string':
                    time = +new Date(time);
                    break;
                case 'object':
                    if (time.constructor === Date) {
                        time = time.getTime();
                    }
                    break;
                default:
                    time = +new Date();
            }
            const time_formats = [
                [60, 'giây', 1], // 60
                [120, '1 phút trước', '1 phút trước'], // 60*2
                [3600, 'phút', 60], // 60*60, 60
                [7200, '1 giờ trước', '1 giờ trước'], // 60*60*2
                [86400, 'giờ', 3600], // 60*60*24, 60*60
                [172800, 'Hôm qua', 'Tomorrow'], // 60*60*24*2
                [604800, 'ngày', 86400], // 60*60*24*7, 60*60*24
                [1209600, 'Tuần trước', 'Next week'], // 60*60*24*7*4*2
                [2419200, 'Tuần', 604800], // 60*60*24*7*4, 60*60*24*7
                [4838400, 'Tháng trước', 'Next month'], // 60*60*24*7*4*2
                [29030400, 'Tháng', 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
                [58060800, 'Năm trước', 'Next year'], // 60*60*24*7*4*12*2
                [2903040000, 'years', 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
            ];
            let seconds = (+new Date() - time) / 1000,
                token = 'trước',
                list_choice = 1;
            if (seconds < 1) {
                return 'vài giây';
            }
            if (seconds < 0) {
                seconds = Math.abs(seconds);
                token = 'vài giây';
                list_choice = 2;
            }
            let i = 0;
            let format;
            // eslint-disable-next-line no-cond-assign
            while ((format = time_formats[i++])) {
                if (seconds < format[0]) {
                    if (typeof format[2] === 'string') {
                        return format[list_choice];
                    } else {
                        return Math.floor(seconds / format[2]) + ' ' + format[1] + ' ' + token;
                    }
                }
            }
            return time;
        }
    }
}
