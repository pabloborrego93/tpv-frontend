import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.scss']
})
export class BrandComponent implements OnInit {

  currentUser: String;

  constructor() { }

  ngOnInit() {
    const everything = JSON.parse(localStorage.getItem('currentUser'));
    this.currentUser = everything.username;
  }

}
