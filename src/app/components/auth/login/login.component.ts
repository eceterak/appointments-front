import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AlertService } from 'src/app/shared/alert/alert.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    loginForm: FormGroup;

    constructor(
        private authService: AuthService,
        private router: Router,
        private alertService: AlertService
    ) {}

    ngOnInit() {
        this.loginForm = new FormGroup({
            'email': new FormControl(null, [Validators.required, Validators.email]),
            'password': new FormControl(null, [Validators.required, Validators.minLength(3)])
        })
    }

    onLogin() {
        if(this.loginForm.valid) { 
            this.authService.login(this.loginForm.value.email, this.loginForm.value.password).subscribe(
                (_) => {
                    this.router.navigate(['/appointments']);
                },
                (errorResponse: HttpErrorResponse) => {
                    this.alertService.alert.next({
                        messages: errorResponse.error.error,
                        class: 'danger'
                    });
                }
            );
        }
    }
}
