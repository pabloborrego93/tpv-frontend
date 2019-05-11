import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  public registerForm: FormGroup;
  public loading: Boolean = false;
  public registerErrors: String;

  validationMessages: Object = {
    username: {
      required: 'El nombre de usuario es obligatorio',
      minlength: 'La longuitud mínima son 4 caracteres',
      maxlength: 'La longuitud máxima son 16 caracteres'
    },
    email: {
      required: 'El email es obligatorio',
      email: 'El formato de email es incorrecto',
      minlength: 'La longuitud mínima son 6 caracteres',
      maxlength: 'La longuitud máxima son 32 caracteres'
    },
    firstname: {
      required: 'El nombre es obligatorio',
      minlength: 'La longuitud mínima son 2 caracteres',
      maxlength: 'La longuitud máxima son 16 caracteres'
    },
    lastname: {
      required: 'Lastname is required!',
      minlength: 'La longuitud mínima son 2 caracteres',
      maxlength: 'La longuitud máxima son 32 caracteres'
    },
    password: {
      required: 'La contraseña es obligatoria',
      minlength: 'La longuitud mínima son 8 caracteres',
      maxlength: 'La longuitud máxima son 32 caracteres'
    },
    confirmPassword: {
      required: 'La contraseña es obligatoria',
      minlength: 'La longuitud mínima son 8 caracteres',
      maxlength: 'La longuitud máxima son 32 caracteres',
      notEquals: 'Las contraseñas no son iguales'
    }
  };

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private auth: AuthService) {
    this.buildForm();
  }

  ngOnInit() {

  }

  buildForm() {
    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(16)]],
      email: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(32), Validators.email]],
      firstname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(16)]],
      lastname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(32)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(32)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(32), this.validatePassword]]
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
              this.registerErrors = 'Se ha producido un error';
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

  validatePassword(control: FormControl) {
    if (control.parent) {
      const password = control.parent.value['password'];
      if (password && control && password !== control.value) {
        return { notEquals: true };
      }
    }
    return null;
  }

}
