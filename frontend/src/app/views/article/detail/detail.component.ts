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
          this.articleCommentActions.find((item: UserActionType): void => {
            if (item.comment === comment.id) {
              comment.action = item.action
            }
          })
          if (this.comments.length < data.allCount) {
            this.comments.push(comment)
          }
          return comment;
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

        this.activatedRoute.params
          .pipe(
            switchMap((params: Params) => this.articleService.getArticle(params['url']))
          )
          .subscribe((data: DetailArticleType): void => {
            this.comments = data.comments;
          })
      });
  }

  addLike(commentEvent: CommentType): void {
    if (this.isLogged) {
      if (commentEvent.action !== this.actionLike) {
        this.commentService.sendCommentAction(commentEvent.id, this.actionLike)
          .subscribe((data: DefaultResponseType): void => {
            if (commentEvent.action === this.actionDislike) {
              commentEvent.dislikesCount = --commentEvent.dislikesCount;
              commentEvent.action = this.actionLike;
            }

            commentEvent.likesCount = ++commentEvent.likesCount;
            commentEvent.action = this.actionLike;
            this._snackBar.open('Ваш голос учтен');
          })
      } else {
        this.commentService.sendCommentAction(commentEvent.id, this.actionLike)
          .subscribe((data: DefaultResponseType): void => {
            if (!data.error) {
              commentEvent.action = null;
              commentEvent.likesCount = --commentEvent.likesCount;
            }
          });
      }
    } else {
      this._snackBar.open('Необходимо авторизоваться')
    }
  }

  addDislike(commentEvent: CommentType): void {
    if (this.isLogged) {
      if (commentEvent.action !== this.actionDislike) {
        this.commentService.sendCommentAction(commentEvent.id, this.actionDislike)
          .subscribe((data: DefaultResponseType): void => {
            if (commentEvent.action === this.actionLike) {
              commentEvent.likesCount = --commentEvent.likesCount;
              commentEvent.action = this.actionDislike;
            }

            commentEvent.dislikesCount = ++commentEvent.dislikesCount;
            commentEvent.action = this.actionDislike;
            this._snackBar.open('Ваш голос учтен');
          });
      } else {
        this.commentService.sendCommentAction(commentEvent.id, this.actionDislike)
          .subscribe((data: DefaultResponseType): void => {
            if (!data.error) {
              commentEvent.action = null;
              commentEvent.dislikesCount = --commentEvent.dislikesCount;
            }
          });
      }
    } else {
      this._snackBar.open('Необходимо авторизоваться')
    }
  }
}
