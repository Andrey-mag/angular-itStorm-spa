import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
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
  @Output() actionChangeEmmit: EventEmitter<CommentType> = new EventEmitter<CommentType>();

  isLogged: boolean = false;
  dislike: boolean = false;
  like: boolean = false;
  violate: string = 'violate';
  actionLike: string = 'like';
  actionDislike: string = 'dislike';

  constructor(private commentsService: CommentService,
              private _snackbar: MatSnackBar,
              private authService: AuthService) {
  }

  ngOnInit(): void {
    this.isLogged = this.authService.getIsLoggedIn();
    setTimeout(() => {
      this.checkActionValue()
    }, 100);
  }

  checkActionValue() {
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
    this.actionChangeEmmit.emit(this.comment);
  }

  addDislike(): void {
    this.actionChangeEmmit.emit(this.comment);
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
              this._snackbar.open(errorResponse.error.message)
            } else {
              this._snackbar.open('Жалоба уже отправлена')
            }
          }
        })
    } else {
      this._snackbar.open('Необходимо авторизоваться')
    }
  }
}
