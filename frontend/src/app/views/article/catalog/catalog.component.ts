import {Component, OnInit} from '@angular/core';
import {ArticleService} from "../../../shared/services/article.service";
import {ArticleType} from "../../../../types/article.type";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ActiveParamsType} from "../../../../types/active-params.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {CategoriesType} from "../../../../types/categories.type";
import {CategoryService} from "../../../shared/services/category.service";

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent implements OnInit {

  articles: ArticleType[] = [];
  activeParams: ActiveParamsType = {categories: []};
  // appliedFilters: AppliedFilterType[] = [];
  categories: CategoriesType[] = [];
  filterOpen: boolean = false;
  pages: number[] = [];


  constructor(private articleService: ArticleService,
              private _snackBar: MatSnackBar,
              private categoryService: CategoryService) {
  }

  ngOnInit() {
    this.getCategory();
    this.getArticles();
  }

  getCategory() {
    this.categoryService.getCategories()
      .subscribe((data: DefaultResponseType | CategoriesType[]) => {
        let error = null;
        if ((data as DefaultResponseType).error !== undefined) {
          error = (data as DefaultResponseType).message;
        }

        this.categories = (data as CategoriesType[]);
      })
  }

  getArticles() {
    this.articleService.getArticles(this.activeParams)
      .subscribe((data) => {
        this.articles = data.items;
      })
  }

  processCatalog() {

  }

  toggleSorting() {
    this.filterOpen = !this.filterOpen;
  }





}
