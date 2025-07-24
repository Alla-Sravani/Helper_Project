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
    MatOptionModule],
  templateUrl: './helper-form.component.html',
  styleUrls: ['./helper-form.component.scss']
})
export class HelperFormComponent implements OnInit {
  form!: FormGroup;
  isEditMode = false;
  id = '';
  filePhoto!: File;
  fileKyc!: File;

  constructor(
    private fb: FormBuilder,
    private helperService: HelperService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  debug() {
    console.log('✅ Button clicked!');
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
        // ✅ Convert stringified languages to array if needed
        if (typeof data.languages === 'string') {
          try {
            data.languages = JSON.parse(data.languages);
          } catch (err) {
            data.languages = [];
          }
        }
        this.form.patchValue(data);
      });
    }

  }

  onFileChange(event: any, type: 'photo' | 'kyc') {
    const file = event.target.files[0];
    if (type === 'photo') this.filePhoto = file;
    else this.fileKyc = file;
  }

  submitForm() {
  if (this.form.invalid) {
    console.warn('❌ Form is invalid');
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      if (control && control.invalid) {
        console.warn(`🔴 Field "${key}" is invalid:`, control.errors);
      }
    });
    this.form.markAllAsTouched();
    return;
  }

  // Continue submission logic



    // continue with formData logic...



  const formData = new FormData();
  for(const key in this.form.value) {
    if (key === 'languages') continue;
    const value = this.form.value[key];
    if (typeof value === 'string') {
      formData.append(key, value);
    } else {
      formData.append(key, JSON.stringify(value));
    }
  }

// ✅ Handle 'languages' separately
formData.append('languages', JSON.stringify(this.form.value.languages));


if (this.filePhoto) formData.append('photo', this.filePhoto);
if (this.fileKyc) formData.append('kyc', this.fileKyc);

if (this.isEditMode) {
  this.helperService.updateHelper(this.id, formData).subscribe(() => {
    alert('Helper updated!');
    this.router.navigate(['/helpers']);
  });
} else {
  this.helperService.addHelper(formData).subscribe(() => {
    alert('Helper added!');
    this.router.navigate(['/helpers']);
  });
}
  }
}
