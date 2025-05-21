import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'phoneformat' })
export class PhoneFormatPipe implements PipeTransform {
    public transform(input: string): string {

        if (input) {
            input = input.replace(/\D/g, '').slice(-10);
            //input = input.replace(/[^\d]/g, "");
            //check if number length equals to 10
            if (input.length == 10) {
                //reformat and return phone number
                return input.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

}