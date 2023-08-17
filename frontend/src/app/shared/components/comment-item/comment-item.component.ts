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
  @Output() likeEmmit: EventEmitter<CommentType> = new EventEmitter<CommentType>();
  @Output() dislikeEmmit: EventEmitter<CommentType> = new EventEmitter<CommentType>();

  isLogged: boolean = false;
  violate: string = 'violate';
  actionLike: string = 'like';
  actionDislike: string = 'dislike';

  constructor(private commentsService: CommentService,
              private _snackbar: MatSnackBar,
              private authService: AuthService) {
  }

  ngOnInit(): void {
    this.isLogged = this.authService.getIsLoggedIn();
    setTimeout(():void => {
      this.checkActionValue()
    }, 100);
  }

  checkActionValue() {
    if (this.comment.action) {
      if (this.comment.action === this.actionLike) {
        this.comment.action = this.actionLike;
      }
      if (this.comment.action === this.actionDislike) {
        this.comment.action = this.actionDislike;
      }
    }
  }

  addLike(): void {
    this.likeEmmit.emit(this.comment);
  }

  addDislike(): void {
    this.dislikeEmmit.emit(this.comment);
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
