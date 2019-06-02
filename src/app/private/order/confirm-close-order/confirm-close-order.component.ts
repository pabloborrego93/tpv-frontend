import { Component, OnInit, Inject, Optional } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { MAT_DIALOG_DATA } from '@angular/material';
import * as _ from 'lodash';

@Component({
  selector: 'app-confirm-close-order',
  templateUrl: './confirm-close-order.component.html',
  styleUrls: ['./confirm-close-order.component.sass']
})
export class ConfirmCloseOrderComponent implements OnInit {

  public localData;
  public entregado = 0;

  constructor(@Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  private dialogRef: MatDialogRef<ConfirmCloseOrderComponent>) { }

  public zoneType: any[] = [{
    'value': 'TERRACE',
    'viewValue': 'Terraza'
  }, {
    'value': 'BAR',
    'viewValue': 'Bar'
  }, {
    'value': 'LOUNGE',
    'viewValue': 'Salón'
  }];

  ngOnInit() {
    this.localData = this.data;
  }

  close(data) {
    this.dialogRef.close(data);
  }

  orderLinesGetTotal() {
    let total = 0;
    _.map(this.localData.orderLines, (pl) => {
      total += pl.total;
    });
    return total;
  }

  getViewValue(value) {
    const val: any = this.zoneType.filter((v) => v.value === value);
    return val[0].viewValue;
  }

}
