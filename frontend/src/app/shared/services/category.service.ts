import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ActiveParamsType} from "../../../types/active-params.type";
import {Observable} from "rxjs";
import {ArticleType} from "../../../types/article.type";
import {environment} from "../../../environments/environment";
import {DefaultResponseType} from "../../../types/default-response.type";
import {CategoriesType} from "../../../types/categories.type";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {


  constructor(private http:HttpClient) { }

  getCategories(): Observable<DefaultResponseType | CategoriesType[]> {
    return this.http.get<DefaultResponseType | CategoriesType[]>(environment.api + 'categories');
  }
}
