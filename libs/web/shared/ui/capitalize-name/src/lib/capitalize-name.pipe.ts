import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'capitalizeNameWeb',
})
export class CapitalizeNamePipe implements PipeTransform {
    transform(value: string): string {
        if (!value) {
            return '';
        }

        const words = value.split(' ');
        const capitalizedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());

        return capitalizedWords.join(' ');
    }
}
