import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { ImageCroppedEvent } from 'ngx-image-cropper/src/image-cropper.component';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-product-image-cropper',
  templateUrl: './product-image-cropper.component.html',
  styleUrls: ['./product-image-cropper.component.scss']
})
export class ProductImageCropperComponent implements OnInit {

  imageChangedEvent: any = '';
  croppedImage: any = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ProductImageCropperComponent>) { }

  ngOnInit() {
    this.imageChangedEvent = this.data;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }
  imageLoaded() {
    // show cropper
  }
  loadImageFailed() {
    // show message
  }
  crop() {
    this.dialogRef.close(this.croppedImage);
  }
}
