import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'titlecase'})
export class TitleCasePipe implements PipeTransform {
    transform(input:string): string{
        if (!input) {
            return '';
        } else {
            return input.toLowerCase().replace(/\b\w/g, first => first.toLocaleUpperCase())
        }
    }
    
}