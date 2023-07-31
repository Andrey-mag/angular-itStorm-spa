import {Component, OnInit} from '@angular/core';
import {ArticleType} from "../../../../types/article.type";
import {ActivatedRoute} from "@angular/router";
import {ArticleService} from "../../../shared/services/article.service";
import {DetailArticleType} from "../../../../types/detail-article.type";
import {CommentService} from "../../../shared/services/comment.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  detailArticle!: DetailArticleType;
  relatedArticles!: ArticleType[];
  textareaValue: string = '';

  constructor(private activatedRoute: ActivatedRoute,
              private articleService:ArticleService,
              private commentService:CommentService,
              private _snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.articleService.getArticle(params['url'])
        .subscribe((data: DetailArticleType) => {
          this.detailArticle = data;
        });

      this.articleService.getRelatedArticle((params['url']))
        .subscribe((data: ArticleType[]) => {
          this.relatedArticles = data;
        });
    });

  }

  addComment() {
    this.commentService.addComment(this.textareaValue, this.detailArticle.id)
      .subscribe((data:DefaultResponseType) => {
        let error = null;
        if ((data as DefaultResponseType).error !== undefined) {
          error = (data as DefaultResponseType).message;
          this._snackBar.open(error)
        }

        this.textareaValue  = ' ';
        this._snackBar.open('Комментарий отправлен!')
      })
  }


}
