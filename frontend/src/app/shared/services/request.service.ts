import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {DefaultResponseType} from "../../../types/default-response.type";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(private http:HttpClient) {
  }

  sendServiceRequest(name:string, phone:string, service:string, type:string='order'):Observable<DefaultResponseType>  {
    return this.http.post<DefaultResponseType>(environment.api + 'requests', {
        name, phone, service, type
    })
  }
}
