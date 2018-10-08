import { Component, OnInit } from '@angular/core';
import { MyProfileService } from './my-profile.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit {

  private updateUserForm: FormGroup;
  private loading: Boolean = false;
  private formError: String;
  private myInfo = {};

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
    private myProfileService: MyProfileService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.myProfileService.getCurrentUserInfo().subscribe((response) => {
      this.myInfo = response;
    });
    this.buildForm();
  }

  buildForm() {
    this.updateUserForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(16)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(32)]]
    });
  }

  updateUser() {

  }

}
