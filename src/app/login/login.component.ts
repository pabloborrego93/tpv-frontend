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
  loading: Boolean = false;

  formErrors;
  validationMessages = {
    username: {
      required: 'Username is required!'
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
    if (this.isValidForm()) {
      this.loading = true;
      const username = this.userForm.value['username'];
      const password = this.userForm.value['password'];
      setTimeout(() => {
        this.auth.doLogin(username, password)
          .subscribe(
            (response: any) => {
              this.router.navigate(['/admin']);
            },
            (error: any) => {
              this.formErrors = 'Username or password incorrect!';
              setTimeout(() => {
                this.formErrors = '';
              }, 2000);
              this.loading = false;
            }
          );
      }, 500);
    }
  }

  isValidForm() {
    if (this.loading) {
      return false;
    } else {
      return this.userForm.valid;
    }
  }

}
