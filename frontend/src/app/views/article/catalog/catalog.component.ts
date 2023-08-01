import {Component, OnInit} from '@angular/core';
import {ArticleService} from "../../../shared/services/article.service";
import {ArticleType} from "../../../../types/article.type";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ActiveParamsType} from "../../../../types/active-params.type";
import {CategoriesType} from "../../../../types/categories.type";
import {CategoryService} from "../../../shared/services/category.service";
import {ActivatedRoute, Router} from "@angular/router";
import {debounceTime} from "rxjs";
import {ActiveParamsUtil} from "../../../shared/utils/active-params.util";
import {AppliedFilterType} from "../../../../types/applied-filter.type";

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent implements OnInit {

  articles: ArticleType[] = [];
  activeParams: ActiveParamsType = {categories: []};
  appliedFilters: AppliedFilterType[] = [];
  categories: CategoriesType[] = [];
  filterOpen: boolean = false;
  pages: number[] = [];

  constructor(private articleService: ArticleService,
              private _snackBar: MatSnackBar,
              private categoryService: CategoryService,
              private activatedRoute: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    this.processCatalog();
  }

  processCatalog() {
    this.categoryService.getCategories()
      .subscribe((data: CategoriesType[]) => {
        this.categories = data;

        this.activatedRoute.queryParams
          .pipe(
            debounceTime(500)
          )
          .subscribe(params => {
            this.activeParams = ActiveParamsUtil.processParams(params);

            this.appliedFilters = [];
            this.activeParams.categories.forEach(url => {
              const foundType = this.categories.find(category => category.url === url);
              if (foundType) {
                this.appliedFilters.push({
                  name: foundType.name,
                  urlParam: foundType.url
                });
                foundType.activeFilter = true;
              }
            })
            this.articleService.getArticles(this.activeParams)
              .subscribe(data => {
                this.pages = [];
                for (let i = 1; i <= data.pages; i++) {
                  this.pages.push(i);
                }
                this.articles = data.items;
              })

          });
      });
  }

  updateFilterParam(url: string) {
    if (this.activeParams.categories && this.activeParams.categories.length > 0) {
      const existingCategoryInParam = this.activeParams.categories.find(category => category === url);
      if (existingCategoryInParam) {
        this.categories.find(item => {
          if (item.url === url) {
            item.activeFilter = false
          }
        });
        this.activeParams.categories = this.activeParams.categories.filter(item => item !== url)
      } else if (!existingCategoryInParam) {
        this.categories.find(item => {
          if (item.url === url) {
            item.activeFilter = true
          }
        });
        this.activeParams.categories = [...this.activeParams.categories, url];
      }
    } else {
      this.activeParams.categories = [url];
    }

    this.activeParams.page = 1;
    this.router.navigate(['/catalog'], {
      queryParams: this.activeParams
    })

  }

  removeAppliedFilter(appliedFilter: AppliedFilterType) {
    this.activeParams.categories = this.activeParams.categories.filter(category => category !== appliedFilter.urlParam)
    this.categories.find(item => {
      if (item.url === appliedFilter.urlParam) {
        item.activeFilter = false
      }
    })

    this.router.navigate(['/catalog'], {
      queryParams: this.activeParams
    })
  }

  toggleSorting() {
    this.filterOpen = !this.filterOpen;
  }

  openPage(page: number) {
    this.activeParams.page = page;
    this.router.navigate(['/catalog'], {
      queryParams: this.activeParams
    })
  }

  openPrevPage() {
    if (this.activeParams.page && this.activeParams.page > 1) {
      this.activeParams.page--;
      this.router.navigate(['/catalog'], {
        queryParams: this.activeParams
      })
    }
  }

  openNextPage() {
    if (this.activeParams.page && this.activeParams.page < this.pages.length) {
      this.activeParams.page++;
      this.router.navigate(['/catalog'], {
        queryParams: this.activeParams
      })
    }
  }
}
