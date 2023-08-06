import {Component, Input} from '@angular/core';
import {ArticleType} from "../../../../types/article.type";
import {Router} from "@angular/router";

@Component({
  selector: 'article-card',
  templateUrl: './article-card.component.html',
  styleUrls: ['./article-card.component.scss']
})
export class ArticleCardComponent {

  @Input('article') article!: ArticleType;

  constructor(private router: Router) {
  }

  navigate():void {
    this.router.navigate(['/detail/' + this.article.url])

  }

}
