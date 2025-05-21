/// <reference types="@types/googlemaps" />

import { Component, ViewChild, EventEmitter, Output, OnInit, AfterViewInit, Input,ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, NgForm, ControlContainer, FormControl, FormGroupDirective, Validators } from '@angular/forms';
//import { } from 'googlemaps';

export class MyErrorStateMatcher implements MyErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
      
      return !!(control && control.invalid);
    }
  }

@Component({
  selector: 'cv-google-places',
  templateUrl: './google-places.component.html',
  styleUrls: ['./google-places.component.scss']
})
export class GooglePlacesComponent implements OnInit,AfterViewInit {
   
    @Input() InputMode:string;
    @Input() adressType: string;
    @Output() setAddress: EventEmitter<any> = new EventEmitter();
    @Output() inputAddress: EventEmitter<any> = new EventEmitter();
    @ViewChild('addresstext') addresstext: any;
    @Input() selectedAddress:string;
    @Input() disable:boolean;
    @Input() required = false;
    autocompleteInput: string;
    queryWait: boolean;

    ATSGoogePlacesForm: FormGroup;
    matcher = new MyErrorStateMatcher();

    constructor(private cdr:ChangeDetectorRef,
                private fb: FormBuilder) {
                  this.ATSGoogePlacesForm = this.fb.group({
                    location: ['', Validators.required]
                  });
    }

    ngOnInit() {
       console.log(this.InputMode);
    }
    ngOnChanges(...args: any[]) {
        this.autocompleteInput="";
        this.autocompleteInput= this.selectedAddress;
       // this.ATSGoogePlacesForm.controls['ATSGoogePlacesForm'].value
        if(!this.cdr["distroyed"]){
           this.cdr.detectChanges();
        }
    }
    ngAfterViewInit() {
        this.getPlaceAutocomplete();
    }

    private getPlaceAutocomplete() {
        const autocomplete = new google.maps.places.Autocomplete(this.addresstext.nativeElement,
            {
                componentRestrictions: { country: 'US' },
                types: [this.adressType]  // 'establishment' / 'address' / 'geocode'
            });
        google.maps.event.addListener(autocomplete, 'place_changed', () => {
            const place = autocomplete.getPlace();
            this.invokeEvent(place);
        });
    }

    invokeEvent(place: Object) {
        this.setAddress.emit(place);
    }

    autocompleteInputChange(event){
        this.inputAddress.emit(event);  
      }

     

}
