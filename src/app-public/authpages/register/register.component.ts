import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import icVisibility from '@iconify/icons-ic/twotone-visibility';
import icVisibilityOff from '@iconify/icons-ic/twotone-visibility-off';
import { FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { fadeInUp400ms } from 'src/@cv/animations/fade-in-up.animation';
import { AlertService, AuthenticationService, CountryCodeService } from 'src/@shared/services';
import { SignUp } from '../../modules/initial/core/models';
import { MatDialog } from '@angular/material/dialog';
import { CountriesList, Country } from 'src/@shared/models';
import { IdentityService } from '../../modules/initial/core/http/identity.service';
import { TermsAndCondtionsComponent } from 'src/@shared/components/terms-and-condtions/terms-and-condtions.component';
import { ValidationService } from 'src/@cv/services/validation.service';

@Component({
  selector: 'vex-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  animations: [
    fadeInUp400ms
  ],
})
export class RegisterComponent implements OnInit {

  form: FormGroup;

  inputType = 'password';
  confinputType = 'password';
  visible = false;
  confvisible = false;

  icVisibility = icVisibility;
  icVisibilityOff = icVisibilityOff;

  signUpUser: SignUp = new SignUp();
  countries: Country[];
  selectedCountry: CountriesList;
  signUpSuccess: boolean = false;
  constructor(private dialog: MatDialog,
    private router: Router,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private authService: AuthenticationService,
    private _countryCodeService: CountryCodeService,
    private _alertService: AlertService,
    private _identityService: IdentityService) {
    this.signUpUser.PhoneExt = 'us';
    this.form = this.fb.group({
      FirstName: [null, [Validators.required, ValidationService.onlyAlphabetsValidator]],
      LastName: [null, [Validators.required, ValidationService.onlyAlphabetsValidator]],
      Email: [null, [Validators.required, ValidationService.emailValidator]],
      PhoneExt: [null, [Validators.required]],
      PhoneNumber: [null, [Validators.required,ValidationService.phonenumValidator]],
      Password: [null, [Validators.required]],
      ConfirmPassword: [null, [Validators.required]],
      CompanyName: [null, [Validators.required]],
      Website: [null, [Validators.required]],
      AgreeTAC: [null, [Validators.requiredTrue]]
    },{validator: this.passwordMatchValidator} );

  }

  ngOnInit() {

    this.getCountyCodes();
  }

  getCountyCodes() {
    this._countryCodeService.GetCountryCodes().subscribe(
      countries => {
        this.countries = countries;
      }),
      error => {
        this._alertService.error("Error while loading country codes.");
      }
  }

  toggleVisibility() {
    if (this.visible) {
      this.inputType = 'password';
      this.visible = false;
      this.cd.markForCheck();
    } else {
      this.inputType = 'text';
      this.visible = true;
      this.cd.markForCheck();
    }
  }

  conftoggleVisibility() {
    if (this.confvisible) {
      this.confinputType = 'password';
      this.confvisible = false;
      this.cd.markForCheck();
    } else {
      this.confinputType = 'text';
      this.confvisible = true;
      this.cd.markForCheck();
    }
  }

  login() {
    this.authService.startAuthentication();
  }

  viewTermsAndCondtions() {
    this.dialog.open(TermsAndCondtionsComponent, {
      data: null,
      width: '900px',
      disableClose: false
    });
  }

  createAccount() {

    this.signUpUser.Role = 3;
    this.signUpUser.EmployerType = 1;
    //this.signUpUser.CompanyName = form.CompanyName.replace(/\b\w/g, first => first.toLocaleUpperCase());
    //this.signUpUser.Website = form.Website;
    //this.signUpUser.FirstName = form.FirstName.replace(/\b\w/g, first => first.toLocaleUpperCase());
    //this.signUpUser.LastName = form.LastName.replace(/\b\w/g, first => first.toLocaleUpperCase());
    //this.signUpUser.Email = form.Email;
    //this.signUpUser.PhoneNumber = form.PhoneNumber;
    //this.signUpUser.PhoneExt = form.PhoneExt;
    //this.signUpUser.Password = form.Password;
    //this.signUpUser.ConfirmPassword = form.ConfirmPassword;
    //this.signUpUser.AgreeTAC = form.AgreeTAC;


    if (this.signUpUser.PhoneExt) {
      let selectCountryCode = this.countries.find(i => i.iso2.toLowerCase() == this.signUpUser.PhoneExt);
      this.signUpUser.PhoneCountryCode = '+' + selectCountryCode.dialCode;
    }

    this._identityService.register(this.signUpUser)
      .subscribe(
        response => {
          this.signUpSuccess = true;
        },
        error => {
          this._alertService.error(error);
        });
  }

  resendActivation() {
    this._identityService.reSendActivationLink(this.signUpUser)
      .subscribe(
        response => {
          this._alertService.success("Activation link sent successfully");
        },
        error => {
          this._alertService.success("Error in while resending Activation link");
        });
  }

  passwordMatchValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
    const password = control.get('Password');
    const confirmPassword = control.get('ConfirmPassword');
  
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
  
    return null;
  };

  public findInvalidControls() {
    const invalid = [];
    const controls = this.form.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
        console.log(name);
      }
    }
    console.log(invalid);
    return invalid;
  }


}
