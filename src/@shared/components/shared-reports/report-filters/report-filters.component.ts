import {
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  ViewContainerRef,
  OnDestroy
} from '@angular/core';
import icLayers from '@iconify/icons-ic/twotone-layers';
import icContacts from '@iconify/icons-ic/twotone-contacts';
import { AlertService, AuthenticationService } from 'src/@shared/services';
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { PopoverRef } from 'src/@cv/components/popover/popover-ref';
import { GenericReportsService } from 'src/@shared/core/reports/http/genericreports.service';
import { LoginUser } from 'src/@shared/models';
import { EmployeeMaster } from 'src/@cv/models/processmenu';
import { ReportFilters, ReportParametersMetaData } from 'src/@shared/core/reports/models/reportparametersmetadata';
import { ProcessMenuService } from 'src/@cv/services/processmenu.service';
import { EmployerProfile } from 'src/@shared/core/jobcentral/model/employerprofile';
import { EmitterService } from 'src/@cv/services/emitter.service';
import { RunReport } from 'src/@shared/core/reports/models/transactionalreport'
import { MatSort } from '@angular/material/sort';
import { UserModules } from 'src/@cv/models/accounttypeenum';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';


export interface ProcessMenuPage {
  label: string;
  route: string;
  screencode: string;
  actioncode: string;
  id: number;
}

export class DateRange {
  StartDate: any;
  EndDate: any;
  constructor() {
    this.StartDate = null;
    this.EndDate = null;
  }
}

@Component({
  selector: 'cv-report-filters',
  templateUrl: './report-filters.component.html',
  styleUrls: ['./report-filters.component.scss']
})
export class ReportFiltersComponent implements OnInit,OnDestroy {

  loginUser: LoginUser;
  icLayers = icLayers;
  icContacts = icContacts;
  public EmployeeList: EmployeeMaster[] = [];
  reportParametersMetaData: ReportParametersMetaData = new ReportParametersMetaData();
  public employerProfile: EmployerProfile[] = [];
  reportTypeId: number = 0;
  reportId: number = 0;
  @ViewChild('placeHolder', { read: ViewContainerRef }) private _placeHolder: ElementRef<any>;
  public startDate: any;
  public endDate: any;
  public outstartDate: any;
  public outendDate: any;
  public fnstartDate: any;
  public fnendDate: any;
  public erstartDate: any;
  public erendDate: any;
  buttonName: string;
  isDisabled: boolean = true;
  isDefault: boolean = false;
  selectedData: any[] = [];
  appliedFilter: string = null;
  filteredValues: RunReport = new RunReport();
  startdaterangeValues: DateRange = new DateRange();
  enddaterangeValues: DateRange = new DateRange();
  @ViewChild(MatSort) sort: MatSort;
  dbHashTags: string;
  SelectedKeywords: string[] = [];
  ModuleName: string = null;
  ModuleId: string = null;
  resetHashTags: boolean = false;
  private clickSubject = new Subject<void>();
  private unsubscribe$ = new Subject<void>();

  constructor(
    private popoverRef: PopoverRef,
    private authService: AuthenticationService,
    private dialog: MatDialog,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private alertService: AlertService,
    private cdRef: ChangeDetectorRef,
    private reportsService: GenericReportsService,
    private processMenuService: ProcessMenuService
  ) {
    this.matIconRegistry.addSvgIcon(
      'linkedin',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/img/demo/rounded_linkedin.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'disable-linkedin',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/img/demo/rounded_linkedin-disable.svg')
    );
  }

  private initializeDefaultValues() {
    this.reportId = 0;
    this.reportTypeId = 0;
    this.buttonName = '';
    this.isDefault = false;
    this.appliedFilter = null;
    this.filteredValues = new RunReport();
    this.ModuleName = null;
    this.ModuleId = null;
    this.selectedData = [];
    this.resetDataProperties();
  }

  private resetDataProperties() {
    this.startDate = null;
    this.endDate = null;
    this.outstartDate = null;
    this.outendDate = null;
    this.fnstartDate = null;
    this.fnendDate = null;
    this.erstartDate = null;
    this.erendDate = null;
    this.dbHashTags = '';
    this.SelectedKeywords = [];
    this.startdaterangeValues = new DateRange();
    this.enddaterangeValues = new DateRange();
    this.isDisabled = true;
    this.resetHashTags = false;
  }

