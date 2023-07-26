import {Component, OnInit} from '@angular/core';
import {OwlOptions} from "ngx-owl-carousel-o";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {


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

  reviews = [
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


  constructor() {
  }

  ngOnInit() {
  }

}
