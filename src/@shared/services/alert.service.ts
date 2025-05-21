import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class AlertService {
    constructor(private toastr: ToastrService) {
    }

    success(message: string) {
        if (message != '') {
            this.toastr.success(message);
        }
    }

    error(message: string) {
        if (message != '') {
            this.toastr.error(message);
        }
    }

    warning(message:string){
        if (message != '') {
            this.toastr.warning(message);
        }
    }

   
}