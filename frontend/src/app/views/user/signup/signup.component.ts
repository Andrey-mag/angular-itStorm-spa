import { Component } from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {Subject} from "rxjs";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {

  signupForm = this.fb.group({
    name : ['', [Validators.required, Validators.pattern('^([А-Яа-я]{3,})+\\s$')]],
    email : ['', [Validators.required, Validators.email]],
    password:['', [Validators.required, Validators.pattern('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$')]],
    agree:[false],
  })

  get name(){
    return this.signupForm.get('name');
  }

  get email(){
    return this.signupForm.get('email');
  }

  get password() {
    return this.signupForm.get('password');
  }

  constructor(private fb:FormBuilder) {
  }
}
