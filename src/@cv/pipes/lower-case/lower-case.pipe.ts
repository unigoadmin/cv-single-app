import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'lowercase'})
export class LowerCasePipe implements PipeTransform {
    transform(input:string): string{
        
        if (!input) {
            return '';
        } else {
            return input.toLocaleLowerCase();
        }
    }
    
}