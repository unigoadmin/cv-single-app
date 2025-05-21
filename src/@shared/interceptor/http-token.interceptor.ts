import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from "@angular/common/http";
import { Observable } from "rxjs";
import { AuthenticationService } from "../services";

@Injectable({
  providedIn: "root"
})
export class HttpTokenInterceptor implements HttpInterceptor {
  constructor(private _authService:AuthenticationService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    const token = this._authService.getAuthorizationHeaderValue();

    if (token) {
      request = request.clone({
        setHeaders: {
          "Access-Control-Allow-Origin": "*",
          Authorization: token
        }
      });
    } else {
      request = request.clone({
        setHeaders: {
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
    return next.handle(request);
  }
}
