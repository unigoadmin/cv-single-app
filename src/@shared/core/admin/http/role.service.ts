import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { BaseService } from 'src/@shared/services/base.service';
import { environment } from 'src/environments/environment';
import { throwError as observableThrowError,Observable } from 'rxjs';
import { ErrorService } from 'src/@shared/services';
import { CompanyModules, ConsultviteUser, EmployerRoles, RoleUsers, ModuleRolePermissions, Roles, Screens } from '../models';


@Injectable({
  providedIn: 'root'
})

export class RoleService extends BaseService {

  baseURI= environment.APIServerUrl+'roles';
  constructor(private http: HttpClient,
    private _errorService: ErrorService) {    
    super();      
  }

  getModuleRoles(companyId:number,moduleId:string):Observable<Roles[]>{
    return this.http.get(this.baseURI + '/moduleroles/'+companyId+'/'+moduleId)
        .pipe(map(response => <Roles[]>response)
        ,catchError((error: Response) => {
            let errorText = this._errorService.getErrorMessage(error);
            return observableThrowError(errorText);
        }));
 }

 getRolePermissions(roleId:string,moduleId:string,companyId:number,userType):Observable<Screens[]>{
    return this.http.get(this.baseURI + '/rolepermissions/'+roleId+'/'+moduleId+'/'+companyId+'/'+userType)
        .pipe(map(response => <Screens[]>response)
        ,catchError((error: Response) => {
            let errorText = this._errorService.getErrorMessage(error);
            return observableThrowError(errorText);
        }));
 }

 getRoleUnAssignedUsers(moduleId:string,companyId: number,userType:number): Observable<ConsultviteUser[]> {
  return this.http.get(this.baseURI + '/roleunassignedusers/' + moduleId +'/' + companyId + '/'+ userType)
      .pipe(map(response => <ConsultviteUser[]>response)
      ,catchError((error: Response) => {
          let errorText = this._errorService.getErrorMessage(error);
          return observableThrowError(errorText);
      }));
}

 getRoleUsers(roleId:string,moduleId:string,companyId:number,userType:number):Observable<ConsultviteUser[]>{
  return this.http.get(this.baseURI + '/roleusers/'+roleId+'/'+moduleId+'/'+companyId + '/'+ userType)
      .pipe(map(response => <ConsultviteUser[]>response)
      ,catchError((error: Response) => {
          let errorText = this._errorService.getErrorMessage(error);
          return observableThrowError(errorText);
      }));
}

  createRole(role:EmployerRoles):Observable<Roles>{
    let headers = new HttpHeaders();
    headers =  headers.append("Content-Type", 'application/json');
    return this.http.post(this.baseURI + '/createrole', role, { headers: headers })
        .pipe(map(response => <Roles>response)
        ,catchError((error: Response) => {
            let errorText = this._errorService.getErrorMessage(error);
            return observableThrowError(errorText);
        }));
  }

  updateRole(role:EmployerRoles):Observable<Roles>{
    let headers = new HttpHeaders();
    headers =  headers.append("Content-Type", 'application/json');
    return this.http.post(this.baseURI + '/updaterole', role, { headers: headers })
        .pipe(map(response => <Roles>response)
        ,catchError((error: Response) => {
            let errorText = this._errorService.getErrorMessage(error);
            return observableThrowError(errorText);
        }));
  }

  saveRolePermissions(rolesPermissions:ModuleRolePermissions): Observable<Screen[]>{
    let headers = new HttpHeaders();
    headers =  headers.append("Content-Type", 'application/json');
    return this.http.post(this.baseURI + '/saverolepermissions/',rolesPermissions, { headers: headers })
        .pipe(map(response => <Screen[]>response)
        ,catchError((error: Response) => {
            let errorText = this._errorService.getErrorMessage(error);
            return observableThrowError(errorText);
        }));
  }

  saveRoleUsers(rolesUsers:RoleUsers): Observable<ConsultviteUser[]>{
    let headers = new HttpHeaders();
    headers =  headers.append("Content-Type", 'application/json');
    return this.http.post(this.baseURI + '/saveroleusers/',rolesUsers, { headers: headers })
        .pipe(map(response => <ConsultviteUser[]>response)
        ,catchError((error: Response) => {
            let errorText = this._errorService.getErrorMessage(error);
            return observableThrowError(errorText);
        }));
  }
 
  saveRole(role:EmployerRoles):Observable<Roles>{
    let headers = new HttpHeaders();
    headers =  headers.append("Content-Type", 'application/json');
    return this.http.post(this.baseURI + '/saverole', role, { headers: headers })
        .pipe(map(response => <Roles>response)
        ,catchError((error: Response) => {
            let errorText = this._errorService.getErrorMessage(error);
            return observableThrowError(errorText);
        }));
  }

  saveRoleBySuperAdmin(role:EmployerRoles):Observable<Roles>{
    let headers = new HttpHeaders();
    headers =  headers.append("Content-Type", 'application/json');
    return this.http.post(this.baseURI + '/SaveRolePermissionsBySuperAdmin', role, { headers: headers })
        .pipe(map(response => <Roles>response)
        ,catchError((error: Response) => {
            let errorText = this._errorService.getErrorMessage(error);
            return observableThrowError(errorText);
        }));
  }

}


