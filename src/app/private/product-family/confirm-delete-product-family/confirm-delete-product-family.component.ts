import { Component, OnInit, Inject, Optional } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-confirm-delete-product-family',
  templateUrl: './confirm-delete-product-family.component.html',
  styleUrls: ['./confirm-delete-product-family.component.sass']
})
export class ConfirmDeleteProductFamilyComponent implements OnInit {

  public localData;

  constructor(@Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  private dialogRef: MatDialogRef<ConfirmDeleteProductFamilyComponent>) { }

  ngOnInit() {
    this.localData = this.data;
  }

  close(data) {
    this.dialogRef.close(data);
  }

}
