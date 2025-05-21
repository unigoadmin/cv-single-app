import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { map } from 'rxjs/operators';
import { CommonService } from 'src/@shared/http';
import { LoginUser } from 'src/@shared/models';
import { HashTag } from 'src/@shared/models/hashtags';
import { AlertService, AuthenticationService } from 'src/@shared/services';
import icClose from '@iconify/icons-ic/twotone-close';


@Component({
  selector: 'cv-report-hastags',
  templateUrl: './report-hastags.component.html',
  styleUrls: ['./report-hastags.component.scss']
})
export class ReportHastagsComponent implements OnInit, OnChanges {

  @Input('existingTags') existingTags: string;
  @Input('resetHashTags') resetHashTags: boolean;
  loginUser: LoginUser;
  hashtags: HashTag[];
  HashTagCtrl = new FormControl();
  AllHashTags: any[] = [];
  filteredHashTags: Observable<any[]>;
  selectedHashTagChips: any[] = [];
  removable: boolean = true;
  addOnBlur: boolean = false;
  icClose=icClose;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  @Output() out_selectedHashTaga = new EventEmitter<any>();
  @ViewChild('fruitInput') fruitInput: ElementRef;
  constructor(
    private _authService: AuthenticationService,
    private _commonService: CommonService,
    private _alertService: AlertService,
  ) {
    this.filteredHashTags = this.HashTagCtrl.valueChanges.pipe(
      map((item: string | null) => item ? this._filter(item) : this.AllHashTags.slice()));
  }


  ngOnInit(): void {
    // console.log(this.existingTags);
    // this.loginUser = this._authService.getLoginUser();
    // this.getHashtags();
  }

  // private _filter(value: string): string[] {
  //   const filterValue = value.toLowerCase();
  //   return this.AllHashTags.filter(fruit => fruit.toLowerCase().indexOf(filterValue) === 0);
  // }

  private _filter(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.AllHashTags.filter(item => item.HashTagText.toLowerCase().includes(filterValue));
  }

  ngOnChanges(...args: any[]) {
    console.log(this.existingTags);
    this.loginUser = this._authService.getLoginUser();
    this.getHashtags();
    if(this.resetHashTags){
      this.resetData();
    }
    
  }

  getHashtags() {debugger;
    this.selectedHashTagChips = [];
    this.AllHashTags=[];
    this._commonService.getCRMHashTag(this.loginUser.Company.Id, 'ATS', 2)
      .subscribe(
        hashtags => {
          this.hashtags = hashtags;
          this.hashtags.forEach(item => {
            this.AllHashTags.push(item);
          });

          if(this.existingTags){debugger;
            this.selectedHashTagChips = [];
            let ids: string[] = this.existingTags.split(',');
            ids.forEach(element => {
              let hastagitem = this.hashtags.find(x => x.HashTagId == Number(element));
              if(hastagitem){
                const selectedValue = hastagitem.HashTagId;
                const value = hastagitem.HashTagText;
                this.selectedHashTagChips.push({selectedValue, value});
              }
            });
            this.out_selectedHashTaga.emit(this.selectedHashTagChips);
          }

        },
        error => this._alertService.error(error));
  }



  selected(event: MatAutocompleteSelectedEvent): void {debugger;
    this.AddSelectedValue(event);
  }

  AddSelectedValue(event: MatAutocompleteSelectedEvent) {
    const selectedValue = event.option.value;
    const value = (event.option.viewValue || '').trim();
    if (value && !this.selectedHashTagChips.includes(value)) {
      this.selectedHashTagChips.push({selectedValue,value});
      this.fruitInput.nativeElement.value = '';
      this.HashTagCtrl.setValue(null);
      this.out_selectedHashTaga.emit(this.selectedHashTagChips);
    }
  }

  remove(item: any): void {debugger;
    const index = this.selectedHashTagChips.findIndex(
      chip => chip.selectedValue === item.selectedValue && chip.value === item.value
    );
    //const index = this.selectedHashTagChips.indexOf(item.selectedValue);

    if (index >= 0) {
      this.selectedHashTagChips.splice(index, 1);
    }
    this.out_selectedHashTaga.emit(this.selectedHashTagChips);
  }

  resetData() {debugger;
    // Implement the logic to reset data in the child component
    this.selectedHashTagChips = []; // or reset to initial value
    this.out_selectedHashTaga.emit(this.selectedHashTagChips);
  }


}
