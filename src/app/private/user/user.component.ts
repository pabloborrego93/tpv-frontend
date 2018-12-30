import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, NgForm } from '@angular/forms';
import { MatPaginator, MatTableDataSource, PageEvent } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../shared/toast.service';
import { NavigationService } from '../navigation/navigation.service';
import { UserService } from './user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, AfterViewInit {

  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageEvent: PageEvent;
  dataSource = new MatTableDataSource<Element>();
  displayedColumns: string[] = ['username', 'roles'];
  // displayedColumns: string[] = ['username', 'firstname', 'lastname', 'roles'];
  isLoadingResults = false;
  pageSize = 10;
  listLength = 0;
  pageNumber = 0;
  public selected: any;
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('userFormRef') formValues: NgForm;
  private userForm: FormGroup;

  public formNameRepeated: Boolean = false;
  public loading: Boolean = false;

  public roleType: any[] = [{
    'value': 'ROLE_WAITER',
    'viewValue': 'WAITER'
  }, {
    'value': 'ROLE_ORDER_SCREEN',
    'viewValue': 'ORDER_SCREEN'
  }];

  validationMessages: Object = {
    username: {
      required: 'El nombre de usuario es obligatorio',
      minlength: 'La longuitud mínima son 4 caracteres',
      maxlength: 'La longuitud máxima son 16 caracteres',
      nameInUse: 'El usuario ya existe'
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
      required: 'Los apellidos son obligatorios',
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
    private activateRoute: ActivatedRoute,
    private userService: UserService,
    private toastService: ToastService,
    private formBuilder: FormBuilder,
    private navigationService: NavigationService
  ) {
    this.loadData(this.pageNumber, this.pageSize);
  }

  ngOnInit() {
    this.buildUserForm();
  }

  ngAfterViewInit() {
  }

  buildUserForm() {
    if (this.selected) {
      this.userForm = this.formBuilder.group({
        username: [this.selected.username, [Validators.required, Validators.minLength(4), Validators.maxLength(16)]],
        email: [this.selected.email, [Validators.required, Validators.minLength(6), Validators.maxLength(32), Validators.email]],
        firstname: [this.selected.firstname, [Validators.required, Validators.minLength(2), Validators.maxLength(16)]],
        lastname: [this.selected.lastname, [Validators.required, Validators.minLength(2), Validators.maxLength(32)]],
        roles: [this.selected.roles, [Validators.required]],
      });
    } else {
      this.userForm = this.formBuilder.group({
        username: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(16)]],
        email: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(32), Validators.email]],
        firstname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(16)]],
        lastname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(32)]],
        password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(32)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(32), this.validatePassword]],
        roles: ['', [Validators.required]],
      });
    }
  }

  changePage($event) {
    this.isLoadingResults = true;
    const page = $event.pageIndex || 0;
    const max_per_page = $event.pageSize || 5;
    this.loadData(page, max_per_page);
  }

  toggleSelected(element) {
    if (this.selected && this.selected === element) {
      this.selected = null;
    } else {
      this.selected = element;
    }
    console.log(this.selected);
    this.buildUserForm();
  }

  loadData(page, max_per_page) {
    this.isLoadingResults = true;
    this.userService
      .list(page, max_per_page)
      .then((res: any) => {
        const ELEMENT_DATA = res.content;
        this.dataSource = new MatTableDataSource<Element>(ELEMENT_DATA);
        this.pageSize = res.size;
        this.listLength = res.totalElements;
        this.pageNumber = res.number;
      })
      .catch((err) => {
        console.log(err);
      });
    this.isLoadingResults = false;
  }

  isValidForm(form) {
    if (this.loading) {
      return false;
    } else {
      return form.valid;
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

  compareFn(a, b) {
    return a && b && a === b.name;
  }

  submitUser(userFormRef: NgForm) {
    if (this.selected) {
      // updating
    } else {
      // creating
      if (this.isValidForm(this.userForm)) {
        this.loading = true;
        const username = this.userForm.value['username'];
        const email = this.userForm.value['email'];
        const firstname = this.userForm.value['firstname'];
        const lastname = this.userForm.value['lastname'];
        const password = this.userForm.value['password'];
        const confirmPassword = this.userForm.value['confirmPassword'];
        const roles = this.userForm.value['roles'];
        setTimeout(() => {
          const userPostDto = {
            'username': username,
            'email': email,
            'firstname': firstname,
            'lastname': lastname,
            'password': password,
            'confirmPassword': confirmPassword,
            'roles': roles
          };
          this.userService
            .create(userPostDto)
            .then((res) => {
              this.navigationService.updateNavigation();
              this.loadData(this.pageNumber, this.pageSize);
              this.formNameRepeated = false;
              console.log(this.formValues);
              this.reset(userFormRef);
            }).catch((err) => {
              if (err.code === 409) {
                this.formNameRepeated = true;
              }
            });
          this.loading = false;
        }, 500);
      }
    }
  }

  reset(userFormRef: NgForm) {
    this.selected = null;
    userFormRef.reset({
      'username': '',
      'email': '',
      'firstname': '',
      'lastname': '',
      'password': '',
      'confirmPassword': '',
      'roles': []
    });
  }

}
