import { Component, OnInit, OnDestroy, ChangeDetectorRef, ElementRef, Input, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxPermissionsService } from 'ngx-permissions';
// Icon imports
import icBack from '@iconify/icons-ic/twotone-arrow-back';
import icSearch from '@iconify/icons-ic/twotone-search';
import icArrowDropDown from '@iconify/icons-ic/twotone-arrow-drop-down';
// Services and models
import {
  AlertService,
  AuthenticationService,
  TimeZoneService
} from 'src/@shared/services';
import { ProcessMenuService } from 'src/@cv/services/processmenu.service';
import { GenericReportsService } from 'src/@shared/core/reports/http/genericreports.service';
import { PopoverService } from 'src/@cv/components/popover/popover.service';
import { EmitterService } from 'src/@cv/services/emitter.service';
import { ReportDataService } from 'src/@shared/services/reportsdata.service';
// Components
import { CustomizeReportComponent } from '../customize-report/customize-report.component';
import { ReportFiltersComponent } from '../report-filters/report-filters.component';
// Models
import { LoginUser } from 'src/@shared/models';
import { TableColumn } from 'src/@cv/interfaces/table-column.interface';
import { SubmissionReport } from 'src/@shared/core/reports/models/submissionreport';
import { RunReport, ReportParameterValues, TransactionalReport } from 'src/@shared/core/reports/models/transactionalreport';
import { ReportParametersMetaData, ReportFilters } from 'src/@shared/core/reports/models/reportparametersmetadata';
import { EmployerProfile } from 'src/@shared/core/jobcentral/model/employerprofile';
import { EmployeeMaster } from 'src/@cv/models/processmenu';
import { UserModules } from 'src/@cv/models/accounttypeenum';
// Utilities
import { iconsFA } from '../../../../static-data/icons-fa';
import { isNullOrUndefined } from 'src/@shared/services/helpers';
import moment from 'moment';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import * as jsPDF from "jspdf";
// Animations
import { fadeInUp400ms } from 'src/@cv/animations/fade-in-up.animation';
import { stagger40ms } from 'src/@cv/animations/stagger.animation';

