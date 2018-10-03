import { Component, OnInit } from '@angular/core';
import { MyProfileService } from './my-profile.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit {

  private myInfo = {};

  constructor(private myProfileService: MyProfileService) { }

  ngOnInit() {
    this.myProfileService.getCurrentUserInfo().subscribe((response) => {
      this.myInfo = response;
    });
  }

}
