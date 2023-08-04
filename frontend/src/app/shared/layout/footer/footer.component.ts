import {Component, ElementRef, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {HttpErrorResponse} from "@angular/common/http";
import {RequestService} from "../../services/request.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {

  @ViewChild('popup')
  private popup!: TemplateRef<ElementRef>;

  dialogRef: MatDialogRef<any> | null = null;
  isSuccess:boolean = false;

  popupFormConsultation = this.fb.group({
    name: ['', [Validators.required]],
    phone: ['', [Validators.required, Validators.pattern('(^8|7|\\+7)((\\d{10})|(\\s\\(\\d{3}\\)\\s\\d{3}\\s\\d{2}\\s\\d{2}))')]],
  })

  get name ()    {
    return this.popupFormConsultation.get('name');
  }

  get phone ()    {
    return this.popupFormConsultation.get('phone');
  }
  constructor(private fb:FormBuilder,
              private dialog: MatDialog,
              private requestService:RequestService,
              private _snackBar: MatSnackBar,) {
  }

  openPopup() {
    this.dialogRef = this.dialog.open(this.popup)

  }
  closePopup() {
    this.dialogRef?.close(this.popup);
  }

  openSuccessPopup() {
    this.isSuccess = !this.isSuccess;
  }

  sendFormConsultation() {
    if (this.popupFormConsultation.valid &&  this.name?.value && this.phone?.value) {
      this.requestService.sendServiceRequest(this.name.value, this.phone.value,'consultation')
        .subscribe({
          next: () => {
            this.openSuccessPopup();
            this.closePopup();
            this.popupFormConsultation.reset();
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

}