  ngOnInit(): void {debugger;
    this.loginUser = this.authService.getLoginUser();
    if (this.loginUser) {debugger;
      this.initializeDefaultValues();
      this.initializePopoverData();
      this.setupClickSubscription();
      
      this.clickSubject.pipe(
        debounceTime(500),
        takeUntil(this.unsubscribe$)
      ).subscribe(() => {debugger;
        this.emitFinalData();
      });
    }
  }

  private initializePopoverData() {debugger;
    const ids: any = this.popoverRef.data;
    if (this.isValidPopoverData(ids)) {
      this.setPopoverData(ids);
      this.getReportFilters();
    }
  }

  private isValidPopoverData(ids: any): boolean {debugger;
    return ids && ids.reportTypeId > 0 && ids.reportId > 0;
  }

  private setPopoverData(ids: any) {debugger;
    this.reportId = Number(ids.reportId);
    this.reportTypeId = Number(ids.reportTypeId);
    this.buttonName = ids.btnName || '';
    this.isDefault = ids.isDefault || false;
    this.appliedFilter = ids.applied || null;
    this.filteredValues = ids.filteredvalues || new RunReport();
    this.ModuleName = ids.pmoduleName || null;
    this.ModuleId = this.ModuleName ? UserModules[this.ModuleName] : null;
  }

