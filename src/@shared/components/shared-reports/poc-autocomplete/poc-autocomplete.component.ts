import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { merge, Observable, ReplaySubject, Subject } from 'rxjs';
import { distinct, map, startWith, takeUntil } from 'rxjs/operators';
import { LoginUser } from 'src/@shared/models';
import { AlertService, AuthenticationService } from 'src/@shared/services';


@Component({
  selector: 'cv-poc-autocomplete',
  templateUrl: './poc-autocomplete.component.html',
  styleUrls: ['./poc-autocomplete.component.scss']
})
export class PocAutocompleteComponent implements OnInit {
  @Input('selectList') pocList: any;
  @Input('label') label: any;
  @Input('value') value: any | null;
  @Input('required') isrequired: boolean | false;
  @Output('selectedPOC') setValue = new EventEmitter<any>();
  loginUser: LoginUser;
  myControl = new FormControl();
  
  filteredOptions: Observable<any[]>;

  

  //selectedPOC: string = null;
  constructor(
    private _alertService: AlertService,
    private _authService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      this.filterUsers();
      const toSelect = this.pocList.find(c => c.value == this.value).text;
      this.value = toSelect;
      //this.myControl.setValue(toSelect);
      // if(this.value!="ALL"){
      //   this.myControl.setValue({value: this.value});
      // }
    }
  }


  onSelFunc(option: any) {
    this.setValue.emit(option.value);
  }

  filterUsers() {
    this.pocList.sort((a, b) => {
      var valueA = a.text, valueB = b.text
      if (valueA < valueB)
        return -1
      if (valueA > valueB)
        return 1
      return 0
    });
    // this.filteredOptions = this.myControl.valueChanges
    //   .pipe(
    //     startWith(''),
    //     map(value => typeof value === 'string' ? value : value.name),
    //     map(name => name ? this._filter(name) : this.pocList.slice())
    //   );

      this.filteredOptions =  this.myControl.valueChanges.pipe(startWith(''), map(val => this._filter(val)));
  }


  private _filter(value: string): any[] {
    if(value && value.length >=2){
      const filterValue = value.toLowerCase();
      return this.pocList.filter(option => option.text.toLowerCase().indexOf(filterValue) === 0);
    }
    
  }

}


