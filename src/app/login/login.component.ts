import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { first } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  userForm: FormGroup;

  formErrors = {
    username: '',
    password: ''
  };
  validationMessages = {
    username: {
      required: 'Username is requited!'
    },
    password: {
      required: 'Password is required!',
      minlength: '4',
      maxlength: '16'
    }
  };

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private auth: AuthService) { }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.userForm = this.fb.group({
      username: ['', [Validators.required]],
      password: [
        '',
        [
          Validators.minLength(6),
          Validators.maxLength(25)
        ]
      ]
    });

    this.userForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged();
  }

  onValueChanged(data?: any) {
    if (!this.userForm) {
      return;
    }
    const form = this.userForm;
    for (const field in this.formErrors) {
      if (Object.prototype.hasOwnProperty.call(this.formErrors, field)) {
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (Object.prototype.hasOwnProperty.call(control.errors, key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  loginUser() {
    const username = this.userForm.value['username'];
    const password = this.userForm.value['password'];
    this.auth.doLogin(username, password)
      .subscribe(
        (response: any) => {
          this.router.navigate(['/admin']);
        },
        (error: any) => {
          console.log('No se pudo hacer login');
        }
      );

    console.log(username, password);
  }

}
