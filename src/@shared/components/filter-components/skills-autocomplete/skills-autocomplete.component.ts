import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Keywords, LoginUser, keywords } from 'src/@shared/models';
import icClose from '@iconify/icons-ic/twotone-close';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { AuthenticationService } from 'src/@shared/services';
import { MarketingDashboardService } from 'src/@shared/core/ats/http/marketingdashboard.service';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { GlobalSettingsService } from 'src/@shared/core/admin/http/globalsettings.service';


@Component({
  selector: 'cv-skills-autocomplete',
  templateUrl: './skills-autocomplete.component.html',
  styleUrls: ['./skills-autocomplete.component.scss']
})
export class SkillsAutocompleteComponent implements OnInit {

  @Input('existingSkills') SelectedKwywods: string[] = [];
  @Input('IsPrimary') IsPrimary: boolean = false;
  @Input('Isrequired') Isrequired:boolean =  false;
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

  ngOnInit(): void {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      this.GetKeywords();
    }
  }

  // ngOnChanges(...args: any[]) {
  //   this.loginUser = this._authService.getLoginUser();
  //   if (this.loginUser) {
  //     this.GetKeywords();
  //   }

  // }

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

  add(event: MatChipInputEvent): void {

    if(this.IsPrimary == true){
      //check for length
      if(this.SelectedKwywods.length < 3){
        this.AddNewItem(event);
      }
    }
    else{
      this.AddNewItem(event);
    }
  }

  AddNewItem(event: MatChipInputEvent): void {
    const input = event.input;
    const value = (event.value || '').trim();
  
    // Convert value to lowercase for case-insensitive comparison
    const lowercaseValue = value.toLowerCase();
  
    // Check if the value is not empty and it already exists in AllKeywords (case-insensitive)
    const existingKeyword = this.AllKeywords.find(keyword => keyword.toLowerCase() === lowercaseValue);
  
    if (existingKeyword) {
      // If the keyword already exists, push it to SelectedKeywords if it's not already included
      if (!this.SelectedKwywods.includes(existingKeyword)) {
        this.SelectedKwywods.push(existingKeyword);
      }
    } else {
      // If the keyword doesn't exist, save it and push to SelectedKeywords
      this.saveKeywords(value);
      if (!this.SelectedKwywods.includes(value)) {
        this.SelectedKwywods.push(value);
      }
    }
  
    // Reset the input value
    if (input) {
      input.value = '';
    }
  
    // Clear the selection in the keyword control
    this.KeywordCtrl.setValue(null);
  
    // Emit the updated SelectedKeywords array
    this.out_selectedSkills.emit(this.SelectedKwywods);
  }
  

  selected(event: MatAutocompleteSelectedEvent): void {
    debugger;
    if (this.IsPrimary == true) {
      //check for legth
      if (this.SelectedKwywods.length < 3) {
        this.AddSelectedValue(event);
      }
    }
    else {
      this.AddSelectedValue(event);
    }

    // if(this.IsPrimary==true && this.SelectedKwywods.length < 3){
    //   const value = (event.option.viewValue || '').trim();
    //   if (value && !this.SelectedKwywods.includes(value)) {
    //     this.SelectedKwywods.push(value);
    //     this.fruitInput.nativeElement.value = '';
    //     this.KeywordCtrl.setValue(null);
    //     this.out_selectedSkills.emit(this.SelectedKwywods);
    //   }
    // }
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

  async saveKeywords(keywordValue: string) {
    this.keyword.KeywordsText = keywordValue;
    this.keyword.KeywordsSource = this.loginUser.Company.Id.toString();
    this.keyword.Category = "Candidate";

    try {
      const response = await this.service.SaveKeywords(this.keyword).toPromise();
      // Add the new keyword to the AllKeywords list after successfully saving it
      this.AllKeywords.push(keywordValue);
    } catch (error) {
      // Handle error if needed
    }
  }


}
