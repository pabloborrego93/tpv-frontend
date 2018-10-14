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
    firstname: {
      required: 'Firstname is required!',
      minlength: 'Min length is 8',
      maxlength: 'Max length is 32'
    },
    lastname: {
      required: 'Lastname is required!',
      minlength: 'Min length is 8',
      maxlength: 'Max length is 32'
    },
    password: {
      required: 'Password is required!',
      minlength: 'Min length is 8',
      maxlength: 'Max length is 32'
    },
    confirmPassword: {
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
        firstname: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(16)]],
        lastname: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(16)]],
        password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(32)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(32)]]
      });
    }
    registerUser() {
      if (this.isValidForm()) {
        this.loading = true;
        const username = this.registerForm.value['username'];
        const email = this.registerForm.value['email'];
        const firstname = this.registerForm.value['firstname'];
        const lastname = this.registerForm.value['lastname'];
        const password = this.registerForm.value['password'];
        const confirmPassword = this.registerForm.value['confirmPassword'];
        setTimeout(() => {
          const registerDto: object = {
            'username': username,
            'email': email,
            'firstname': firstname,
            'lastname': lastname,
            'password': password,
            'confirmPassword': confirmPassword
          };
          this.auth.doRegister(registerDto)
            .subscribe(
              (response: any) => {
                this.router.navigate(['/login']);
              },
              (error: any) => {
                console.log(error);
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
