import {Component, OnInit} from '@angular/core';
import {ArticleType} from "../../../../types/article.type";
import {ActivatedRoute} from "@angular/router";
import {ArticleService} from "../../../shared/services/article.service";
import {DetailArticleType} from "../../../../types/detail-article.type";
import {CommentService} from "../../../shared/services/comment.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CommentType} from "../../../../types/comment.type";
import {AuthService} from "../../../core/auth/auth.service";
import {UserActionType} from "../../../../types/user-action.type";

@Component({
  selector: 'detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  detailArticle!: DetailArticleType;
  relatedArticles!: ArticleType[];
  textareaValue: string = '';
  comments: CommentType[] = [];
  isLogged:boolean = false;

  constructor(private activatedRoute: ActivatedRoute,
              private articleService: ArticleService,
              private commentService: CommentService,
              private _snackBar: MatSnackBar,
              private authService:AuthService) {
  }

  ngOnInit() {
    this.isLogged = this.authService.getIsLoggedIn();

    this.activatedRoute.params.subscribe(params => {
      this.articleService.getArticle(params['url'])
        .subscribe((data: DetailArticleType) => {
          this.detailArticle = data;
          this.comments = data.comments;

          if  (this.isLogged) {
            this.commentService.getCommentActions({articleId: this.detailArticle.id})
              .subscribe((data: UserActionType[] | DefaultResponseType) => {
                if ((data as DefaultResponseType).error !== undefined) {
                  throw new Error((data as DefaultResponseType).message)
                }


                // this.comments.map(comment => {
                //   (data as UserActionType[]).forEach((action:UserActionType) => {
                //     if (action.comment === comment.id) {
                //       comment.action = action.action
                //     }
                //   })
                //   return comment;
                // })

                this.comments.map((comment:CommentType) => {
                  comment['action']= (data as UserActionType[]).find((action : UserActionType) : boolean => action.comment === comment.id)?.action || null;
                  return comment;
                })
              })
          }
        });

      this.articleService.getRelatedArticle((params['url']))
        .subscribe((data: ArticleType[]):void => {
          this.relatedArticles = data;
        });
    });

  }

  getComments() {
    const params = {
      offset: this.comments.length,
      article: this.detailArticle.id
    }

    this.commentService.getComments(params)
      .subscribe((data) => {
        data.comments.forEach(item => {
          if (this.comments.length < data.allCount) {
            this.comments.push(item)
          }
        })
      })
  }

  addComment() {
    this.commentService.addComment(this.textareaValue, this.detailArticle.id)
      .subscribe((data: DefaultResponseType) => {
        let error = null;
        if ((data as DefaultResponseType).error !== undefined) {
          error = (data as DefaultResponseType).message;
          this._snackBar.open(error)
        }

        this.textareaValue = ' ';
        this._snackBar.open('Комментарий отправлен!')
      })
  }

}
