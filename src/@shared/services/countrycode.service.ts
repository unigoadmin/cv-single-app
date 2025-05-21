import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { countryCodes } from '../../static-data/country-codes';
import { Country } from '../models';


@Injectable()
export class CountryCodeService {
  

    constructor() {
    }

    GetCountryCodes(): Observable<any> {
       let allCountries:Country[] =[]

        countryCodes.forEach(c => {
          let country = new Country();
          country.name = c[0].toString();
          country.iso2 = c[1].toString();
          country.dialCode = c[2].toString();
          country.priority = +c[3] || 0;
          country.areaCode = +c[4] || null;
          country.flagClass = country.iso2.toLocaleLowerCase();
          allCountries.push(country);
         
        });
        allCountries = allCountries.filter(x => x.dialCode != undefined);
        allCountries = allCountries.filter(x => x.flagClass != undefined);
    
       return of(allCountries);
      }

   
}