import { NgModule, Optional, SkipSelf } from '@angular/core'; 

import { AuthGuard } from './guards/auth.guard';
import { NoAuthGuard } from './guards/no-auth.guard'; 
import { EnsureModuleLoadedOnceGuard } from './guards/ensure-moduleloaded-once.guard';
import {SecurityAuthGuard} from './guards/securityauth.guard';
import {ConsultantSecurityAuthGuard} from './guards/consultantsecurty.auth.guard';
import {AdminPanelSecurityAuthGuard } from './guards/adminpanel.security.guard';
import {SuperAdminPanelSecurityAuthGuard} from './guards/superadminpanel.security.guard';

import { HttpTokenInterceptor } from './interceptor/http-token.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { InternalUserProfileModule } from  './components/internal-user-profile/internal-user-profile.module';
import { ConsultantUserProfileModule } from  './components/consultant-user-profile/consultant-user-profile.module';
import { ChangePasswordModule } from  './components/change-password/change-password.module';
import { NgxPermissionsModule } from 'ngx-permissions';



import { 
  AlertService,
  ErrorService,
  AuthenticationService,
  TimeZoneService,
  CountryCodeService,
  EventEmitterService,
} from './services';

  import { 
    AccountService,
    CommonService,
    FileStoreService
  } from './http';
import { JCSecurityAuthGuard } from './guards/jc.auth.guard';


const SHARED_GUARDS = [
  AuthGuard ,
  NoAuthGuard,
  SecurityAuthGuard,
  ConsultantSecurityAuthGuard,
  AdminPanelSecurityAuthGuard,
  SuperAdminPanelSecurityAuthGuard,
  JCSecurityAuthGuard
]

const SHARED_SERVICES = [
  AlertService,
  ErrorService,
  AuthenticationService,
  TimeZoneService,
  CountryCodeService,
  EventEmitterService
]

const SHARED_HTTPSERVICES = [
  AccountService,
  CommonService,
  FileStoreService
]


@NgModule({
  imports: [
    ToastrModule.forRoot({
    positionClass: 'toast-top-center',
    }), 
    InternalUserProfileModule,
    ConsultantUserProfileModule,
    ChangePasswordModule,
    NgxPermissionsModule.forRoot()
  ],
  providers: [
   ...SHARED_GUARDS,
   ...SHARED_SERVICES,
   ...SHARED_HTTPSERVICES,
  
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpTokenInterceptor,
      multi: true
    }
  ],
  exports:[NgxPermissionsModule],
  declarations: [
  ],
  
})
export class SharedModule extends EnsureModuleLoadedOnceGuard {

  constructor(@Optional() @SkipSelf() parentModule: SharedModule) {
    super (parentModule);
  }

}