import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import moment from 'moment';
export class ValidationService {
    static getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
        let config = {
            'required': 'This Field is Required',
            'invalidEmailAddress': 'Invalid email address',
            'invaliPhoneNumber': 'Invalid phone number',
            'invalidPhoneNumber': 'Invalid phone number',
            'minlength': `Minimum length ${validatorValue.requiredLength}`,
            'invalidZipCode': 'Invalid Zip Code',
            'onlyAlhabets': 'Invalid Text',
            'invalidTotalHours': 'Invalid Total Hours',
            'invalidPassword': 'New password and confirm password do not match',
            'none': '',
            'invalidNumber': 'Only Numbers',
            'noSpace': 'Space Nt allowed',
            'onlyStringofCharacters': 'special charasters not allowed',
            'invalidSkypeAddress': 'Invalid Skype Id',
            'pleaseremovecomma': 'Invalid Text(please remove comma)',
        };

        return config[validatorName];
    }


    static emailValidator(control) {
        if (control.value !== null && control.value !== "") {
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (control.value.match(emailRegex)) {
                return null;
            } else {
                return { 'invalidEmailAddress': true };
            }
        }
        
    }
    static LinkedIn_urlValidator(control) {
        if (control.value !== null && control.value !== "") {
            const linkedinUrlPattern = /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$/i;
            const lowercaseValue = control.value.toLowerCase();
            if (lowercaseValue === 'n/a') {
                return null; // 'N/A' or 'n/a' is considered valid
            } else if (lowercaseValue.match(linkedinUrlPattern)) {
                return null; // Valid URL
            } else {
                return { 'invalidUrl': true };
            }
        }
    }
      
    static urlValidator(control) {
        if (control.value !== null && control.value !== "") {
            if (control.value.match(/(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi)) {
                return null;
            } else {
                return { 'invalidUrl': true };
            }
        }
    }
    static phonenumValidator(control) {
        if (control.value !== null && control.value !== "") {
            if (String(control.value).match(/^\(\d{3}\) \d{3}-\d{4}$/)) {
                return null;
            } else {
                return { 'invalidPhoneNumber': true };
            }
        }
    }

    static phoneValidator(control) {
        if (control.value !== null && control.value !== "") {
            if (String(control.value).match(/^[0-9 +-\s]+$/)) {
                return null;
            } else {
                return { 'invaliPhoneNumber': true };
            }
        }
    }

    // static phoneNumberValidator(control) {
    //     if (control.value !== null && control.value !== "") {
    //         const phoneNumberPattern = /^\(\d{3}\) \d{3}-\d{4}$/;
    //         if (control.value && !phoneNumberPattern.test(control.value)) {
    //             return { 'phoneNumber': true };
    //         }
    //         else{
    //             return { 'invaliPhoneNumber': true };
    //         }
    //     }

    //     return null;
    // }

    static zipCodeValidator(control) {

        try {
            if (control.value != null && control.value != "") {
                if (String(control.value).match(/^\d{5}$/)) {
                    return null;
                }
                else {
                    return { 'invalidZipCode': true };
                }
            }
        }
        catch (Exception) {
            console.log(control.value);
            console.log(Exception.message);
        }

    }
    static TotalHoursValidator(control) {

        try {
            if (control.value != null && control.value != "") {
                if (String(control.value).match(/^[0-9]\d*(\.\d+)?$/)) {
                    if (control.value > 24) { return { 'invalidTotalHours': true }; }
                    return null;
                }
                else {
                    return { 'invalidTotalHours': true };
                }
            }
        }
        catch (Exception) {
            console.log(control.value);
            console.log(Exception.message);
        }

    }
    static onlyAlphabetsValidator(control) {
        if (control.value != null && control.value != "") {
            const alphabetsOnlyRegex = /^[a-zA-Z\s]+$/;

            if (control.value && !alphabetsOnlyRegex.test(control.value)) {
                return { alphabetsOnly: true };
              }

              return null;

            // if (control.value.match(/^[a-zA-Z\s]+$/)) {
            //     return null;
            // }
            // else {
            //     return { 'onlyAlhabets': true };
            // }
        }
    }
    static onlyAlphabetswithDotValidator(control) {
        if (control.value != null && control.value != "") {
            // ^\d{5 } (?:[-\s]\d{4 })?$
            if (control.value.match(/^[a-zA-Z\. ]*$/)) {
                return null;
            }
            else {
                return { 'onlyAlhabets': true };
            }
        }
    }

    static timeDurationValidator(control) {
        if (control.value != null && control.value != "") {
            if (control.value.match(/^(?:2[0-3]|[01][0-9]):[0-5][0-9]:[0-5][0-9]$/)) {
                return null;
            }
            else {
                return { 'Invalid Time duration': true };
            }
        }
    }
    static PasswordCompareValidator(NewPassword: string, ConfirmPassword: string) {

        return (group: FormGroup): { [key: string]: any } => {
            let NewPasswordText = group.controls[NewPassword];
            let ConfirmPasswordText = group.controls[ConfirmPassword];
            if (NewPasswordText != undefined && ConfirmPasswordText != undefined
                && NewPasswordText.value != null && ConfirmPasswordText.value != null) {
                if (NewPasswordText.value == ConfirmPasswordText.value) {
                    return null;
                }
                else if (ConfirmPasswordText.value.length >= NewPasswordText.value.length
                    && ConfirmPasswordText.value != NewPasswordText) { return { 'invalidPassword': true }; }
                else {
                    return { 'none': true };
                }
            }
        }
    }
    static OnlyNumbers(control) {
        if (control.value != null && control.value != "") {
            if (String(control.value).match(/^[0-9.\b]+$/)) {
                return null;
            }
            else {
                return { 'invalidNumber': true };
            }
        }
    }
    static nospaceValidator(control) {
        if (control.value != null && control.value != "") {
            if (String(control.value).trim() === "") {
                return { 'noSpace': true };
            }
        }
    }
    static noSpaceValidator(control) {
        if (control.value != null && control.value != "") {
            // ^\d{5 } (?:[-\s]\d{4 })?$
            if (control.value.match(/^\S*$/)) {
                return null;
            }
            else {
                return { 'onlyStringofCharacters': true };
            }
        }
    }
    static numberWithDecimalValidator(control) {
        if (control.value !== null && control.value !== "") {
            if (String(control.value).match(/^[0-9]+(\.[0-9]{1,2})?$/) && String(control.value).trim() != "") {
                return null;
            } else {
                return { 'invalidNumber': true };
            }
        }
    }
    static numberValidator(control) {
        if (control.value !== null && control.value !== "") {
            if (String(control.value).match(/^[0-9\s]+$/) && String(control.value).trim() != "") {
                return null;
            } else {
                return { 'invalidNumber': true };
            }
        }
    }
    static NumberWith2digits(control) {
        if (control.value !== null && control.value !== "") {
            //'/^[0-9]{0,2}$/'
            const regex = /^\d+(\.\d{1,2})?$/;
            if (String(control.value).match(regex) && String(control.value).trim() != "") {
                return null;
            } else {
                return { 'invalidNumber': true };
            }
        }
    }
    static ExperienceCompareValidator(MinExp: string, MaxExp: string) {

        return (group: FormGroup): { [key: string]: any } => {
            let MinExpCompare = group.controls[MinExp];
            let MaxExpCompare = group.controls[MaxExp];
            if (parseInt(MinExpCompare.value) > 0 || parseInt(MaxExpCompare.value) > 0) {
                if (MaxExpCompare.value == 0 || parseInt(MaxExpCompare.value) < parseInt(MinExpCompare.value)) {
                    return { 'invalidExperience': true };
                }
                else { return null; }
            }
        }
    }

    static SalaryCompareValidator(MinSal: string, MaxSal: string) {

        return (group: FormGroup): { [key: string]: any } => {
            let MinSalCompare = group.controls[MinSal];
            let MaxSalCompare = group.controls[MaxSal];
            if (parseInt(MinSalCompare.value) > 0 || parseInt(MaxSalCompare.value) > 0) {
                if (MaxSalCompare.value == 0 || parseInt(MaxSalCompare.value) < parseInt(MinSalCompare.value)) {
                    return { 'invalidSalary': true };
                }
                else { return null; }
            }
        }
    }
    static skypeValidator(control) {
        if (control.value !== null && control.value !== "") {
            if (control.value.match(/[a-zA-Z][a-zA-Z0-9\.,\-_]{5,31}/)) {
                return null;
            } else {
                return { 'invalidSkypeAddress': true };
            }
        }
    }
    static commaValidator(control) {
        if (control.value !== null && control.value !== "") {
            if (control.value.match(/^[^,]+$/)) {
                return null;
            } else {
                return { 'pleaseremovecomma': true };
            }
        }
    }
    static ValidateSSN(control) {
        if (control.value != null && control.value != "") {
            if (String(control.value).match(/^[0-9]{4}$/)) {
                return null;
            }
            else {
                return { 'invalidNumber': true };
            }
        }
    }

    static ValidatWorkPermitExpiryDate(control){
        if (control.value != null && control.value != ""){
            let currentDate:any; let ExpiryDate:any
            currentDate = moment(new Date()).format("YYYY-MM-DDTHH:mm:ss.ms")
            ExpiryDate = moment(control.value).format("YYYY-MM-DDTHH:mm:ss.ms")
            if (currentDate >= ExpiryDate) {
                return { greaterThan: true };
              }
              return null;
        }
        return null;
    }

    static ValidateInterviewDate(control){
        if (control.value != null && control.value != ""){
            var date = "2020-01-01";
            var time = "00:00";
            let MinDate:any; let ExpiryDate:any
            MinDate = moment(date+' '+time).format("YYYY-MM-DDTHH:mm:ss.ms")  //moment(new Date()).format("YYYY-MM-DDTHH:mm:ss.ms")
            ExpiryDate = moment(control.value).format("YYYY-MM-DDTHH:mm:ss.ms")
            if (MinDate >= ExpiryDate) {
                return { greaterThan: true };
              }
              return null;
        }
        return null;
    }




}
