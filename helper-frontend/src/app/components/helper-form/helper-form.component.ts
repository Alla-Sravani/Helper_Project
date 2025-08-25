import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HelperService } from '../../services/helper.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';

import { MatDialog } from '@angular/material/dialog';

import { UploadDialogComponent } from '../upload-dialog/upload-dialog.component';
import { SuccessDialogComponent } from '../success-dialog/success-dialog.component';


import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

import { StepperSelectionEvent } from '@angular/cdk/stepper';



@Component({
  selector: 'app-helper-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatIconModule,
    MatStepperModule,
    UploadDialogComponent,
    SuccessDialogComponent,
    ToastModule,
    ButtonModule,
    RippleModule,


  ],
  templateUrl: './helper-form.component.html',
  styleUrls: ['./helper-form.component.scss'],

})

export class HelperFormComponent implements OnInit {
  form!: FormGroup;
  isEditMode = false;
  id = '';
  filePhoto!: File;
  fileKyc!: File;
  currentStep = 1;
  isPreviewMode = false;

  photoPreview: string | ArrayBuffer | null = null;
  kycPreview: string | ArrayBuffer | null = null;

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private helperService: HelperService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService

  ) { }

  openUploadDialog() {
    this.dialog.open(UploadDialogComponent, {
      width: '400px',
      disableClose: true
    }).afterClosed().subscribe(result => {
      if (result?.file && result?.type) {
        // ✅ Set the selected file to upload later
        this.fileKyc = result.file;

        // ✅ Create a preview
        const reader = new FileReader();
        reader.onload = () => {
          this.kycPreview = reader.result;
        };
        reader.readAsDataURL(result.file);

        console.log(' File:', result.file);
        console.log('Document Type:', result.type);
      }
    });
  }

  showSuccessDialog(helperName: string) {

    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      data: { message: `${helperName} ` },
      width: '400px',
      panelClass: 'custom-success-dialog',
      disableClose: true
    });
    setTimeout(() => dialogRef.close(), 2000);
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.isEditMode = !!this.id;

    this.form = this.fb.group({
      fullName: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      email: ['', [Validators.email]],
      address: ['', Validators.required],
      serviceType: ['', Validators.required],
      vehicleType: [''],
      gender: ['', Validators.required],
      languages: [[], Validators.required],
      organization: ['', Validators.required]
    });

    if (this.isEditMode) {
      this.helperService.getHelperById(this.id).subscribe((data: any) => {
        if (typeof data.languages === 'string') {
          try {
            data.languages = JSON.parse(data.languages);
          } catch {
            data.languages = [];
          }
        }
        this.form.patchValue(data);
      });
    }
  }

  onFileChange(event: any, type: 'photo' | 'kyc') {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (type === 'photo') {
        this.photoPreview = reader.result;
        this.filePhoto = file;
      } else {
        this.kycPreview = reader.result;
        this.fileKyc = file;
      }
    };
    reader.readAsDataURL(file);
  }

  // First Submit → Move to Preview Step
  submitForm() {
    if (this.form.invalid) {
      // Log errors to console
      console.log(this.form.errors);
      console.log(this.form.value);
      console.warn('❌ Form is invalid. Errors:');
      Object.entries(this.form.controls).forEach(([key, control]) => {
        if (control.invalid) {
          console.error(`🔴 ${key} is invalid`, control.errors);
        }
      });

      this.form.markAllAsTouched(); // Trigger red validation errors in UI
      return;
    }
    //console.log('🟡 submitForm triggered');

    this.currentStep = 2;
    //this.isPreviewMode = true;
  }

  // Final Submit to Backend
  finalSubmit() {
    this.currentStep = 4;
    const formData = new FormData();

    for (const key in this.form.value) {
      const value = this.form.value[key];
      if (key === 'languages') continue;

      formData.append(key, typeof value === 'string' ? value : JSON.stringify(value));
    }

    formData.append('languages', JSON.stringify(this.form.value.languages));

    if (this.filePhoto) formData.append('photo', this.filePhoto);
    if (this.fileKyc) formData.append('kyc', this.fileKyc);

    if (this.isEditMode) {
      this.helperService.updateHelper(this.id, formData).subscribe(() => {
        //alert('✅ Helper updated!');

        this.messageService.add({ severity: 'success', summary: 'success', detail: 'Changes updated', key: 'br', life: 3000 });

        //this.showSuccessDialog(this.form.value.fullName);

        this.router.navigate(['/helpers']);
      });
    } else {
      this.helperService.addHelper(formData).subscribe(() => {
        //alert('✅ Helper added!');
        this.showSuccessDialog(this.form.value.fullName);
        this.router.navigate(['/helpers']);
      });
    }

  }
  additionalDocumentFile: File | null = null;
  additionalDocPreview: string | null = null;

  onAdditionalDocumentChange(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0];

    if (file) {

      if (file.size > 5 * 1024 * 1024) {
        alert('File size should not exceed 5MB.');
        return;
      }

      this.additionalDocumentFile = file;
      this.additionalDocPreview = file.name;
    }
  }

  goToPreviousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  goToNextStep() {
    if (this.currentStep < 3) {
      this.currentStep++;
    }
  }

  onStepSelectionChange(event: StepperSelectionEvent) {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      // this.currentStep=1;
      // event.selectedIndex=0;
    // console.log(this.currentStep);

      // return;
    }
    else {
      this.currentStep = event.selectedIndex + 1;
    }
    console.log(this.currentStep);

  }
}
