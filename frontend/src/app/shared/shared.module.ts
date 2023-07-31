import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { AgreementComponent } from './components/agreement/agreement.component';
import {ReactiveFormsModule} from "@angular/forms";
import {RouterLink} from "@angular/router";
import { PopupSuccessComponent } from './components/popup-success/popup-success.component';
import { ArticleCardComponent } from './components/article-card/article-card.component';
import { CategoryComponent } from './components/category/category.component';
import { CommentItemComponent } from './components/comment-item/comment-item.component';


@NgModule({
  declarations: [
    AgreementComponent,
    PopupSuccessComponent,
    ArticleCardComponent,
    CategoryComponent,
    CommentItemComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  exports: [
    PopupSuccessComponent,
    ArticleCardComponent,
    CategoryComponent,
    CommentItemComponent
  ]
})
export class SharedModule {
}
