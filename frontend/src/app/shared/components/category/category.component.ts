import {Component, Input, OnInit} from '@angular/core';
import {CategoriesType} from "../../../../types/categories.type";
import {Router} from "@angular/router";

@Component({
  selector: 'category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit{

  @Input('category') category!:CategoriesType;
  constructor(private router:Router) {
  }

  ngOnInit() {
  }




}
