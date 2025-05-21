import { ChangeDetectorRef, Component, ComponentFactoryResolver, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import icClose from '@iconify/icons-ic/twotone-close';
import { ProcessMenuService } from 'src/@cv/services/processmenu.service';
import { LoginUser } from 'src/@shared/models';
import { AlertService, AuthenticationService } from 'src/@shared/services';
import { ReportFilters, ReportParametersMetaData } from 'src/@shared/core/reports/models/reportparametersmetadata';
import { GenericReportsService } from 'src/@shared/core/reports/http/genericreports.service';

@Component({
  selector: 'cv-customize-report',
  templateUrl: './customize-report.component.html',
  styleUrls: ['./customize-report.component.scss']
})
export class CustomizeReportComponent implements OnInit {

  loginUser: LoginUser;
  ReportName: string;
  icClose = icClose;
  reportParametersMetaData: ReportParametersMetaData = new ReportParametersMetaData();

  public poc: string;
  public consultant: string;
  public status: string;
  public period: string;
  public pocid: string;
  public consultantid: string;
  public statusid: string;
  public periodid: string;
  public startDate: any;
  public endDate: any;
  public outstartDate: any;
  public outendDate: any;
  public fnstartDate: any;
  public fnendDate: any;
  public erstartDate: any;
  public erendDate: any;
  reportTypeId: number = 0;
  reportId: number = 0;
  isDisabled: boolean = false;
  selectedData: any[] = [];
  Title: string = null;
  btnName: string = null;
  daterangeValues: DateRange;
  enddaterangeValues: DateRange;
  dbHashTags: string;
  SelectedKwywods: string[] = [];

  constructor(
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public Data: any,
    private dialogRef: MatDialogRef<CustomizeReportComponent>,
    private matIconRegistry: MatIconRegistry,
    private domSanitzer: DomSanitizer,
    private _alertService: AlertService,
    private cdRef: ChangeDetectorRef,
    private reportsService: GenericReportsService,
    private _service: ProcessMenuService,
    private _cmpFctryRslvr: ComponentFactoryResolver,
    private authService: AuthenticationService,
  ) {
    let ids: any = this.Data;
    if (ids.reportTypeId > 0 && ids.reportId > 0) {
      this.reportId = +ids.reportId;
      this.reportTypeId = +ids.reportTypeId;
    }
    this.selectedData = [];
    this.daterangeValues = new DateRange();
    this.daterangeValues.StartDate = null;
    this.daterangeValues.EndDate = null;
    this.enddaterangeValues = new DateRange();
    this.enddaterangeValues.StartDate = null;
    this.enddaterangeValues.EndDate = null;

  }
  todo = [];
  done = [];
  ngOnInit(): void {
    this.loginUser = this.authService.getLoginUser();
    if (this.loginUser) {
      this.GetReportFilters();
    }
    this.todo = [

    ];
  }
  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }
  GetReportFilters() {
    this.reportsService.GetReportFilters(this.loginUser.Company.Id, this.reportTypeId, this.reportId).subscribe(response => {
      this.reportParametersMetaData = response.Data;
      this.reportParametersMetaData.ReportFilters.forEach(x => {
        if (this.reportParametersMetaData.Report.IsDefault) {
          this.Title = "Customize Report"
          this.btnName = "Save Customize"
          if (x.FieldDataName === "PERIOD")
            x.FieldSelectedValue = '4';
          this.SelectedData(x.FieldSelectedValue, x);
        } else {
          this.Title = "Edit Customize Report"
          this.btnName = "Update Customize"
          if (x.FieldDataName === "PERIOD") {
            const value: any = JSON.parse(x.FieldSelectedValue);
            if (value && value.Period) {
              x.FieldSelectedValue = value.Period.toString();
            }
            if (value && value.FromDate) {
              this.startDate = new Date(value.FromDate);
            }
            if (value && value.ToDate) {
              this.endDate = new Date(value.ToDate);
            }
            this.SelectedData(x.FieldSelectedValue, x);
          }
          else if (x.FieldDataName === "FNSTARTPERIOD") {
            const value: any = JSON.parse(x.FieldSelectedValue);
            if (value && value.StartDate) {
              this.fnstartDate = new Date(value.StartDate);
              this.daterangeValues.StartDate = this.fnstartDate;
            }
            if (value && value.EndDate) {
              this.fnendDate = new Date(value.EndDate);
              this.daterangeValues.EndDate = this.fnendDate;
            }
            let daterangeJson: any;
            daterangeJson = JSON.stringify(this.daterangeValues);
            x.FieldSelectedValue = daterangeJson.toString();
            this.SelectedData(x.FieldSelectedValue, x);
          }
          else if (x.FieldDataName === "FNENDPERIOD") {
            const value: any = JSON.parse(x.FieldSelectedValue);
            if (value && value.StartDate) {
              this.erstartDate = new Date(value.StartDate);
              this.daterangeValues.StartDate = this.erstartDate;
            }
            if (value && value.EndDate) {
              this.erendDate = new Date(value.EndDate);
              this.daterangeValues.EndDate = this.erendDate;
            }
            let daterangeJson: any;
            daterangeJson = JSON.stringify(this.daterangeValues);
            x.FieldSelectedValue = daterangeJson.toString();
            this.SelectedData(x.FieldSelectedValue, x);
          }
          else {
            this.SelectedData(x.FieldSelectedValue, x);
          }

        }
      });

      if (this.reportTypeId != 9 && this.reportTypeId != 10) {
        //skipping the columns logic for jobcentral repots.
        if (this.reportParametersMetaData.Report.IsDefault) {
          this.todo = JSON.parse(JSON.stringify(this.reportParametersMetaData.ReportColumns));
        } else {
          if (this.reportParametersMetaData.ReportSelectedColumns.length > 0) {
            this.todo = this.reportParametersMetaData.ReportColumns;
            this.reportParametersMetaData.ReportSelectedColumns.forEach(x => {
              const i = this.reportParametersMetaData.ReportColumns.findIndex(y => y.Label == x.Label);
              if (i >= 0) {
                this.todo = this.todo.filter(y => y.Label != x.Label);
              }
            })
          } else {
            this.todo = this.reportParametersMetaData.ReportColumns;
          }
          this.done = JSON.parse(JSON.stringify(this.reportParametersMetaData.ReportSelectedColumns));
          this.ReportName = this.reportParametersMetaData.Report.ReportName;
        }
      }


      if (!this.cdRef["distroyed"]) {
        this.cdRef.detectChanges();
      }
    }, error => {
      this._alertService.error(error);
      if (!this.cdRef["distroyed"]) {
        this.cdRef.detectChanges();
      }
    })
  }
  SelectedData(event, selectedfield: ReportFilters) {
    if (this.selectedData.length > 0) {
      const index = this.selectedData.findIndex(x => x.name == selectedfield.FieldDataName);
      if (index !== -1) {
        this.selectedData.splice(index, 1);
      }
    }

    if (selectedfield.FieldDataName === "PERIOD") {
      this.selectedData.push({ name: selectedfield.FieldDataName, value: Number(event), id: selectedfield.ReportParamMetaDataId.toString() });
      this.setDatePeriod(event);
    }
    else {
      this.selectedData.push({ name: selectedfield.FieldDataName, value: event, id: selectedfield.ReportParamMetaDataId.toString() });
    }
  }
  SelectedPOC(event, selectedfield: ReportFilters) {
    if (this.selectedData.length > 0) {
      const index = this.selectedData.findIndex(x => x.name == selectedfield.FieldDataName);
      if (index !== -1) {
        this.selectedData.splice(index, 1);
      }
    }
    this.selectedData.push({ name: selectedfield.FieldDataName, value: event, id: selectedfield.ReportParamMetaDataId.toString() });
  }
  SelectDateRange(event, selectedfield: ReportFilters) {
    if (event.FDate) {
      this.daterangeValues.StartDate = event.FDate;
    }
    if (event.TDate) {
      this.daterangeValues.EndDate = event.TDate;
    }

    if (this.selectedData.length > 0) {
      const index = this.selectedData.findIndex(x => x.name == selectedfield.FieldDataName);
      if (index !== -1) {
        this.selectedData.splice(index, 1);
      }
    }
    let daterangeJson: any;
    daterangeJson = JSON.stringify(this.daterangeValues);
    this.selectedData.push({ name: selectedfield.FieldDataName, value: daterangeJson, id: selectedfield.ReportParamMetaDataId.toString() });
  }
  SelectEndDateRange(event, selectedfield: ReportFilters) {
    if (event.FDate) {
      this.enddaterangeValues.StartDate = event.FDate;
    }
    if (event.TDate) {
      this.enddaterangeValues.EndDate = event.TDate;
    }

    if (this.selectedData.length > 0) {
      const index = this.selectedData.findIndex(x => x.name == selectedfield.FieldDataName);
      if (index !== -1) {
        this.selectedData.splice(index, 1);
      }
    }
    let daterangeJson: any;
    daterangeJson = JSON.stringify(this.enddaterangeValues);
    this.selectedData.push({ name: selectedfield.FieldDataName, value: daterangeJson, id: selectedfield.ReportParamMetaDataId.toString() });
  }
  setDatePeriod(id) {
    switch (id) {
      case '1':
        this.isDisabled = false;
        this.startDate;
        this.endDate;
        break;
      case '2':
        this.isDisabled = true;
        let currentdate = new Date();
        this.startDate = currentdate;
        this.endDate = currentdate.setDate(currentdate.getDate() + 1);
        break;
      case '3':
        this.isDisabled = true;
        let monday = new Date();
        this.startDate = new Date(monday.setDate(monday.getDate() - monday.getDay() + 1));
        var sunday = new Date();
        this.endDate = new Date(sunday.setDate(sunday.getDate() - sunday.getDay() + 7));
        break;
      case '4':
        this.isDisabled = true;
        let date = new Date();
        this.startDate = new Date(date.getFullYear(), date.getMonth(), 1);
        this.endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        break;
      case '5':
        this.isDisabled = true;
        let quarter = new Date();
        const quarted = Math.floor((quarter.getMonth() / 3));
        const startDate = new Date(quarter.getFullYear(), quarted * 3, 1);
        const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 3, 0);
        this.startDate = startDate;
        this.endDate = endDate;
        break;
      case '6':
        this.isDisabled = true;
        this.startDate = new Date(new Date().getFullYear(), 0, 1);
        this.endDate = new Date(new Date().getFullYear(), 11, 31);
        break;
    }
    this.outstartDate = this.startDate;
    this.outendDate = this.endDate;
    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
    }
  }
  changeDate(event) {
    this.outstartDate = event.FDate;
    this.outendDate = event.TDate;
  }
  runReportClick() {
    if (this.reportParametersMetaData.ReportFilters.length > 0) {
      const FinalData = {
        Repfilter: this.selectedData,
        selectedCol: this.done,
        reportName: this.ReportName,
        reportId: this.reportId,
        outstartDate: this.outstartDate,
        outendDate: this.outendDate
      }
      this.dialogRef.close(FinalData);
    }
  }

  getDateItem() {
    return this.reportParametersMetaData.ReportFilters.filter(x => x.FieldType === 'date');
  }

  LocalDFWStatus(event, selectedfield: ReportFilters) {
    if (this.selectedData.length > 0) {
      const index = this.selectedData.findIndex(x => x.name == selectedfield.FieldDataName);
      if (index !== -1) {
        this.selectedData.splice(index, 1);
      }
    }
    let selectedState = event.checked ? 'TX' : 'ALL';
    this.selectedData.push({ name: selectedfield.FieldDataName, value: selectedState, id: selectedfield.ReportParamMetaDataId.toString() });
  }

  GetSelectedHashTags(event, selectedfield: ReportFilters) {
    if (this.selectedData.length > 0) {
      const index = this.selectedData.findIndex(x => x.name == selectedfield.FieldDataName);
      if (index !== -1) {
        this.selectedData.splice(index, 1);
      }
    }
    let selectedHashTagIds = event.map(item => item.selectedValue).join(',');
    this.selectedData.push({ name: selectedfield.FieldDataName, value: selectedHashTagIds, id: selectedfield.ReportParamMetaDataId.toString() });
    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
    }
  }

  GetSelectedSkills(event, selectedfield: ReportFilters) {
    if (this.selectedData.length > 0) {
      const index = this.selectedData.findIndex(x => x.name == selectedfield.FieldDataName);
      if (index !== -1) {
        this.selectedData.splice(index, 1);
      }
    }
    let selectedskills = event.map(item => item).join(',');
    this.selectedData.push({ name: selectedfield.FieldDataName, value: selectedskills, id: selectedfield.ReportParamMetaDataId.toString() });
  }

}

export class DateRange {
  StartDate: any;
  EndDate: any;
  constructor() {
    this.StartDate = null;
    this.EndDate = null;
  }
}
