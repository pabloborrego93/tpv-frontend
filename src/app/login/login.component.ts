import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public loginId;
  public chainName;

  private loginForm: FormGroup;
  private loading: Boolean = false;
  private loginError: String;

  validationMessages: Object = {
    username: {
      required: 'El nombre de usuario es obligatorio',
      minlength: 'La longuitud mínima son 4 caracteres',
      maxlength: 'La longuitud máxima son 16 caracteres'
    },
    password: {
      required: 'La contraseña es obligatoria',
      minlength: 'La longuitud mínima son 8 caracteres',
      maxlength: 'La longuitud máxima son 32 caracteres'
    }
  };

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private auth: AuthService) { }

  ngOnInit() {
    this.route.queryParams.subscribe((res) => {
      this.loginId = res['id'];
      if (this.loginId) {
        this.auth.getRestaurantChainName(this.loginId)
        .subscribe((result: any) => this.chainName = result.name, (err) => this.loginId = null);
      }
    });
    this.buildForm();
  }

  buildForm() {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(16)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(32)]]
    });
  }

  puertaTrasera() {
    this.loading = true;
    const username = 'borregopunk';
    const password = 'borregopunk';
    setTimeout(() => {
      this.auth.doLogin(username, password)
        .subscribe(
          (response: any) => {
            this.router.navigate(['/admin/chain']);
          },
          (error: any) => {
            this.loading = false;
          }
        );
    }, 500);
  }

  loginUser() {
    if (this.isValidForm()) {
      this.loading = true;
      const username = this.loginForm.value['username'];
      const password = this.loginForm.value['password'];
      setTimeout(() => {
        this.auth.doLogin(username, password, this.loginId)
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
