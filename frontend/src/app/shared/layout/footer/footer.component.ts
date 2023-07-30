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

  @ViewChild('popupSuccess')
  private popupSuccess!: TemplateRef<ElementRef>

  dialogRef: MatDialogRef<any> | null = null;


  popupFormConsultation = this.fb.group({
    name: ['', [Validators.required]],
    phone: ['', [Validators.required]],
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
    this.dialogRef?.close();
  }

  openSuccessPopup() {
    this.dialogRef = this.dialog.open(this.popupSuccess);
  }

  sendFormConsultation() {
    if (this.popupFormConsultation.valid &&  this.name?.value && this.phone?.value) {
      this.requestService.sendServiceRequest(this.name.value, this.phone.value,'consultation')
        .subscribe({
          next: () => {
            this.openSuccessPopup();
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
