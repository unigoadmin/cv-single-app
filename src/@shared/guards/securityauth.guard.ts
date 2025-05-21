import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class SecurityAuthGuard implements CanActivate {

    constructor(private router: Router, private authenticationService: AuthenticationService) { }

    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {debugger;
        // First check if user is logged in
        if (!this.authenticationService.isLoggedIn()) {
           
            // Save the current URL for redirection after auth
            if (state.url && !state.url.includes('unauthorized')) {
                this.authenticationService.setRedirectionURL(state.url);
            }
            this.authenticationService.startAuthentication();
            return false;
        }

        // Then check permissions
        let loginUser = this.authenticationService.getLoginUser();
        if (!loginUser) {
            this.authenticationService.startAuthentication();
            return false;
        }

        let permissions = route.data["permissions"] as any;
        if (permissions) {
            if (loginUser && permissions.role && permissions.screens) {
                if (permissions.role.includes(loginUser.Role) && this.ValidateUserPermission(permissions.screens)) {
                    return true;
                }
            }
            // If we get here, user doesn't have required permissions
            this.router.navigate(['/unauthorized']);
            return false;
        }

        return true;
    }

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