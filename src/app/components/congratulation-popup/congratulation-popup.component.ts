import {Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'dialog',
  templateUrl: 'congratulation-popup.component.html',
  standalone: true,
  styleUrls: ['congratulation-popup.component.scss']
})
export class CongratulationPopupComponent {
  constructor(
    public dialogRef: MatDialogRef<CongratulationPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { level: number }) { }
}
