import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoadingSpinnerService } from './loading-spinner.service';
import { Injectable } from '@angular/core';
import { finalize } from 'rxjs/operators';

@Injectable()

export class LoadingSpinnerInterceptor implements HttpInterceptor {
    constructor(public loadingSpinnerService: LoadingSpinnerService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.loadingSpinnerService.show();

        return next.handle(request)
            .pipe(
                finalize(
                    () => {
                        setTimeout(() => { 
                            this.loadingSpinnerService.hide()
                        }, 3000);
                    }
                )
            );
    }
}