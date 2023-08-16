import {Component, OnInit} from '@angular/core';
import {ArticleType} from "../../../../types/article.type";
import {ActivatedRoute, Params} from "@angular/router";
import {ArticleService} from "../../../shared/services/article.service";
import {DetailArticleType} from "../../../../types/detail-article.type";
import {CommentService} from "../../../shared/services/comment.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CommentType} from "../../../../types/comment.type";
import {AuthService} from "../../../core/auth/auth.service";
import {UserActionType} from "../../../../types/user-action.type";
import {switchMap} from "rxjs";
import {CommentParamsType} from "../../../../types/comment-params.type";

@Component({
  selector: 'detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  articleCommentActions: UserActionType[] = [];
  detailArticle!: DetailArticleType;
  articles: ArticleType[] = [];
  relatedArticles!: ArticleType[];
  textareaValue: string = '';
  comments: CommentType[] = [];
  isLogged: boolean = false;

  violate: string = 'violate';
  actionLike: string = 'like';
  actionDislike: string = 'dislike';
  dislike: boolean = false;
  like: boolean = false;

  constructor(private activatedRoute: ActivatedRoute,
              private articleService: ArticleService,
              private commentService: CommentService,
              private _snackBar: MatSnackBar,
              private authService: AuthService) {
  }

  ngOnInit(): void {
    this.isLogged = this.authService.getIsLoggedIn();

    this.authService.isLogged$.subscribe((isLogged: boolean): void => {
      this.isLogged = isLogged;
    });

    this.getDetailArticle();

    this.activatedRoute.params
      .pipe(
        switchMap((params: Params) => this.articleService.getRelatedArticle(params['url']))
      )
      .subscribe((data: ArticleType[]): void => {
        this.relatedArticles = data;
      });
  }

  getDetailArticle(): void {
    this.activatedRoute.params
      .pipe(
        switchMap((params: Params) => this.articleService.getArticle(params['url']))
      )
      .subscribe((data: DetailArticleType): void => {
        this.detailArticle = data;
        this.comments = data.comments;
        if (this.isLogged) {
          this.commentService.getCommentActions({articleId: this.detailArticle.id})
            .subscribe((data: UserActionType[] | DefaultResponseType): void => {
              if ((data as DefaultResponseType).error !== undefined) {
                throw new Error((data as DefaultResponseType).message)
              }

              this.articleCommentActions = data as UserActionType[]

              this.comments.map((comment: CommentType) => {
                this.articleCommentActions.forEach((item: UserActionType): void => {
                  if (item.comment === comment.id) {
                    comment.action = item.action
                  }
                })
                return comment;
              });
            });
        }
      });
  }

  getMoreComments(): void {
    const params: CommentParamsType = {
      offset: this.comments.length,
      article: this.detailArticle.id
    }

    this.commentService.getMoreComments(params)
      .subscribe((data): void => {

        data.comments.map((comment: CommentType) => {
          this.articleCommentActions.forEach((item: UserActionType): void => {
            if (item.comment === comment.id) {
              comment.action = item.action
            }
          })
          return comment;
        });

        data.comments.forEach((item: CommentType): void => {
          if (this.comments.length < data.allCount) {
            this.comments.push(item)
          }
        });
      });
  }

  addComment(): void {
    this.commentService.addComment(this.textareaValue, this.detailArticle.id)
      .subscribe((data: DefaultResponseType): void => {
        let error = null;
        if ((data as DefaultResponseType).error !== undefined) {
          error = (data as DefaultResponseType).message;
          this._snackBar.open(error)
        }

        this.textareaValue = '';
        this._snackBar.open('Комментарий отправлен!');
      });
  }

  addLike(event: CommentType): void {
    if (this.isLogged) {
      if (!this.like) {
        this.commentService.sendCommentAction(event.id, this.actionLike)
          .subscribe((data: DefaultResponseType): void => {

            if (this.dislike) {
              this.dislike = false;
              event.dislikesCount = --event.dislikesCount;
            }

            this.like = true;
            event.likesCount = ++event.likesCount;
            this._snackBar.open('Ваш голос учтен');


          })
      } else {
        this.commentService.sendCommentAction(event.id, this.actionLike)
          .subscribe((data: DefaultResponseType): void => {
            if (!data.error) {
              this.like = false;
              event.likesCount = --event.likesCount;
            }
          });
      }
    } else {
      this._snackBar.open('Необходимо авторизоваться')
    }
  }

  addDislike(event: CommentType): void {
    if (this.isLogged) {
      if (!this.dislike) {
        this.commentService.sendCommentAction(event.id, this.actionDislike)
          .subscribe((data: DefaultResponseType): void => {

            if (this.like) {
              this.like = false;
              event.likesCount = --event.likesCount;
            }

            this.dislike = true;
            event.dislikesCount = ++event.dislikesCount;
            this._snackBar.open('Ваш голос учтен');

          })
      } else {
        this.commentService.sendCommentAction(event.id, this.actionDislike)
          .subscribe(data => {
            if (!data.error) {
              this.dislike = false;
              event.dislikesCount = --event.dislikesCount;
            }
          });
      }
    } else {
      this._snackBar.open('Необходимо авторизоваться')
    }
  }
}
