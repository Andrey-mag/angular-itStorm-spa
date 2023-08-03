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

  ngOnInit() {
    this.isLogged = this.authService.getIsLoggedIn();
  }


  addLike(): void {
    if (this.isLogged) {
      this.commentsService.sendCommentAction(this.comment.id, this.actionLike)
        .subscribe(data => {
          this.like = true;
          this.dislike = false;
          this.likesCount++;
          this._snackbar.open('Ваш голос учтен!')
        })
    }
  }

  addDislike(): void {
    if (this.isLogged) {
      this.commentsService.sendCommentAction(this.comment.id, this.actionDislike)
        .subscribe(data => {
          this.dislike = true;
          this.like = false;
          this.dislikesCount++;
          this._snackbar.open('Ваш голос учтен!')
        })
    }

  }

  addViolate() {
    if (this.isLogged) {
      this.commentsService.sendCommentAction(this.comment.id, this.violate)
        .subscribe({
          next: (data: DefaultResponseType) => {
            if (!data.error) {
              this._snackbar.open('Жалоба отправлена');

            }
          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.message) {
              this._snackbar.open('Жалоба уже отправлен')
            } else {
              this._snackbar.open(errorResponse.error.message)
            }
          }
        })
    } else {
      this._snackbar.open('Необходимо авторизоваться')
    }
  }



}