import { SelectionModel } from '@angular/cdk/collections';
import { MatFormFieldDefaultOptions, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { Observable, ReplaySubject } from 'rxjs';
//import { InterviewReport } from '../core/models/interviewreport';

type AOA = any[][];

@Component({
  selector: 'cv-report-view',
  templateUrl: './report-view.component.html',
  styleUrls: ['./report-view.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger40ms
  ],
  providers: [TimeZoneService, PopoverService,
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'standard'
      } as MatFormFieldDefaultOptions
    }
  ]
})
export class ReportViewComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription[] = [];
  // Component properties
  loginUser: LoginUser;
  reportTypeId: number = 0;
  reportId: number = 0;
  isDefault: boolean = false;
  reportTypeName: string = null;
  moduleName: string = null;
  reportCategory: number = 0;
  filterApplied: string = null;
  // Data sources
  dataSource = new MatTableDataSource<any>();
  columns: TableColumn<SubmissionReport>[] = [];
  ReportDataList: any[] = [];
  ReportDataAll: any[] = [];

  // Icons
  icBack = icBack;
  filteredIcons: string;

  // Other dependencies
  FilteredValues: RunReport = new RunReport();

  public ExportXLSXData: any[];
  public fileName: string = 'Submission Report.xlsx';
  en: any;
  data: AOA = [];
  wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
  @ViewChild('PDFdata') pdfTable: ElementRef;
  @ViewChild('content', { static: false }) content: ElementRef;
  public employerProfile: EmployerProfile[] = [];

  subject$: ReplaySubject<SubmissionReport[]> = new ReplaySubject<SubmissionReport[]>(1);
  data$: Observable<SubmissionReport[]> = this.subject$.asObservable();
  mobileQuery: MediaQueryList;

  //IntvdataSource = new MatTableDataSource<InterviewReport>();
  //selection = new SelectionModel<SubmissionReport>(true, []);
  selectedDataFields: any[] = [];

  icSearch = icSearch;
  icArrowDropDown = icArrowDropDown;

  submissinReport: SubmissionReport[] = [];
  submissinReportsAll: SubmissionReport[] = [];
  //interviewReport: InterviewReport[] = [];
  //interviewReportsAll: InterviewReport[] = [];
  searchFilter: SearchFilter = new SearchFilter();
  selectedPOC: string = "ALL";
  selectedCanId: string = "ALL";
  ToDate: Date = null;
  FromDate: Date = null;
  start: FormControl = new FormControl();
  end: FormControl = new FormControl();
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
  isCustomize: boolean = false;
  public status_textClass: any = 'text-amber-contrast';
  public status_bgClass: any = 'bg-amber';
  public EmployeeList: EmployeeMaster[] = [];

  reportParametersMetaData: ReportParametersMetaData = new ReportParametersMetaData();
  public poc: string;
  public consultant: string;
  public status: string;
  public period: string;
  public startData: any;
  public endData: any;
  btnName: string = null;

  constructor(

    private httpClient: HttpClient,
    private dialog: MatDialog,
    private _alertService: AlertService,
    private _authService: AuthenticationService,
    private _service: ProcessMenuService,
    private cdRef: ChangeDetectorRef,
    private reportsService: GenericReportsService,
    private activatedroute: Router,
    private popoverService: PopoverService,
    private reportDataService: ReportDataService,
    private permissionsService: NgxPermissionsService,

    private matIconRegistry: MatIconRegistry,
    private domSanitzer: DomSanitizer,
    private router: ActivatedRoute,
  ) {
    this.matIconRegistry.addSvgIcon(
      'linkedin',
      this.domSanitzer.bypassSecurityTrustResourceUrl('assets/img/demo/rounded_linkedin.svg')
    );
    this.matIconRegistry.addSvgIcon('disable-linkedin', this.domSanitzer.bypassSecurityTrustResourceUrl('assets/img/demo/rounded_linkedin-disable.svg'));
    this.dataSource = new MatTableDataSource();
    //this.selectedDataFields = [];
  }
  _subemitter = EmitterService.get("subreport");
  ngOnInit(): void {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      const reportData = this.reportDataService.getReportData();
      console.log(reportData);
      if (reportData) {
        this.initializeReportParameters(reportData);
        this.setupEmitterSubscription();
      }
      // this.LoadPermissions(this.moduleName);
      // this.filteredIcons = iconsFA.find(iconName => iconName == "fa-filter");
      // this.getUsers();
      // this.getEmployeeAssign();
      // if (this.reportTypeId > 0 && this.reportId > 0) {
      //   this.GetReportFilters();
      // }
    }
    // this._subemitter.subscribe(res => {
    //   this.filterApplied = res.filter;
    //   this.getFilteredData(res);
    // })
  }

  private initializeReportParameters(reportData: any): void {
    this.reportTypeId = reportData.reportTypeId;
    this.reportId = reportData.reportId;
    this.isDefault = reportData.isDefault;
    this.reportTypeName = reportData.reportTypeName;
    this.moduleName = reportData.moduleName;
    this.reportCategory = reportData.category;

    this.LoadPermissions(this.moduleName);
    this.filteredIcons = iconsFA.find(iconName => iconName === "fa-filter");

    //this.getUsers();
    //this.getEmployeeAssign();

    if (this.reportTypeId > 0 && this.reportId > 0) {
      this.GetReportFilters();
    }
  }

  private setupEmitterSubscription(): void {
    this.subscriptions.push(
      EmitterService.get("subreport").subscribe({
        next: (res) => {
          this.filterApplied = res.filter;
          this.getFilteredData(res);
        },
        error: (err) => {
          this._alertService.error('Emitter error: ' + err.message);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }
  getUsers() {
    let ModuleId = UserModules[this.moduleName];
    this._service.getInternalUsersByModuleId(this.loginUser.Company.Id, ModuleId).subscribe(response => {
      this.employerProfile = response;
    }, error => {
      this._alertService.error(error);
    });
  }

  getEmployeeAssign() {
    this._service.getEmployeeAssign(this.loginUser.Company.Id).subscribe(response => {
      if (response.IsError) {
        this._alertService.error(response.ErrorMessage);
      } else {
        this.EmployeeList = response.Data;
      }
      if (!this.cdRef["distroyed"]) {
        this.cdRef.detectChanges();
      }
    }, error => {
      this._alertService.error(error);
    });
  }

  SubmitCustomize() {
    this.dialog.open(CustomizeReportComponent, {
      width: '50%',
      panelClass: "dialog-class",
      disableClose: true,
      data: { reportTypeId: this.reportTypeId, reportId: this.reportId, isDefault: this.isDefault }
    }).afterClosed().subscribe((filters) => {
      if (filters.Repfilter.length > 0 && !isNullOrUndefined(filters.reportName)) {
        let saveReport: TransactionalReport = new TransactionalReport();
        saveReport.CompanyId = this.loginUser.Company.Id;
        saveReport.CreatedBy = this.loginUser.UserId;
        saveReport.ReportTypeId = this.reportTypeId;
        saveReport.CategoryId = this.reportCategory;
        saveReport.CreatedDate = new Date();
        saveReport.ReportName = filters.reportName;
        if (filters.selectedCol.length > 0) {
          filters.selectedCol.forEach((element, i) => {
            element.DisplayOrder = i + 1;
          });
        }
        saveReport.ReportSelectedDisplayColumns = filters.selectedCol;
        filters.Repfilter.forEach(x => {
          let parametervalue: ReportParameterValues = new ReportParameterValues();
          parametervalue.ParameterValue = x.value;
          parametervalue.ParameterName = x.name;
          parametervalue.ReportParamMetaDataId = Number(x.id);
          if (x.name === "PERIOD") {
            let period = {
              Period: x.value,
              FromDate: filters.outstartDate,
              ToDate: filters.outendDate,
            }
            parametervalue.ParameterValue = JSON.stringify(period);
          }
          saveReport.ReportParameterValues.push(JSON.parse(JSON.stringify(parametervalue)))
        });
        this.saveReport(saveReport);
      }
    });
  }


  OnCloseDetail() {
    debugger;
    const val: any = this.reportParametersMetaData.Report.IsDefault;
    const CategoryVal: any = this.reportParametersMetaData.Report.CategoryId;
    if (CategoryVal == 1) {
      localStorage.setItem("Default", val.toString())
      this.activatedroute.navigate(['talent-central/ats-reports']);
    }
    else if (CategoryVal == 2) {
      localStorage.setItem("Default", val.toString())
      this.activatedroute.navigate(['/worker-central/wc-reports']);
    }
    else if (CategoryVal == 3) {
      localStorage.setItem("Default", val.toString())
      this.activatedroute.navigate(['/job-central/jc-reports']);
    }

  }
  GetReportFilters() {
    this.reportsService.GetReportFilters(this.loginUser.Company.Id, this.reportTypeId, this.reportId).subscribe(response => {
      this.reportParametersMetaData = response.Data;
      this.columns = [];
      if (this.reportParametersMetaData.ReportSelectedColumns && this.reportParametersMetaData.ReportSelectedColumns.length > 0 && !this.isDefault) {
        this.reportParametersMetaData.ReportSelectedColumns.forEach(x => {
          const list = x.cssClasses.split(',');
          const utype: 'text' | 'image' | 'badge' | 'progress' | 'checkbox' | 'button' | 'date' = x.Type.toString() as 'text' | 'image' | 'badge' | 'progress' | 'checkbox' | 'button' | 'date';
          this.columns.push({ label: x.Label, property: x.Property, type: utype, cssClasses: list, visible: x.Visible })
        });
      }
      else {
        this.reportParametersMetaData.ReportColumns.forEach(x => {
          const list = x.cssClasses.split(',');
          const utype: 'text' | 'image' | 'badge' | 'progress' | 'checkbox' | 'button' | 'date' = x.Type.toString() as 'text' | 'image' | 'badge' | 'progress' | 'checkbox' | 'button' | 'date';
          this.columns.push({ label: x.Label, property: x.Property, type: utype, cssClasses: list, visible: x.Visible })
        });
      }

      this.reportParametersMetaData.ReportFilters.forEach(x => {
        if (x.FieldDataName === "PERIOD") {
          const value: any = JSON.parse(x.FieldSelectedValue);
          if (value && value.Period) {
            x.FieldSelectedValue = value.Period.toString();
          }
        }
        this.SelectedData(x.FieldSelectedValue, x);
        //}
      })

      if (this.selectedDataFields.length > 0) {
        const FinalData = {
          Repfilter: this.selectedDataFields,
          outstartDate: null,
          outendDate: null,
          filter: null
        }
        this.getFilteredData(FinalData);
      }

    }, error => {
      this._alertService.error(error);
      if (!this.cdRef["distroyed"]) {
        this.cdRef.detectChanges();
      }
    })
  }

  SelectedData(event, selectedfield: ReportFilters) {
    if (this.selectedDataFields.length > 0) {
      const index = this.selectedDataFields.findIndex(x => x.name == selectedfield.FieldDataName);
      if (index !== -1) {
        this.selectedDataFields.splice(index, 1);
      }
    }

    if (selectedfield.FieldDataName === "PERIOD") {
      this.selectedDataFields.push({ name: selectedfield.FieldDataName, value: Number(event), id: selectedfield.ReportParamMetaDataId.toString() });
      //this.setDatePeriod(event);
    }
    else {
      this.selectedDataFields.push({ name: selectedfield.FieldDataName, value: event, id: selectedfield.ReportParamMetaDataId.toString() });
    }
  }

  getFilteredData(filters: any) {
    debugger;
    if (filters.Repfilter.length > 0) {
      let runReport: RunReport = new RunReport();
      runReport.CategoryId = this.reportCategory;
      runReport.ReportTypeId = this.reportTypeId;
      runReport.LogUserId = this.loginUser.UserId;
      runReport.CompanyId = this.loginUser.Company.Id;
      filters.Repfilter.forEach(x => {
        let parametervalue: ReportParameterValues = new ReportParameterValues();
        parametervalue.ParameterValue = x.value;
        parametervalue.ParameterName = x.name;
        parametervalue.ReportParamMetaDataId = Number(x.id);
        if (x.name === "PERIOD") {
          let period = {
            Period: x.value,
            FromDate: filters.outstartDate,
            ToDate: filters.outendDate,
          }
          parametervalue.ParameterValue = JSON.stringify(period);
        }
        runReport.ReportParameterValues.push(JSON.parse(JSON.stringify(parametervalue)));
        runReport.ReportParameterValues.forEach(x => {
          if (isNullOrUndefined(x.ReportParamMetaDataId)) {
            x.ReportParamMetaDataId = 0;
          }
        })
      });
      this.FilteredValues = runReport;
      console.log("reportview-- ", runReport);
      this.RunReport(runReport);
    }
  }

  RunReport(filter: any): void {
    this.reportsService.RunReport(filter).subscribe(
      (response: any) => {
        if (!response.IsError) {
          if (filter.ReportTypeId == 9 || filter.ReportTypeId == 10) {
            this.ReportDataList = response.Data.resdata || [];
            this.columns = response.Data.columns || [];
            this.ReportDataAll = JSON.parse(JSON.stringify(this.ReportDataList));
            this.dataSource = new MatTableDataSource(this.ReportDataList);
            this.cdRef.detectChanges();
          }
          else {
            this.ReportDataList = response.Data || [];
            this.ReportDataAll = JSON.parse(JSON.stringify(this.ReportDataList));
            this.dataSource = new MatTableDataSource(this.ReportDataList);
            this.cdRef.detectChanges();
          }
        }
      },
      (error: any) => {
        const errorMessage = error?.ErrorMessage || 'An error occurred while running the report.';
        this._alertService.error(errorMessage);
      }
    );
  }

  saveReport(filter: any) {
    this.reportsService.SaveCustomReports(filter).subscribe(response => {
      if (!response.IsError) {
        debugger;
        this._alertService.success("Report Configuration created Successfully");
        this.activatedroute.navigateByUrl('/ats-reports');

        if (this.reportCategory == 1) {
          this.activatedroute.navigate(['ats-reports']);
        }
        else if (this.reportCategory == 2) {

          this.activatedroute.navigate(['/worker-central/wc-reports']);
        }
        else if (this.reportCategory == 3) {

          this.activatedroute.navigate(['/job-central/jc-reports']);
        }
      }
    }, error => {
      this._alertService.error(error);
    })
  }
  openProcessMenu(origin: ElementRef | HTMLElement, name) {
    this.btnName = name;
    const popoverData = {
      reportTypeId: this.reportTypeId || 0,
      reportId: this.reportId || 0,
      btnName: name || '',
      isDefault: this.isDefault || false,
      applied: this.filterApplied || null,
      filteredvalues: this.FilteredValues ? { ...this.FilteredValues } : null, // Create a new object to avoid reference issues
      pmoduleName: this.moduleName || null
    };
    this.popoverService.open({
      content: ReportFiltersComponent,
      origin,
      data: popoverData,
      //data: { reportTypeId: this.reportTypeId, reportId: this.reportId, btnName: name, isDefault: this.isDefault, applied: this.filterApplied, filteredvalues: this.FilteredValues, pmoduleName: this.moduleName },
      position: [
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top'
        },
        {
          originX: 'end',
          originY: 'bottom',
          overlayX: 'end',
          overlayY: 'top',
        },
      ]
    });

  }

  ExportToExcel() {
    debugger;
    this.ExportXLSXData = [];

    // Filter columns based on reportTypeId
    let filteredColumns = this.columns;
    if (this.reportTypeId === 9 || this.reportTypeId === 10) {
      // Exclude columns containing "_ids" for reportTypeId 9 and 10
      filteredColumns = this.columns.filter(column => !column.label.includes('_Ids'));
    }

    if (filteredColumns.length > 0) {
      let header = [];
      let excelheaders = [];

      // Build header and excelheaders arrays
      filteredColumns.forEach(column => {
        header.push(column.property);
        excelheaders.push(column.label);
      });

      // Add excel headers to ExportXLSXData
      this.ExportXLSXData.push(excelheaders);

      // Process ReportDataAll for the filtered columns
      this.ReportDataAll.forEach(report => {
        if (report.SubmittedDate) {
          const date: any = moment(new Date(report.SubmittedDate)).format("MM/DD/YYYY");
          report.SubmittedDate = date;
        }
        let records = [];
        header.forEach(property => {
          records.push(report[property]);
        });
        this.ExportXLSXData.push(records);
      });
    }

    // Generate worksheet
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(this.ExportXLSXData);

    // Generate workbook and add the worksheet
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Save to file
    const wbout: ArrayBuffer = XLSX.write(wb, this.wopts);
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), this.reportTypeName + ".xlsx");
  }


  GeneratedPDFfile() {
    const path = '/assets/test.html';
    this.httpClient.get(path, { responseType: "text" }).subscribe(
      response => {
        let header = [];
        let HeaderTableData: any = '';
        let BodyTableData: any = '';
        let pdfFileName = this.reportTypeName;
        let filteredColumns = this.columns;
        if (this.reportTypeId === 9 || this.reportTypeId === 10) {
          // Exclude columns containing "_ids" for reportTypeId 9 and 10
          filteredColumns = this.columns.filter(column => !column.label.includes('_Ids'));
        }

        filteredColumns.forEach(x => {
          let label = x.label;
          if (label === "Submitted Date") {
            label = 'Date'
          }
          if (label === "Submission Status") {
            label = 'Status'
          }
          header.push(x.property);
          HeaderTableData += `<th style="border: 1px solid #ddd;padding: 8px; padding-top: 12px;padding-bottom: 12px;text-align: left;background-color: #04AA6D;color: white;font-size: 8px;width:  250px;">${label}</th>`;
        });
        this.ReportDataAll.forEach(report => {
          if (report.SubmittedDate) {
            const date: any = moment(new Date(report.SubmittedDate)).format("MM/DD/YYYY");
            report.SubmittedDate = date;
          }
          let records = [];
          let body: any = '';
          header.forEach(element => {
            body += `<td style="border: 1px solid #ddd;padding: 8px;">${isNullOrUndefined(report[element]) ? '' : report[element]}</td>`;
          });
          BodyTableData += `<tr>${body}</tr>`
        });
        response = response.replace('|HeaderTableData|', HeaderTableData)
        response = response.replace('|BodyTableData|', BodyTableData)

        var pdf: any = new jsPDF({
          orientation: 'l', // landscape
          unit: 'pt', // points, pixels won't work properly
          format: [870, 850] // set needed dimensions for any element
        });
        const margins = {
          top: 10,
          bottom: 0,
          left: 100,
          width: 870
        };
        const pdfTable = response;
        pdf.setFont("helvetica");
        pdf.setFontSize(8);
        pdf.fromHTML(pdfTable, margins.left, margins.top, {}, function () {
          pdf.save(`${pdfFileName}.pdf`);
        }, margins);

      });


  }

  LoadPermissions(ModuleName: string) {
    let perm = []; let wcperm = [];
    let talaentCenrtralModule = this.loginUser.ModulesList.find(i => i.ModuleId == "404A5725-4FB7-470D-AC0F-6AD1086A6C3B" && i.HasAccess == true);
    let WorkerCentralModule = this.loginUser.ModulesList.find(i => i.ModuleId == "D1F78D81-5F25-4F43-BF71-86BE16823816" && i.HasAccess == true);
    if (ModuleName == 'TalentCentral' && talaentCenrtralModule) {
      perm = talaentCenrtralModule.RoleAssociatedActions?.split(',');
      this.permissionsService.loadPermissions(perm);
    }
    else if (ModuleName == 'WorkerCentral' && WorkerCentralModule) {
      wcperm = WorkerCentralModule.RoleAssociatedActions?.split(',');
      this.permissionsService.loadPermissions(wcperm);
    }

  }

}



export class SearchFilter {
  CompanyId: number;
  CandidateId?: number;
  UserId: string;
  POC: string;
  FromDate: Date;
  ToDate: Date;
  constructor() {
    this.CompanyId = 0;
    this.CandidateId = null;
    this.UserId = null;
    this.POC = null;
    this.FromDate = new Date();
    this.ToDate = new Date();
  }

}
