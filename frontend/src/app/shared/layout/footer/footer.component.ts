import {Component, ElementRef, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";

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
              private dialog: MatDialog) {
  }

  openPopup() {
    this.dialogRef = this.dialog.open(this.popup)

  }
  closePopup() {
    this.dialogRef?.close();
  }

  sendFormConsultation() {
    //...
    this.dialogRef = this.dialog.open(this.popupSuccess);
    this.popupFormConsultation.reset();
  }

}
