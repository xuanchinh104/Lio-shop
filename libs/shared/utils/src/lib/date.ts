import { SafeAny } from './types';

export interface WeekOfYearNumber {
    weekNumber: number;
    startDate: Date;
    endDate: Date;
}
export class DateUtil {
    /**
     * Get Now
     */
    static getNow(): string {
        return new Date().toISOString();
    }

    /**
     * Get FullDate
     * @param newDate
     * @param isFormat
     */
    static getFullDate(newDate: SafeAny, isFormat = false): string | null {
        if (!newDate) {
            return null;
        }

        const today = new Date(newDate);
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
        const yyyy = today.getFullYear();
        if (isFormat) {
            return `${dd}-${mm}-${yyyy}`;
        }
        return `${yyyy}-${mm}-${dd}`;
    }

    /**
     *
     * @param newDate
     */
    static viewFullDate(newDate: string): string {
        if (!newDate) {
            return '';
        }

        const today = new Date(newDate);
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
        const yyyy = today.getFullYear();
        return `${dd}/${mm}/${yyyy}`;
    }

    /**
     * Get Full DateTime
     * @param newDate
     */
    static getFullDateTime(newDate: SafeAny, isFormat = false): string | null {
        if (!newDate) {
            return null;
        }

        const today = new Date(newDate);
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
        const hh = String(today.getHours()).padStart(2, '0');
        const ss = String(today.getMinutes()).padStart(2, '0');
        const yyyy = today.getFullYear();
        if (isFormat) {
            return `${hh}:${ss}T${dd}-${mm}-${yyyy}`;
        }
        return `${yyyy}-${mm}-${dd}T${hh}:${ss}`;
    }

    /**
     * Convert Month/Year -> DateTime
     * @param month
     * @param year
     */
    static convertMonthYearToDateTime(month: number, year: number): Date {
        const date = new Date();
        date.setMonth(month);
        date.setFullYear(year);
        return date;
    }

    /**
     * Check ngay ket thuc > ngay bat dau
     * @param dateFrom
     * @param dateTo
     */
    static checkDateFromDateTo(dateFrom: SafeAny, dateTo: SafeAny): boolean {
        const from = this.convertDateTimeToUTC(dateFrom);
        const to = this.convertDateTimeToUTC(dateTo);
        return to >= from;
    }

    /**
     *
     * @param newDate
     */
    static convertDateTimeToUTC(newDate: SafeAny): Date {
        const updateDateUTC = new Date(newDate);
        updateDateUTC.setHours(0, 0, 0, 0);
        return updateDateUTC;
    }

    /**
     * Add year to datetime
     * @param value
     * @param yearNumber
     */
    static addYearToDate(value: SafeAny, yearNumber: number): Date {
        const date = new Date(value);
        date.setFullYear(date.getFullYear() + yearNumber);
        return date;
    }

    static addDate(date: SafeAny, value: number): Date {
        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() + value);
        return newDate;
    }

    static minusDate(date: SafeAny, value: number): Date {
        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() - value);
        return newDate;
    }

    /**
     * Add month to date
     * @param value
     * @param monthNumber
     */
    static addMonthToDate(value: SafeAny, monthNumber: number): Date {
        const date = new Date(value);
        date.setMonth(date.getMonth() + monthNumber);
        return date;
    }

    /**
     * Minus month from date
     * @param value
     * @param monthNumber
     */
    static minusMonthToDate(value: SafeAny, monthNumber: number): Date {
        const date = new Date(value);
        date.setMonth(date.getMonth() - monthNumber);
        return date;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    static compareToDate(object1: SafeAny, object2: SafeAny) {
        if (!object1 || !object2) {
            return null;
        }
        const date1 = DateUtil.getFullDate(object1);
        const date2 = DateUtil.getFullDate(object2);
        return new Date(date1 as SafeAny).getTime() - new Date(date2 as SafeAny).getTime();
    }

    static getWeekNumberByDate(date: string): number {
        const firstDateOfWeek = new Date(date);
        const oneJan = new Date(firstDateOfWeek.getFullYear(), 0, 1);
        const numberOfDays = Math.floor((firstDateOfWeek.getTime() - oneJan.getTime()) / (24 * 60 * 60 * 1000));
        return Math.ceil((firstDateOfWeek.getDay() + 1 + numberOfDays) / 7);
    }

    static getLastDayOfMonth(year: number, month: number, dy: number): Date {
        const days: SafeAny = {
            sun: 0,
            mon: 1,
            tue: 2,
            wed: 3,
            thu: 4,
            fri: 5,
            sat: 6,
        };
        const dat = new Date(year + '/' + month + '/1');
        let currentmonth = month;
        let firstday = false;
        while (currentmonth === month) {
            firstday = dat.getDay() === days[dy] || firstday;
            dat.setDate(dat.getDate() + (firstday ? 7 : 1));
            currentmonth = dat.getMonth() + 1;
        }
        dat.setDate(dat.getDate() - 7);
        return dat;
    }

    static getFirstDayOfMonth(year: number, month: number, dy: string): Date {
        const days: SafeAny = {
            sun: 0,
            mon: 1,
            tue: 2,
            wed: 3,
            thu: 4,
            fri: 5,
            sat: 6,
        };
        const dat = new Date(year + '/' + month + '/1');
        while (dat.getDay() !== days[dy]) {
            dat.setDate(dat.getDate() + 1);
        }
        return dat;
    }

    // static getWeeksOfYear(year: number): WeekOfYearNumber[] {
    //     const firstDate = this.getFirstDayOfMonth(year, 1, 'mon');
    //     if (firstDate) {
    //
    //     }
    // }
}