  private setupClickSubscription() {
    this.clickSubject.pipe(
      debounceTime(500),
      takeUntil(this.unsubscribe$)
    ).subscribe(() => {
      this.emitFinalData();
    });
  }


  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.initializeDefaultValues();
  }


  getReportFilters() {debugger;
    if (!this.loginUser?.Company?.Id || !this.reportTypeId || !this.reportId) {
      return;
    }

    this.reportsService.GetReportFilters(this.loginUser.Company.Id, this.reportTypeId, this.reportId)
      .subscribe({
        next: (response) => {
          if (response?.Data) {
            this.reportParametersMetaData = response.Data;
            this.applyFiltersIfNeeded();
          }
          this.detectChanges();
        },
        error: (error) => {
          this.alertService.error(error);
          this.detectChanges();
        }
      });
  }

  private applyFiltersIfNeeded() {
    if (this.reportParametersMetaData?.ReportFilters) {
      this.reportParametersMetaData.ReportFilters.forEach(filter => {
        if (this.shouldApplyFilter(filter)) {
          this.applyFilterData(filter);
        }
      });
    }
  }

  private shouldApplyFilter(filter: ReportFilters): boolean {debugger;
    return this.appliedFilter === 'Applied' || 
         this.filteredValues?.ReportParameterValues?.length > 0;
  }

  
  applyFilterData(filter: ReportFilters) {debugger;
    const selectedValue = this.filteredValues.ReportParameterValues.find(
      i => i.ParameterName === filter.FieldDataName
    )?.ParameterValue;

    if (this.appliedFilter === 'Applied' && selectedValue) {
      this.processFilterData(filter, selectedValue);
    } else 
    {
      const defaultValue = filter.FieldSelectedValue;
      this.processFilterData(filter, defaultValue);
    }
  }

  // processFilterData(filter: ReportFilters, selectedValue: string) {
  //   let value: any;

  //   if (filter.FieldDataName === 'PERIOD') {
  //     value = JSON.parse(selectedValue);
  //     if (value && value.Period) {
  //       filter.FieldSelectedValue = value.Period.toString();
  //     }
  //     if (value && value.FromDate) {
  //       this.startDate = new Date(value.FromDate);
  //       this.outstartDate = this.startDate;
  //     }
  //     if (value && value.ToDate) {
  //       this.endDate = new Date(value.ToDate);
  //       this.outendDate = this.endDate;
  //     }
  //   } else if (filter.FieldDataName === 'FNSTARTPERIOD') {
  //     value = JSON.parse(selectedValue);
  //     if (value && value.StartDate) {
  //       this.fnstartDate = new Date(value.StartDate);
  //       this.startdaterangeValues.StartDate = this.fnstartDate;
  //     }
  //     if (value && value.EndDate) {
  //       this.fnendDate = new Date(value.EndDate);
  //       this.startdaterangeValues.EndDate = this.fnendDate;
  //     }
  //     filter.FieldSelectedValue = JSON.stringify(this.startdaterangeValues);
  //   } else if (filter.FieldDataName === 'FNENDPERIOD') {
  //     value = JSON.parse(selectedValue);
  //     if (value && value.StartDate) {
  //       this.erstartDate = new Date(value.StartDate);
  //       this.enddaterangeValues.StartDate = this.erstartDate;
  //     }
  //     if (value && value.EndDate) {
  //       this.erendDate = new Date(value.EndDate);
  //       this.enddaterangeValues.EndDate = this.erendDate;
  //     }
  //     filter.FieldSelectedValue = JSON.stringify(this.enddaterangeValues);
  //   } else if (filter.FieldDataName === 'HashTags') {
  //     this.dbHashTags = selectedValue;
  //   } else if (filter.FieldDataName === 'Skills') {
  //     this.SelectedKeywords = selectedValue.split(',');
  //   } else {
  //     filter.FieldSelectedValue = selectedValue;
  //   }

  //   this.SelectedData(filter.FieldSelectedValue, filter);
  // }
  processFilterData(filter: ReportFilters, selectedValue: string) {
    let value: any;
  
    if (filter.FieldDataName === 'PERIOD') {
      value = selectedValue ? JSON.parse(selectedValue) : null;
      if (value && value.Period) {
        filter.FieldSelectedValue = value.Period.toString();
      }
      
      this.startDate = value && value.FromDate ? new Date(value.FromDate) : null;
      this.outstartDate = this.startDate;
      
      this.endDate = value && value.ToDate ? new Date(value.ToDate) : null;
      this.outendDate = this.endDate;
    } else if (filter.FieldDataName === 'FNSTARTPERIOD') {
      value = selectedValue ? JSON.parse(selectedValue) : null;
      
      this.fnstartDate = value && value.StartDate ? new Date(value.StartDate) : null;
      this.startdaterangeValues.StartDate = this.fnstartDate;
      
      this.fnendDate = value && value.EndDate ? new Date(value.EndDate) : null;
      this.startdaterangeValues.EndDate = this.fnendDate;
      
      filter.FieldSelectedValue = JSON.stringify(this.startdaterangeValues);
    } else if (filter.FieldDataName === 'FNENDPERIOD') {
      value = selectedValue ? JSON.parse(selectedValue) : null;
      
      this.erstartDate = value && value.StartDate ? new Date(value.StartDate) : null;
      this.enddaterangeValues.StartDate = this.erstartDate;
      
      this.erendDate = value && value.EndDate ? new Date(value.EndDate) : null;
      this.enddaterangeValues.EndDate = this.erendDate;
      
      filter.FieldSelectedValue = JSON.stringify(this.enddaterangeValues);
    } else if (filter.FieldDataName === 'HashTags') {
      this.dbHashTags = selectedValue;
    } else if (filter.FieldDataName === 'Skills') {
      this.SelectedKeywords = selectedValue ? selectedValue.split(',') : [];
    } else {
      filter.FieldSelectedValue = selectedValue;
    }
  
    this.SelectedData(filter.FieldSelectedValue, filter);
  }


  // setPeriodDates(selectedValue: any, filter: ReportFilters) {
  //   const value = JSON.parse(selectedValue);

  //   if (value && value.Period) {
  //     this.startDate = value.FromDate ? new Date(value.FromDate) : null;
  //     this.endDate = value.ToDate ? new Date(value.ToDate) : null;

  //     // Prepare the complete object to update FieldSelectedValue
  //     const periodData = {
  //       Period: value.Period.toString(),
  //       FromDate: value.FromDate ? new Date(value.FromDate) : null,
  //       ToDate: value.ToDate ? new Date(value.ToDate) : null
  //     };

  //     // Convert the object to a string before assigning to FieldSelectedValue
  //     filter.FieldSelectedValue = JSON.stringify(periodData);

  //     // Pass the complete 'filter' object with updated FieldSelectedValue
  //     this.updateSelectedData(filter, filter.FieldSelectedValue);
  //   }
  // }


  // setDateRange(selectedValue: any, dateRange: DateRange, startDateKey: string, filter: ReportFilters) {
  //   const value = JSON.parse(selectedValue);
  //   dateRange.StartDate = new Date(value.StartDate);
  //   dateRange.EndDate = new Date(value.EndDate);
  //   this[startDateKey] = dateRange.StartDate;
  //   const dateRangeJson = JSON.stringify(dateRange);
  //   this.updateSelectedData(filter, dateRangeJson);
  // }



  updateSelectedData(filter: ReportFilters, value: any) {
    const index = this.selectedData.findIndex(x => x.name === filter.FieldDataName);
    if (index !== -1) {
      this.selectedData.splice(index, 1);
    }
    this.selectedData.push({ name: filter.FieldDataName, value, id: filter.ReportParamMetaDataId.toString() });
  }

  SelectedData(event: any, selectedfield: ReportFilters) {
    if (this.selectedData.length > 0) {
      const index = this.selectedData.findIndex(x => x.name === selectedfield.FieldDataName);
      if (index !== -1) {
        this.selectedData.splice(index, 1);
      }
    }

    if (selectedfield.FieldDataName === "PERIOD") {
      this.selectedData.push({ name: selectedfield.FieldDataName, value: Number(event), id: selectedfield.ReportParamMetaDataId.toString() });
      this.setDatePeriod(event);
    } else {
      this.selectedData.push({ name: selectedfield.FieldDataName, value: event, id: selectedfield.ReportParamMetaDataId.toString() });
    }
  }

  SelectedPOC(event: any, selectedfield: ReportFilters) {
    const index = this.selectedData.findIndex(x => x.name === selectedfield.FieldDataName);
    if (index !== -1) {
      this.selectedData.splice(index, 1);
    }
    this.selectedData.push({ name: selectedfield.FieldDataName, value: event, id: selectedfield.ReportParamMetaDataId.toString() });
  }

  SelectStartDateRange(event: any, selectedfield: ReportFilters) {debugger;
    if (event.FDate) {
      this.startdaterangeValues.StartDate = event.FDate;
    }
    if (event.TDate) {
      this.startdaterangeValues.EndDate = event.TDate;
    }

    if (this.selectedData.length > 0) {
      const index = this.selectedData.findIndex(x => x.name == selectedfield.FieldDataName);
      if (index !== -1) {
        this.selectedData.splice(index, 1);
      }
    }
    let daterangeJson: any;
    daterangeJson = JSON.stringify(this.startdaterangeValues);
    this.selectedData.push({ name: selectedfield.FieldDataName, value: daterangeJson, id: selectedfield.ReportParamMetaDataId.toString() });
  }

  SelectEndDateRange(event: any, selectedfield: ReportFilters) {debugger;
    if (event.FDate) {debugger;
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

  changeFilterDate(event: any) {
    this.outstartDate = event.FDate;
    this.outendDate = event.TDate;
    this.detectChanges();
  }

  GetSelectedHashTags(event: any, selectedfield: ReportFilters) {
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

  GetSelectedSkills(event: any, selectedfield: ReportFilters) {
    if (this.selectedData.length > 0) {
      const index = this.selectedData.findIndex(x => x.name == selectedfield.FieldDataName);
      if (index !== -1) {
        this.selectedData.splice(index, 1);
      }
    }
    let selectedskills = event.map(item => item).join(',');
    this.selectedData.push({ name: selectedfield.FieldDataName, value: selectedskills, id: selectedfield.ReportParamMetaDataId.toString() });
  }


  setDatePeriod(id: string) {
    switch (id) {
      case '1':
        this.isDisabled = false;
        //this.startDate = new Date();
        //this.endDate = new Date();
        break;
      case '2':
        this.isDisabled = true;
        let currentdate = new Date();
        this.startDate = new Date();
        this.endDate = currentdate.setDate(currentdate.getDate() + 1);
        break;
      case '3':
        this.isDisabled = true;
        let monday = new Date();
        this.startDate = monday.setDate(monday.getDate() - monday.getDay() + 1);
        var sunday = new Date();
        this.endDate = sunday.setDate(sunday.getDate() - sunday.getDay() + 7);
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
    this.detectChanges();
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

  runReportClick() {debugger;
    if (this.reportParametersMetaData.ReportFilters.length > 0) {
      this.clickSubject.next();
    }
  }

  private emitFinalData() {debugger;
    const FinalData = {
      Repfilter: [...this.selectedData], // Create a new array to avoid reference issues
      outstartDate: this.outstartDate,
      outendDate: this.outendDate,
      filter: "Applied"
    };
    
    console.log(FinalData);
    EmitterService.get("subreport").emit(FinalData);

    if (this.popoverRef) {
      this.initializeDefaultValues(); // Reset before closing
      this.popoverRef.close();
    }
  }


  clearFilters() {debugger;
    this.initializeDefaultValues();
    this.initializePopoverData();
    this.reportParametersMetaData = new ReportParametersMetaData();
    this.getReportFilters();
    this.resetHashTags = true;
    this.detectChanges();
  }

  
  private detectChanges() {
    if (!this.cdRef['destroyed']) {
      this.cdRef.detectChanges();
    }
  }
}
