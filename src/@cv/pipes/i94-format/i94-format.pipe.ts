import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'I94Format'})
export class I94FormatPipe implements PipeTransform {
     transform(input:string): string{
        
        if (!input) {
            return '';
        } else {
            return input.replace(/\s+/g, '') 
        }
    }
    
}