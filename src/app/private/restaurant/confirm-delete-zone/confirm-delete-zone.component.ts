import { Component, OnInit, Inject, Optional } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-confirm-delete-zone',
  templateUrl: './confirm-delete-zone.component.html',
  styleUrls: ['./confirm-delete-zone.component.sass']
})
export class ConfirmDeleteZoneComponent implements OnInit {

  public zoneData;

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

  constructor(@Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  private dialogRef: MatDialogRef<ConfirmDeleteZoneComponent>) { }

  ngOnInit() {
    this.zoneData = this.data;
  }

  getViewValue(value) {
    const val: any = this.zoneType.filter((v) => v.value === value);
    return val[0].viewValue;
  }

  close(data) {
    this.dialogRef.close(data);
  }

}
