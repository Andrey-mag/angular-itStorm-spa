import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {DefaultResponseType} from "../../../types/default-response.type";
import {environment} from "../../../environments/environment";
import {UserResponseType} from "../../../types/user-response.type";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http:HttpClient) { }

  getUserInfo():Observable<DefaultResponseType | UserResponseType>  {
      return this.http.get<DefaultResponseType | UserResponseType>(environment.api + 'users')
  }

}
