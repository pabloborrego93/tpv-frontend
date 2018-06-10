import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { first } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  private registerForm: FormGroup;
  private loading: Boolean = false;
  private registerErrors: String;

  validationMessages: Object = {
    username: {
      required: 'Username is required!',
      minlength: 'Min length is 4',
      maxlength: 'Max length is 16'
    },
    email: {
      required: 'Email is required!',
      email: 'Email format incorrect!',
      minlength: 'Min length is 8',
      maxlength: 'Max length is 32'
    },
    password: {
      required: 'Password is required!',
      minlength: 'Min length is 8',
      maxlength: 'Max length is 32'
    },
    passwordRepeated: {
      required: 'Re-writing password is required!',
      minlength: 'Min length is 8',
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
      this.registerForm = this.formBuilder.group({
        username: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(16)]],
        email: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(32), Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(32)]],
        passwordRepeated: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(32)]]
      });
    }
    registerUser() {
      if (this.isValidForm()) {
        this.loading = true;
        const username = this.registerForm.value['username'];
        const email = this.registerForm.value['email'];
        const password = this.registerForm.value['password'];
        const passwordRepeated = this.registerForm.value['passwordRepeated'];
        setTimeout(() => {
          this.auth.doRegister(username, email, password, passwordRepeated)
            .subscribe(
              (response: any) => {
                this.router.navigate(['/admin']);
              },
              (error: any) => {
                this.registerErrors = 'Couldnt complete the sign up!';
                setTimeout(() => {
                  this.registerErrors = '';
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
        return this.registerForm.valid;
      }
    }

}
