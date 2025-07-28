import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-upload-dialog',
  templateUrl: './upload-dialog.component.html',
  styleUrl: './upload-dialog.component.scss',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    FormsModule,
    MatInputModule,
    MatDialogModule,
    MatOptionModule,
    MatIconModule
  ]
})
export class UploadDialogComponent {
  documentTypes = ['Aadhaar Card', 'PAN Card', 'Driving License', 'Voter ID'];
  documentType: string = '';
  fileName: string = '';
  selectedFile: File | null = null;

  constructor(private dialogRef: MatDialogRef<UploadDialogComponent>) {}

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.selectedFile = file;
      this.fileName = file.name;
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    const file = event.dataTransfer?.files[0];
    if (file) {
      this.selectedFile = file;
      this.fileName = file.name;
    }
  }

  save() {
    if (this.selectedFile && this.documentType) {
      this.dialogRef.close({ file: this.selectedFile, type: this.documentType });
    }
  }
}