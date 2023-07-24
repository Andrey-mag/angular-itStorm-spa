import { Component } from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../../core/auth/auth.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {LoginResponseType} from "../../../../types/login-response.type";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginForm = this.fb.group({
    email:['', [Validators.required, Validators.email]],
    password:['', [Validators.required]],
    rememberMe:[false],
  })

  // Validators.pattern('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$')

  get email() {
    return this.loginForm.get('email');
  }

  get password ()  {
    return this.loginForm.get('password');
  }
  constructor(private fb:FormBuilder,
              private authService:AuthService,
              private _snackBar: MatSnackBar,
              private router:Router) {
  }

  login() {
    if (this.loginForm.valid && this.loginForm.value.email && this.loginForm.value.password && this.loginForm.value.rememberMe) {

      this.authService.login(this.loginForm.value.email, this.loginForm.value.password, this.loginForm.value.rememberMe)
        .subscribe( {
          next : (data:DefaultResponseType | LoginResponseType) => {
            let error = null;

            if ((data as DefaultResponseType).error !== undefined ) {
              error = (data as DefaultResponseType).message;
            }

            const loginResponse = (data as LoginResponseType);

            if (!loginResponse.accessToken && !loginResponse.refreshToken && !loginResponse.userId ) {
              error = 'Ошибка авторизации!'
            }

            if (error) {
              this._snackBar.open(error);
              throw new Error(error);
            }

            this.authService.setTokens(loginResponse.accessToken, loginResponse.refreshToken);
            this.authService.userId = loginResponse.userId;
            this._snackBar.open('Вы успешно авторизовались!');
            this.router.navigate(['/'])
          }
        })

    }

  }

}
