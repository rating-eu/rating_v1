import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'replace' })
export class ReplacePipe implements PipeTransform {
    transform(value: string, search: string, replace: string): string {
        const regExp: RegExp = new RegExp(search, 'g');
        if (value) {
            return value.replace(regExp, replace);
        } else {
            return '';
        }
    }
}
