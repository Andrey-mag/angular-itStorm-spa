import {Component, Input, OnInit} from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";
import {CommentType} from "../../../../types/comment.type";
import {CommentService} from "../../services/comment.service";
import {AuthService} from "../../../core/auth/auth.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'comment-item',
  templateUrl: './comment-item.component.html',
  styleUrls: ['./comment-item.component.scss']
})
export class CommentItemComponent implements OnInit {

  @Input() comment!: CommentType;

  isLogged: boolean = false;
  dislike: boolean = false;
  like: boolean = false;
  likesCount: number = 0;
  dislikesCount: number = 0;
  violate: string = 'violate';
  actionLike: string = 'like';
  actionDislike: string = 'dislike';

  constructor(private commentsService: CommentService,
              private _snackbar: MatSnackBar,
              private authService: AuthService) {

  }

  ngOnInit(): void {
    this.isLogged = this.authService.getIsLoggedIn();
    setTimeout((): void => {
      this.checkActionValue()
    }, 100);
    this.likesCount = this.comment.likesCount;
    this.dislikesCount = this.comment.dislikesCount;
  }

  checkActionValue(): void {
    if (this.comment.action) {
      if (this.comment.action === this.actionLike) {
        this.like = true;
      }
      if (this.comment.action === this.actionDislike) {
        this.dislike = true;
      }
    }
  }

  addLike(): void {
    if (this.isLogged) {
      if (!this.like) {
        this.commentsService.sendCommentAction(this.comment.id, this.actionLike)
          .subscribe((data: DefaultResponseType): void => {
            if (this.dislike) {
              this.dislike = false;
              this.dislikesCount = --this.dislikesCount
            }
            this.like = true;
            this.dislike = false;
            this.likesCount = ++this.likesCount
            this._snackbar.open('Ваш голос учтен')

          });
      } else {
        this.commentsService.sendCommentAction(this.comment.id, this.actionLike)
          .subscribe((data: DefaultResponseType): void => {
            if (!data.error) {
              this.like = false;
              this.likesCount = --this.likesCount;
            }
          });
      }
    } else {
      this._snackbar.open('Необходимо авторизоваться')
    }
  }

  addDislike(): void {
    if (this.isLogged) {
      if (!this.dislike) {
        this.commentsService.sendCommentAction(this.comment.id, this.actionDislike)
          .subscribe((data: DefaultResponseType): void => {
            if (this.like) {
              this.like = false;
              this.likesCount = --this.likesCount;
            }
            this.dislike = true;
            this.dislikesCount = ++this.dislikesCount;
            this._snackbar.open('Ваш голос учтен')

          })
      } else {
        this.commentsService.sendCommentAction(this.comment.id, this.actionLike)
          .subscribe((data: DefaultResponseType): void => {
            if (!data.error) {
              this.dislike = false;
              this.dislikesCount = --this.dislikesCount;
            }
          });
      }
    } else {
      this._snackbar.open('Необходимо авторизоваться')
    }
  }

  addViolate(): void {
    if (this.isLogged) {
      this.commentsService.sendCommentAction(this.comment.id, this.violate)
        .subscribe({
          next: (data: DefaultResponseType): void => {
            if (!data.error) {
              this._snackbar.open('Жалоба отправлена');

            }
          },
          error: (errorResponse: HttpErrorResponse): void => {
            if (errorResponse.error && errorResponse.error.message) {
              this._snackbar.open('Жалоба уже отправленa')
            } else {
              this._snackbar.open(errorResponse.error.message)
            }
          }
        });
    } else {
      this._snackbar.open('Необходимо авторизоваться')
    }
  }
}

