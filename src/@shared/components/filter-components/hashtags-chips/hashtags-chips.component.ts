import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { CommonService } from 'src/@shared/http';
import { LoginUser } from 'src/@shared/models';
import { HashTag } from 'src/@shared/models/hashtags';
import { AlertService, AuthenticationService } from 'src/@shared/services';

@Component({
  selector: 'cv-hashtags-chips',
  templateUrl: './hashtags-chips.component.html',
  styleUrls: ['./hashtags-chips.component.scss']
})
export class HashtagsChipsComponent implements OnInit {
  @Input('existingTags') existingTags: string;
  @Input('resetHashTags') resetHashTags:boolean;
  loginUser: LoginUser;
  hashtags: HashTag[];
  HashTagCtrl = new FormControl();
  AllHashTags: string[] = [];
  filteredHashTags: Observable<any[]>;
  SelectedHashTags: any;
  selectedHashTagChips: any[] = [];
  @Output() out_selectedHashTaga = new EventEmitter<any>();
  constructor(
    private _authService: AuthenticationService,
    private _commonService: CommonService,
    private _alertService: AlertService,
  ) { }

  ngOnInit(): void {
    
  }

  ngOnChanges(...args: any[]) {
    this.loginUser = this._authService.getLoginUser();
    this.getHashtags();
    if(this.resetHashTags){
      this.resetData();
    }
  }

  getHashtags() {
    this._commonService.getCRMHashTag(this.loginUser.Company.Id, 'ATS', 2)
      .subscribe(
        hashtags => {
          this.hashtags = hashtags;
          this.hashtags.forEach(item => {
            this.AllHashTags.push(item.HashTagText);
          });

          if(this.existingTags){
            let ids: string[] = this.existingTags.split(',');
            ids.forEach(element => {
              let hastagitem = this.hashtags.find(x => x.HashTagId == Number(element));
              hastagitem.state = true;
              this.selectedHashTagChips.push(hastagitem.HashTagId);
            });
          }
        },
        error => this._alertService.error(error));
  }

  HashTagschangeSelected(parameter: string, query: string) {
    const index = this.selectedHashTagChips.indexOf(query);
    if (index >= 0) {
      this.selectedHashTagChips.splice(index, 1);
    } else {
      this.selectedHashTagChips.push(query);
    }
    this.out_selectedHashTaga.emit(this.selectedHashTagChips);
  }

  resetData() {
    // Implement the logic to reset data in the child component
    this.selectedHashTagChips = []; // or reset to initial value
    this.out_selectedHashTaga.emit(this.selectedHashTagChips);
  }

}
