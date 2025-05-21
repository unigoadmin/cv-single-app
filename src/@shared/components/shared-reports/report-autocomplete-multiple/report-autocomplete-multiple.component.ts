import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import icClose from '@iconify/icons-ic/twotone-close';
import { Keywords, LoginUser, keywords } from 'src/@shared/models';
import { AuthenticationService } from 'src/@shared/services';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { GlobalSettingsService } from 'src/@shared/core/admin/http/globalsettings.service';
import { MarketingDashboardService } from 'src/@shared/core/ats/http/marketingdashboard.service';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'cv-report-autocomplete-multiple',
  templateUrl: './report-autocomplete-multiple.component.html',
  styleUrls: ['./report-autocomplete-multiple.component.scss']
})
export class ReportAutocompleteMultipleComponent implements OnInit, OnChanges {

  @Input('existingSkills') existingSkills: string[] = [];
  @Input('selectList') DynamicList: any;
  @Input('label') label: any;
  @Input('value') value: any | null;
  @Input('required') isrequired: boolean | false;
  @Output('selectedItem') setValue = new EventEmitter<any>();
  SelectedKwywods: string[] = [];
  keyword: keywords = new keywords();
  icClose = icClose;
  keywords: Keywords[];
  KeywordCtrl = new FormControl();
  AllKeywords: string[] = [];
  filteredKeywords: Observable<any[]>;
  loginUser: LoginUser;
  selectable: boolean = true;
  removable: boolean = true;
  addOnBlur: boolean = false;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  @ViewChild('fruitInput') fruitInput: ElementRef;

  @Output() out_selectedSkills = new EventEmitter<any>();


  constructor(
    private _service: MarketingDashboardService,
    private _authService: AuthenticationService,
    private service: GlobalSettingsService,
  ) {
    this.filteredKeywords = this.KeywordCtrl.valueChanges.pipe(
      map((item: string | null) => item ? this._filter(item) : this.AllKeywords.slice()));
  }

  ngOnChanges(...args: any[]) {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      this.GetKeywords();
    }

  }

  ngOnInit(): void {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      this.GetKeywords();
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.AllKeywords.filter(fruit => fruit.toLowerCase().indexOf(filterValue) === 0);
  }

  GetKeywords() {
    this._service.getKeywords(this.loginUser.Company.Id)
      .subscribe(
        keyword => {
          this.keywords = keyword;
          this.keywords.forEach(item => {
            this.AllKeywords.push(item.KeywordsText)
          });

          if(this.SelectedKwywods){
            this.SelectedKwywods=[];
            this.SelectedKwywods = this.existingSkills.filter(skill => skill !== 'ALL');
            this.out_selectedSkills.emit(this.SelectedKwywods);
          }

        },
        error => alert(error));
  }

  remove(item: any): void {
    const index = this.SelectedKwywods.indexOf(item);

    if (index >= 0) {
      this.SelectedKwywods.splice(index, 1);
    }
    this.out_selectedSkills.emit(this.SelectedKwywods);
  }


  selected(event: MatAutocompleteSelectedEvent): void {
    this.AddSelectedValue(event);
  }

  AddSelectedValue(event: MatAutocompleteSelectedEvent) {
    const value = (event.option.viewValue || '').trim();
    if (value && !this.SelectedKwywods.includes(value)) {
      this.SelectedKwywods.push(value);
      this.fruitInput.nativeElement.value = '';
      this.KeywordCtrl.setValue(null);
      this.out_selectedSkills.emit(this.SelectedKwywods);
    }
  }

}
