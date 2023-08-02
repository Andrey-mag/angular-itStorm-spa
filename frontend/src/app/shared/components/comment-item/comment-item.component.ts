import {Component, Input} from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";
import {CommentType} from "../../../../types/comment.type";
import {CommentService} from "../../services/comment.service";

@Component({
  selector: 'comment-item',
  templateUrl: './comment-item.component.html',
  styleUrls: ['./comment-item.component.scss']
})
export class CommentItemComponent {

  @Input() comment!: CommentType;

  like: boolean = false;
  dislike: boolean = false;
  likesCount: number = 0;
  dislikesCount: number = 0;
  actionLike:string = 'like';
  actionDislike:string = 'dislike';
  violate = 'violate';
  constructor(private commentsService: CommentService,
              private _snackbar: MatSnackBar) {

  }

}

