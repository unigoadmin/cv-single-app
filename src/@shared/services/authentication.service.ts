import { Injectable } from '@angular/core';
import { LoginUser } from '../models/login-user';
import { Router } from '@angular/router';
import { UserManager, UserManagerSettings, User, WebStorageStateStore } from 'oidc-client';
import { environment } from 'src/environments/environment';
import { LoginUserModules } from '../models/login-user-modules';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable()
export class AuthenticationService {

  private manager = new UserManager(getClientSettings());
  private user: User = null;
  private $loginUserSubject = new Subject<LoginUser>();
  $loginUser = this.$loginUserSubject.asObservable();

  private baseUrl: string;
  private redirectionUrl: string;
  constructor(private router: Router) {
    this.manager.getUser().then(user => {
      this.user = user;
    });
  }

  isLoggedIn(): boolean {
    return this.user != null && !this.user.expired;
  }

  getClaims(): any {
    return this.user?.profile;
  }

  getAuthorizationHeaderValue(): string {
    return `${this.user?.token_type} ${this.user?.access_token}`;
  }

  startAuthentication(): Promise<void> {
    return this.manager.signinRedirect();
  }

  getUserName(): string {

    return `${this.user?.profile?.name}`;
  }

  getUserId(): string {
    return `${this.user?.profile?.email}`;
  }

  getStoredUser(): User | null {
    try {
      const storedUser = sessionStorage.getItem(`oidc.user:${environment.identityServerUrl}:consultvite_ui`);
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && parsedUser.access_token) {
          return parsedUser;
        }
      }
    } catch (e) {
      console.error('Error getting stored user:', e);
    }
    return null;
  }

  async completeAuthentication(): Promise<void> {
    try {
      // Check if we're returning from Identity Server
      const hash = window.location.hash;
      if (hash && hash.length > 0) {
        const user = await this.manager.signinRedirectCallback();
        this.user = user;
        return;
      }

      // During refresh, try to restore the user
      const storedUser = this.getStoredUser();
      if (storedUser) {
        this.user = storedUser;
        return;
      }

      // If no user is found and we're not on auth-callback, redirect to login
      if (!window.location.pathname.includes('auth-callback')) {
        await this.startAuthentication();
      }
    } catch (error) {
      console.error('Error completing authentication:', error);
      if (!window.location.pathname.includes('auth-callback')) {
        await this.startAuthentication();
      }
    }
  }

  // completeAuthentication(): Promise<void> {
  //   return this.manager.signinRedirectCallback().then(user => {
  //     this.user = user;

  //   });
  // }

  signOut(): Promise<void> {
    return this.manager.signoutRedirect({ 'id_token_hint': this.user.id_token });
  }

  logout(): void {
    sessionStorage.clear();
    this.signOut();
  }

  setLoginUser(loginUser: LoginUser) {
    sessionStorage.setItem(environment.LoginUserKeyName, JSON.stringify(loginUser))
    this.$loginUserSubject.next(loginUser);
  }


  getLoginUser(): LoginUser {
    let loginUser: LoginUser = null;
    if (sessionStorage.getItem(environment.LoginUserKeyName)) {
      loginUser = JSON.parse(sessionStorage.getItem(environment.LoginUserKeyName));
    }

    // if(typeof loginUser == 'undefined' || loginUser==null){
    //     loginUser = null;
    //     this.logout();
    // }

    return loginUser;
  }

  checkUserLogin(): LoginUser {
    let loginUser: LoginUser = null;
    if (sessionStorage.getItem(environment.LoginUserKeyName))
      loginUser = JSON.parse(sessionStorage.getItem(environment.LoginUserKeyName));

    if (typeof loginUser == 'undefined' || loginUser == null) {
      loginUser = null;
    }

    return loginUser;
  }

  getLoginUserModule(moduleName: string): LoginUserModules {
    let logInUserModule: LoginUserModules = null;
    let loginUser: LoginUser = null;
    loginUser = JSON.parse(sessionStorage.getItem(environment.LoginUserKeyName));

    if (typeof loginUser == 'undefined' || loginUser == null) {
      logInUserModule = null;
      loginUser = null;
      this.logout();
    }
    else {
      logInUserModule = loginUser.ModulesList.find(m => m.ModuleName == moduleName);
    }

    return logInUserModule;
  }
  setRedirectionURL(url: string) {
    sessionStorage.setItem(environment.RedirectionUrlKeyName, url);
  }
  getRedirectionURL() {
    this.redirectionUrl = null;
    if (sessionStorage.getItem(environment.RedirectionUrlKeyName)) {
      this.redirectionUrl = sessionStorage.getItem(environment.RedirectionUrlKeyName);
    } else {
      return this.redirectionUrl = null;
    }

    if (typeof this.redirectionUrl == 'undefined' || this.redirectionUrl == null || this.redirectionUrl == undefined) {
      return this.redirectionUrl = null;
    } else {
      return this.redirectionUrl;
    }

  }
  clearRedirectionURL() {
    sessionStorage.removeItem(environment.RedirectionUrlKeyName);
  }
}

export function getClientSettings(): UserManagerSettings {
  return {
    authority: environment.identityServerUrl,
    client_id: 'consultvite_ui',
    redirect_uri: window.location.protocol + '//' + window.location.host + '/#/auth-callback#',
    post_logout_redirect_uri: environment.publicAppUrl,
    response_type: "id_token token",
    scope: "openid profile email role api.read",
    filterProtocolClaims: true,
    loadUserInfo: true,
    userStore: new WebStorageStateStore({ store: window.sessionStorage })
    //silent_redirect_uri='http://localhost:4200/#/auth-callback/'
  };
}



