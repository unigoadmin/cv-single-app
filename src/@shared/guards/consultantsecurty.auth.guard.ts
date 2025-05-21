import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class ConsultantSecurityAuthGuard implements CanActivate {

    constructor(private router: Router, private authenticationService: AuthenticationService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

        let UnAuthAccess: boolean = false;
        let loginUser = this.authenticationService.getLoginUser();
        if (this.authenticationService.isLoggedIn() && loginUser!=null)
        {
            let permissions = route.data["permissions"] as any;
            if (permissions != null) {
               
                if (loginUser != null && permissions.role != null && permissions.screens != null) {
                    if (permissions.role.includes(loginUser.Role) && this.ValidateUserPermission(permissions.screens)) {
                        return true;
                    }
                }
                UnAuthAccess = true;
            }
        }

        if (UnAuthAccess) {
            this.router.navigate(['/unauthorized']);
        }
        else if (window.location.hash && window.location.hash != '/' && !window.location.hash.includes('unauthorized')) {
            this.authenticationService.setRedirectionURL(window.location.hash.replace('#', ''));

            this.authenticationService.startAuthentication();
        }
        return false;
    }

    // ValidateUserPermission(screenName: string) {
    //     let IsValid: boolean = false;
    //     let modules = this.authenticationService.getLoginUser()?.ModulesList;
    //     if (modules != null) {
    //         let currentModule = modules.find(i=>i.ModuleName==screenName);
    //         if(currentModule!=null && currentModule.HasAccess==true){
    //             return true;
    //         }
            
    //     }
    //     return IsValid;
    // }

    ValidateUserPermission(screenNames: string[]) {
        let IsValid: boolean = false;
        let modules = this.authenticationService.getLoginUser()?.ModulesList;
        if (modules != null) {
            modules.forEach(i => {
                if (i.RoleAssociatedScreens) {
                    let Rolescreens = i.RoleAssociatedScreens.split(',');
                    const found = Rolescreens.some(r=> screenNames.indexOf(r) >= 0)
                    if(found){
                        IsValid = true;
                        return true;
                    }
                }
            })
        }
        return IsValid;
    }

}