import {Component, Input} from '@angular/core';
import {ArticleType} from "../../../../types/article.type";

@Component({
  selector: 'article-card',
  templateUrl: './article-card.component.html',
  styleUrls: ['./article-card.component.scss']
})
export class ArticleCardComponent {

  @Input('article') article!:ArticleType;

}
