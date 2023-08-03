import {Component, ElementRef, Input, TemplateRef} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {Router} from "@angular/router";

@Component({
  selector: 'popup-success',
  templateUrl: './popup-success.component.html',
  styleUrls: ['./popup-success.component.scss']
})
export class PopupSuccessComponent {
  @Input('popupSuccess')popupSuccess! :TemplateRef<ElementRef>;
  dialogRef: MatDialogRef<any> | null = null;
  constructor(private router:Router) {
  }
  closePopup() {
    this.dialogRef?.close(this.popupSuccess);
    this.router.navigate(['/']);

  }

}
