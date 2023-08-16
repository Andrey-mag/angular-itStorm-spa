import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {DefaultResponseType} from "../../../types/default-response.type";
import {CommentType} from "../../../types/comment.type";
import {CommentParamsType} from "../../../types/comment-params.type";
import {UserActionIdType} from "../../../types/user-action-id.type";
import {UserActionType} from "../../../types/user-action.type";

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http:HttpClient) { }

  getMoreComments(params: CommentParamsType): Observable<{allCount: number, comments: CommentType[]}> {
    return this.http.get<{allCount: number, comments: CommentType[]}>(environment.api + 'comments', {
      params: params
    });
  }

  addComment(text: string, article: string): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'comments', {
      text: text,
      article: article
    })
  }

  sendCommentAction(id: string, action: string): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'comments/' + id + '/apply-action', {
      action: action
    })
  }

  getCommentActions(params: UserActionIdType): Observable<UserActionType[] | DefaultResponseType> {
    return this.http.get<UserActionType[] | DefaultResponseType>(environment.api + 'comments/article-comment-actions', {
      params: params
    })
  }

}
