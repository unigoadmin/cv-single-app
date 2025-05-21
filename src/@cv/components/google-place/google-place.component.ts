/// <reference types="@types/googlemaps" />

import { Component, ViewChild, EventEmitter, Output, OnInit, AfterViewInit, Input,ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
//import { } from 'googlemaps';

@Component({
  selector: 'cv-google-place',
  templateUrl: './google-place.component.html',
  styleUrls: ['./google-place.component.scss']
})
export class GooglePlaceComponent implements OnInit {

  @Input() InputMode:string;
  @Input() adressType: string;
  @Output() setAddress: EventEmitter<any> = new EventEmitter();
  @Output() inputAddress: EventEmitter<any> = new EventEmitter();
  @ViewChild('addresstext') addresstext: any;
  @Input() selectedAddress:string;
  @Input() disable:boolean;
  @Input() required:boolean = false;
  autocompleteInput: string;
  queryWait: boolean;

  constructor(private cdr:ChangeDetectorRef) {
  }

  ngOnInit() {
     console.log(this.InputMode);
  }
  ngOnChanges(...args: any[]) { 
      this.autocompleteInput= this.selectedAddress;
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
