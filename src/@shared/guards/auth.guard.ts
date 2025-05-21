import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private authenticationService: AuthenticationService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {debugger;
    // Check for access_token and token_type in session storage
    const storedUser = sessionStorage.getItem(`oidc.user:${environment.identityServerUrl}:consultvite_ui`);
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && parsedUser.access_token && parsedUser.token_type) {
          return true;
        }
      } catch (e) {
        console.error('Error parsing stored user:', e);
      }
    }

    // If no valid token found, store current URL and redirect to auth-callback
    if (state.url && state.url !== '/' && !state.url.includes('unauthorized')) {
      this.authenticationService.setRedirectionURL(state.url);
    }

    // Always redirect to initial auth-callback
    this.router.navigate(['/initial/auth-callback']);
    return false;
  }
}