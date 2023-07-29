import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { AgreementComponent } from './components/agreement/agreement.component';
import {ReactiveFormsModule} from "@angular/forms";
import {RouterLink} from "@angular/router";
import { PopupSuccessComponent } from './components/popup-success/popup-success.component';


@NgModule({
  declarations: [
    AgreementComponent,
    PopupSuccessComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  exports: [
    PopupSuccessComponent
  ]
})
export class SharedModule {
}
