import {Component, OnInit} from '@angular/core';
import {ArticleService} from "../../../shared/services/article.service";
import {ArticleType} from "../../../../types/article.type";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ActiveParamsType} from "../../../../types/active-params.type";

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent implements OnInit {

  articles: ArticleType[] = [];
  activeParams: ActiveParamsType = {categories: []};
  // categories: CategoriesType[] = [];
  pages: number[] = []
  // appliedFilters: AppliedFilterType[] = [];
  filterOpen: boolean = false;

  constructor(private articleService: ArticleService,
              private _snackBar: MatSnackBar,) {
  }

  ngOnInit() {
    this.getArticles();
  }

  getArticles() {
    this.articleService.getArticles(this.activeParams)
      .subscribe((data) => {
      this.articles = data.items;
    })

  }

  toggleSorting() {
    this.filterOpen = !this.filterOpen;
  }

}
