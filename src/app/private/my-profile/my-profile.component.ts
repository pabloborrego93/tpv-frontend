import { Component, OnInit } from '@angular/core';
import { MyProfileService } from './my-profile.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit {

  public updateUserForm: FormGroup;
  public loading: Boolean = false;
  public formError: String;
  public myInfo;

  validationMessages: Object = {
    firstname: {
      required: 'Firstname is required!',
      minlength: 'Min length is 2',
      maxlength: 'Max length is 16'
    },
    lastname: {
      required: 'Lastname is required!',
      minlength: 'Minimum length is 2',
      maxlength: 'Max length is 32'
    },
    email: {
      required: 'Email is required!',
      minlength: 'Minimum length is 6',
      maxlength: 'Max length is 32'
    }
  };

  constructor(
    private myProfileService: MyProfileService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.myProfileService.getCurrentUserInfo().subscribe((response) => {
      this.myInfo = response;
      if (this.myInfo) {
        this.buildForm();
      }
    });
  }

  buildForm() {
    this.updateUserForm = this.formBuilder.group({
      email: [this.myInfo.email, [Validators.required, Validators.minLength(6), Validators.maxLength(32)]],
      firstname: [this.myInfo.firstname, [Validators.required, Validators.minLength(2), Validators.maxLength(16)]],
      lastname: [this.myInfo.lastname, [Validators.required, Validators.minLength(2), Validators.maxLength(32)]]
    });
  }

  updateUser() {
    if (this.isValidForm()) {
      this.loading = true;
      const firstname = this.updateUserForm.value['firstname'];
      const lastname = this.updateUserForm.value['lastname'];
      const email = this.updateUserForm.value['email'];
      setTimeout(() => {
        const userUpdateDto = {
          'firstname' : firstname,
          'lastname' : lastname,
          'email' : email
        };
        this.myProfileService.updateUserInfo(userUpdateDto).subscribe((res) => {
          this.myInfo = res;
        });
        this.loading = false;
      }, 500);
    }
  }

  isValidForm() {
    if (this.loading) {
      return false;
    } else {
      return this.updateUserForm.valid;
    }
  }

}
