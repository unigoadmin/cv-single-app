import { Component, OnInit,ViewChild } from '@angular/core';
import { ReportsService } from '../reports.service';
import { AlertService, AuthenticationService, TimeZoneService } from 'src/@shared/services';
import { LoginUser } from 'src/@shared/models';
import { ReportParameterValues, TransactionalReport } from '../../core/models/transactionalreport';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import icEdit from '@iconify/icons-ic/twotone-edit';
import { isNullOrUndefined } from 'src/@shared/services/helpers';
import { SubmissinReport } from '../../core/models/submissionreport';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmDeleteDialogComponent } from 'src/@shared/components/filter-components/confirm-delete-dialog/confirm-delete-dialog.component';
import { ConfirmDialogModel, ConfirmDialogModelResponse } from 'src/@shared/models/confirmdialogmodel';
import { CustomizeReportComponent } from 'src/@shared/components/shared-reports/customize-report/customize-report.component';
import { RptSchedulingComponent } from 'src/@shared/components/shared-reports/rpt-scheduling/rpt-scheduling.component';
import { ReportDataService } from 'src/@shared/services/reportsdata.service';

@Component({
  selector: 'cv-custom-reports',
  templateUrl: './custom-reports.component.html',
  styleUrls: ['./custom-reports.component.scss']
})
export class CustomReportsComponent implements OnInit {
  empdisplayedColumns: string[] = ['ReportName', 'ReportTypeName', 'CreatedByName', 'CreatedDate','Actions'];
  loginUser: LoginUser;
  transactionalReport: TransactionalReport[] = [];
  dataSource = new MatTableDataSource(this.transactionalReport);
  sort: MatSort;
  @ViewChild(MatSort) set matSort(sort: MatSort) {
    this.sort = sort;
  }
  icEdit = icEdit;
  submissinReport: SubmissinReport[] = [];
  submissinReportsAll: SubmissinReport[] = [];
  DialogResponse:ConfirmDialogModelResponse;
  constructor(
    
    private dialog: MatDialog,
    private _alertService: AlertService,
    private _authService: AuthenticationService,
    private reportsService: ReportsService,
    private router: Router,
    private route: ActivatedRoute,
    private reportdataservice: ReportDataService,
  ) { }

  ngOnInit(): void {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      this.GetCustomReports()
    }
  }

  GetCustomReports() {
    this.reportsService.GetCustomReports(this.loginUser.Company.Id,1).subscribe(response => {
      this.transactionalReport = response.Data;
      this.dataSource.data = response.Data;
    }, error => {
      this._alertService.error(error);
    })
  }

  EditCustomization(row:TransactionalReport){
    this.dialog.open(CustomizeReportComponent, {
      width: '50%',
      panelClass: "dialog-class",
      disableClose: true,
      data: { reportTypeId: row.ReportTypeId, reportId: row.ReportId, isDefault: false }
    }).afterClosed().subscribe((filters) => {
      if (filters.Repfilter.length > 0 && !isNullOrUndefined(filters.reportName)) {
        let saveReport: TransactionalReport = new TransactionalReport();
        saveReport.CompanyId = this.loginUser.Company.Id;
        saveReport.CreatedBy = this.loginUser.UserId;
        saveReport.ReportTypeId = row.ReportTypeId;
        saveReport.CategoryId = 1;
        saveReport.CreatedDate = new Date();
        saveReport.ReportName = filters.reportName;
        saveReport.ReportId = filters.reportId;
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
          parametervalue.ReportParamMetaDataId = + x.id;
          if(x.name==="PERIOD"){
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

  saveReport(filter) {
    this.reportsService.SaveCustomReports(filter).subscribe(response => {
      if (!response.IsError) {
        this.submissinReport = response.Data;
        this._alertService.success("Report Configuration Updated Successfully");
        this.router.navigateByUrl('/ats-reports');
        // this.submissinReportsAll = JSON.parse(JSON.stringify(this.submissinReport));
        // this.submissinReport.forEach(element => {
        //   element.SubmittedDate = TimeZoneService.getRelativeTime(element.SubmittedDate, true);
        // });
        //this.dataSource = new MatTableDataSource(this.submissinReport);
      }
    }, error => {
      this._alertService.error(error);
    })
  }

  

  OnSchedule(row:TransactionalReport){
    this.dialog.open(RptSchedulingComponent, {
      width: '60%',
      panelClass: "dialog-class",
      disableClose: true,
      data: { reportTypeId: row.ReportTypeId, reportId: row.ReportId, isDefault: false, taskId:row.TaskId }
    }).afterClosed().subscribe((filters) => { 
      this.GetCustomReports();
    });
  }

  OnDelete(row:TransactionalReport){
    const message = 'Custom Report with name '+row.ReportName +' will be Deleted ?'
    const dialogData = new ConfirmDialogModel("Delete Report", message);
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      width: '60%',
      data: dialogData,
      disableClose:true,
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      this.DialogResponse = dialogResult;
      if(this.DialogResponse.Dialogaction==true){
         this.confirmdeleteRecord(row);
      }
    });
  }

  confirmdeleteRecord(row:TransactionalReport){
    if (row.ReportId > 0) {
      const pfilters = {
        ReportId:row.ReportId,
        CompanyId:this.loginUser.Company.Id,
        UpdatedBy:this.loginUser.UserId,
      };
         this.reportsService.DeleteCustomReports(pfilters).subscribe(response => {
           if(response.IsError==false){
             this._alertService.success("Report Deleted Successfully");
             this.GetCustomReports();
           }
         },
         error => {
           this._alertService.error(error);
         })
       }
  }

  onRunReport(report: any, module:string): void {
    console.log(report);
    this.reportdataservice.setReportData({
      reportTypeId: report.ReportTypeId,
      reportId: report.ReportId,
      isDefault: report.IsDefault,
      reportTypeName: report.ReportName,
      moduleName: module,
      category: report.CategoryId,
    });
  
    // Navigate without route parameters
    this.router.navigate(
      ['report-view'], 
      { relativeTo: this.route }
    );
    
  }

}
