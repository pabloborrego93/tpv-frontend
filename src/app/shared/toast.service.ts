import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class ToastService {

  constructor(public snackBar: MatSnackBar) { }

  openSnackBar(message: string, duration: number, action: string) {
    this.snackBar.open(message, action, {
      duration: duration
    });
  }

}
