import { Component, OnInit, Input } from '@angular/core';
import { AddcommentComponent } from './../addcomment/addcomment.component';
import { MatAccordion, MatDialog } from '@angular/material';

@Component({
  selector: 'app-product-composite-view',
  templateUrl: './product-composite-view.component.html',
  styleUrls: ['./product-composite-view.component.sass']
})
export class ProductCompositeViewComponent implements OnInit {

  @Input() product;

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }

  openDialog(event) {
    const dialogRef = this.dialog.open(AddcommentComponent, { data: event });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        event.comment = result;
      }
    });
  }

}
