import { Component, OnInit, Inject, Optional } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-addcomment',
  templateUrl: './addcomment.component.html',
  styleUrls: ['./addcomment.component.scss']
})
export class AddcommentComponent implements OnInit {

  constructor(@Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  private dialogRef: MatDialogRef<AddcommentComponent>) { }

  product: any;
  comentario: any;

  ngOnInit() {
    this.product = this.data;
  }

  close() {
    this.dialogRef.close(this.comentario);
  }

}
