import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {DefaultResponseType} from "../../../types/default-response.type";
import {ArticleType} from "../../../types/article.type";
import {ActiveParamsType} from "../../../types/active-params.type";
import {DetailArticleType} from "../../../types/detail-article.type";

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  constructor(private http:HttpClient) { }

  getArticle(url:string): Observable<DetailArticleType> {
    return this.http.get<DetailArticleType>(environment.api + 'articles/' + url)
  }
  getRelatedArticle(url:string): Observable<ArticleType[]> {
    return this.http.get<ArticleType[]>(environment.api + 'articles/related/' + url)
  }
  getArticles(params: ActiveParamsType): Observable<{ count: number, pages: number, items: ArticleType[]}> {
    return this.http.get<{ count: number, pages: number, items: ArticleType[]}>(environment.api + 'articles', {params: params});
  }
  getPopularArticle():Observable<DefaultResponseType | ArticleType[]> {
    return this.http.get<DefaultResponseType | ArticleType[]>(environment.api + 'articles/top')
  }
}
