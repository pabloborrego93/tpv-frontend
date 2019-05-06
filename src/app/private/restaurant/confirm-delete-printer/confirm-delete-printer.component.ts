import { Component, OnInit, Inject, Optional } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-confirm-delete-printer',
  templateUrl: './confirm-delete-printer.component.html',
  styleUrls: ['./confirm-delete-printer.component.sass']
})
export class ConfirmDeletePrinterComponent implements OnInit {

  public printerData;

  constructor(@Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  private dialogRef: MatDialogRef<ConfirmDeletePrinterComponent>) { }

  ngOnInit() {
    this.printerData = this.data;
  }

  close(data) {
    this.dialogRef.close(data);
  }

}
