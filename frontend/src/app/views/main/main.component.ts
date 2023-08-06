import {Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {OwlOptions} from "ngx-owl-carousel-o";
import {Router} from "@angular/router";
import {ReviewType} from "../../../types/review.type";
import {MainServicesType} from "../../../types/main-services.type";
import {UserService} from "../../shared/services/user.service";
import {AuthService} from "../../core/auth/auth.service";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, Validators} from "@angular/forms";
import {RequestService} from "../../shared/services/request.service";
import {HttpErrorResponse} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ArticleType} from "../../../types/article.type";
import {ArticleService} from "../../shared/services/article.service";
import {DefaultResponseType} from "../../../types/default-response.type";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  @ViewChild('popup')
  private popup!: TemplateRef<ElementRef>

  dialogRef: MatDialogRef<any> | null = null;
  isLogged: boolean = false;
  isSuccess: boolean = false;
  popularArticles: ArticleType[] = [];

  popupForm = this.fb.group({
    service: ['', [Validators.required]],
    name: ['', [Validators.required, Validators.pattern('^([А-Яа-я]{3,})$')]],
    phone: ['', [Validators.required, Validators.pattern('(^8|7|\\+7)((\\d{10})|(\\s\\(\\d{3}\\)\\s\\d{3}\\s\\d{2}\\s\\d{2}))')]],
  })

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    margin: 24,
    dots: true,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
    },
    nav: false
  }

  customOptionsReviews: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    margin: 25,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      }
    },
    nav: false
  }

  mainServices: MainServicesType[] = [
    {
      image: 'service1.png',
      title: 'Создание сайтов',
      text: 'В краткие сроки мы создадим качественный и самое главное продающий сайт для продвижения Вашего бизнеса!',
      price: '7 500'
    },
    {
      image: 'service2.png',
      title: 'Продвижение',
      text: 'Вам нужен качественный SMM-специалист или грамотный таргетолог? Мы готовы оказать Вам услугу “Продвижения” на наивысшем уровне!',
      price: '3 500'
    },
    {
      image: 'service3.png',
      title: 'Реклама',
      text: 'Без рекламы не может обойтись ни один бизнес или специалист. Обращаясь к нам, мы гарантируем быстрый прирост клиентов за счёт правильно настроенной рекламы.',
      price: '1 000'
    },
    {
      image: 'service4.png',
      title: 'Копирайтинг',
      text: 'Наши копирайтеры готовы написать Вам любые продающие текста, которые не только обеспечат рост охватов, но и помогут выйти на новый уровень в продажах.',
      price: '750'
    },
  ]

  reviews: ReviewType[] = [
    {
      name: 'Станислав',
      image: 'review1.png',
      text: "Спасибо огромное АйтиШторму за прекрасный блог с полезными статьями! " +
        "Именно они и побудили меня углубиться в тему SMM и начать свою карьеру."
    },
    {
      name: 'Алёна',
      image: 'review2.png',
      text: "Обратилась в АйтиШторм за помощью копирайтера. Ни разу ещё не пожалела! " +
        "Ребята действительно вкладывают душу в то, что делают, и каждый текст, который я получаю, с нетерпением хочется выложить в сеть."
    },
    {
      name: 'Мария',
      image: 'review3.png',
      text: "Команда АйтиШторма за такой короткий промежуток времени сделала невозможное: " +
        "от простой фирмы по услуге продвижения выросла в мощный блог о важности личного бренда. Класс!"
    },

  ]

  get service() {
    return this.popupForm.get('service');
  }

  get name() {
    return this.popupForm.get('name');
  }

  get phone() {
    return this.popupForm.get('phone');
  }

  constructor(
    private router: Router,
    private userService: UserService,
    private authService: AuthService,
    private dialog: MatDialog,
    private requestService: RequestService,
    private _snackBar: MatSnackBar,
    private fb: FormBuilder,
    private articleService: ArticleService) {
    this.isLogged = this.authService.getIsLoggedIn();
  }

  ngOnInit(): void {
    this.getPopularArticle();
  }

  openPopup(value: string): void {
    this.service?.setValue(value)
    this.dialogRef = this.dialog.open(this.popup)
  }

  closePopup(): void {
    this.dialogRef?.close(this.popup);
  }

  openSuccessPopup(): void {
    this.popupForm.reset();
    this.isSuccess = !this.isSuccess;
    this.dialogRef?.close(this.popup);
  }

  sendForm(): void {
    if (this.popupForm.valid && this.service?.value && this.name?.value && this.phone?.value) {
      this.requestService.sendServiceRequest(this.name.value, this.phone.value, 'order', this.service.value)
        .subscribe({
          next: (): void => {
            this.openSuccessPopup();
            this.dialogRef?.close(this.popup);
          },

          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.message) {
              this._snackBar.open(errorResponse.error.message)
            } else {
              this._snackBar.open('Ошибка отправки запроса об услуге!')
            }
          }
        })
    }
  }

  getPopularArticle(): void {
    this.articleService.getPopularArticle()
      .subscribe({
        next: (data: DefaultResponseType | ArticleType[]): void => {

          if ((data as DefaultResponseType).error !== undefined) {
            this._snackBar.open('Популярные статьи не найдены.')
          }

          if ((data as ArticleType[])) {
            this.popularArticles = data as ArticleType[]
          }
        },

        error: (errorResponse: HttpErrorResponse): void => {
          if (errorResponse.error && errorResponse.error.message) {
            this._snackBar.open(errorResponse.error.message)
          } else {
            this._snackBar.open('Ошибка отправки запроса с популярными статьями!')
          }
        }
      })
  }
}
