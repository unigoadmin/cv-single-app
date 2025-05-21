import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { merge, Observable, ReplaySubject, Subject } from 'rxjs';
import { distinct, map, startWith, takeUntil } from 'rxjs/operators';
import { LoginUser } from 'src/@shared/models';
import { AlertService, AuthenticationService } from 'src/@shared/services';

@Component({
  selector: 'cv-vendor-autocomplete',
  templateUrl: './vendor-autocomplete.component.html',
  styleUrls: ['./vendor-autocomplete.component.scss']
})
export class VendorAutocompleteComponent implements OnInit {

  @Input('selectList') VendorList: any;
  @Input('label') label: any;
  @Input('value') value: any | null;
  @Input('required') isrequired: boolean | false;
  @Output('selectedVendor') setValue = new EventEmitter<any>();
  loginUser: LoginUser;
  myControl = new FormControl();
  
  filteredOptions: Observable<any[]>;

  constructor(
    private _alertService: AlertService,
    private _authService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      this.filterUsers();
      const toSelect = this.VendorList.find(c => c.value == this.value).text;
      this.value = toSelect;
    }
  }


  onSelFunc(option: any) {
    this.setValue.emit(option.value);
  }

  filterUsers() {
    this.VendorList.sort((a, b) => {
      var valueA = a.text, valueB = b.text
      if (valueA < valueB)
        return -1
      if (valueA > valueB)
        return 1
      return 0
    });

      this.filteredOptions =  this.myControl.valueChanges.pipe(startWith(''), map(val => this._filter(val)));
  }


  private _filter(value: string): any[] {
    if(value && value.length >=2){
      const filterValue = value.toLowerCase();
      return this.VendorList.filter(option => option.text.toLowerCase().indexOf(filterValue) === 0);
    }
    
  }

}
