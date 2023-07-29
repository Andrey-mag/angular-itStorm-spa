import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { AgreementComponent } from './components/agreement/agreement.component';
import {ReactiveFormsModule} from "@angular/forms";
import {RouterLink} from "@angular/router";
import { PopupSuccessComponent } from './components/popup-success/popup-success.component';
import { ArticleCardComponent } from './components/article-card/article-card.component';


@NgModule({
  declarations: [
    AgreementComponent,
    PopupSuccessComponent,
    ArticleCardComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  exports: [
    PopupSuccessComponent,
    ArticleCardComponent
  ]
})
export class SharedModule {
}
