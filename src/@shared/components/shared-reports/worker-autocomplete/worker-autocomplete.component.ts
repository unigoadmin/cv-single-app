import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { LoginUser } from 'src/@shared/models';
import { AlertService, AuthenticationService } from 'src/@shared/services';

@Component({
  selector: 'cv-worker-autocomplete',
  templateUrl: './worker-autocomplete.component.html',
  styleUrls: ['./worker-autocomplete.component.scss']
})
export class WorkerAutocompleteComponent implements OnInit {
  
  @Input('selectList') EndClientList: any;
  @Input('label') label: any;
  @Input('value') value: any | null;
  @Input('required') isrequired: boolean | false;
  @Output('selectedWorker') setValue = new EventEmitter<any>();
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
      const toSelect = this.EndClientList.find(c => c.value == this.value).text;
      this.value = toSelect;
    }
  }


  onSelFunc(option: any) {
    this.setValue.emit(option.value);
  }

  filterUsers() {
    this.EndClientList.sort((a, b) => {
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
      return this.EndClientList.filter(option => option.text.toLowerCase().indexOf(filterValue) === 0);
    }
    
  }

}
