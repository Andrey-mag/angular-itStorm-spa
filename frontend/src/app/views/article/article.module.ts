import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleRoutingModule } from './article-routing.module';
import { CatalogComponent } from './catalog/catalog.component';
import {DetailComponent} from './detail/detail.component';
import {SharedModule} from "../../shared/shared.module";
import {FormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    CatalogComponent,
    DetailComponent,
  ],
  imports: [
    CommonModule,
    ArticleRoutingModule,
    SharedModule,
    FormsModule
  ]
})
export class ArticleModule { }
