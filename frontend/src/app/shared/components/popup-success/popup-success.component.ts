import {Component, ElementRef, Input, TemplateRef} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {Router} from "@angular/router";

@Component({
  selector: 'popup-success',
  templateUrl: './popup-success.component.html',
  styleUrls: ['./popup-success.component.scss']
})
export class PopupSuccessComponent {

   isSuccess:boolean = true;
  constructor(private router:Router) {
  }
  closePopup() {
    this.isSuccess = !this.isSuccess;
    this.router.navigate(['/']);

  }

}
