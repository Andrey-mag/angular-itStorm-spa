import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../core/auth/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {UserService} from "../../services/user.service";
import {UserResponseType} from "../../../../types/user-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import {DefaultResponseType} from "../../../../types/default-response.type";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isLogged: boolean = false;
  userName: string = '';

  constructor(private authService: AuthService,
              private _snackBar: MatSnackBar,
              private router: Router,
              private userService: UserService) {
    this.isLogged = this.authService.getIsLoggedIn();
    this.getUserInfo();
  }

  ngOnInit() {
    this.authService.isLogged$.subscribe((isLoggedIn: boolean) => {
      this.isLogged = isLoggedIn;
    })
  }

  logout() {
    this.authService.logout()
      .subscribe({
        next: (() => {
          this.doLogout();
        }),

        error: (() => {
          this.doLogout();
        })
      })
  }

  doLogout() {
    this.authService.removeTokens();
    this.authService.userId = null;
    this._snackBar.open('Вы успешно вышли из системы!');
    this.router.navigate(['/']);
  }

  getUserInfo() {
    if (this.isLogged) {
      this.userService.getUserInfo()
        .subscribe({
          next: (data:UserResponseType | DefaultResponseType) => {
            this.userName = (data as UserResponseType).name;
          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.message) {
              this._snackBar.open(errorResponse.error.message)
            } else {
              this._snackBar.open('Ошибка получения данных пользователя!')
            }
          }
        })
    }
  }
}
