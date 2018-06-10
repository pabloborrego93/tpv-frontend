import { Component, OnInit, Inject } from '@angular/core';
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

  private loginForm: FormGroup;
  private loading: Boolean = false;
  private loginError: String;

  validationMessages: Object = {
    username: {
      required: 'Username is required!',
      minlength: 'Min length is 4',
      maxlength: 'Max length is 16'
    },
    password: {
      required: 'Password is required!',
      minlength: 'Minimum length is 8',
      maxlength: 'Max length is 32'
    }
  };

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private auth: AuthService) { }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(16)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(32)]]
    });
  }

  loginUser() {
    if (this.isValidForm()) {
      this.loading = true;
      const username = this.loginForm.value['username'];
      const password = this.loginForm.value['password'];
      setTimeout(() => {
        this.auth.doLogin(username, password)
          .subscribe(
            (response: any) => {
              this.router.navigate(['/admin']);
            },
            (error: any) => {
              this.loginError = 'Username or password incorrect!';
              setTimeout(() => {
                this.loginError = '';
              }, 4000);
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
      return this.loginForm.valid;
    }
  }

}
