import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-success-dialog',
  standalone: true,
   templateUrl: './success-dialog.component.html',
  styleUrl: './success-dialog.component.scss',
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule
  ]

})
export class SuccessDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { message: string }) {}
}
