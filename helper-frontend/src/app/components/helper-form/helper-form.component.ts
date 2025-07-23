import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HelperService } from '../../services/helper.service';

@Component({
  standalone: true,
  selector: 'app-helper-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './helper-form.component.html',
  styleUrls: ['./helper-form.component.scss']
})
export class HelperFormComponent implements OnInit {
  form: any = {
    fullName: '',
    phone: '',
    address: '',
    serviceType: '',
    vehicleType: '',
    languages: [],
  };

  isEditMode = false;
  id: string = '';
  selectedLanguages: string[] = [];
  filePhoto!: File;
  fileKyc!: File;

  constructor(
    private helperService: HelperService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.isEditMode = !!this.id;

    if (this.isEditMode) {
      this.helperService.getHelperById(this.id).subscribe((data: any) => {
        this.form = data;
        this.selectedLanguages = data.languages;
      });
    }
  }

  onFileChange(event: any, type: 'photo' | 'kyc') {
    const file = event.target.files[0];
    if (type === 'photo') this.filePhoto = file;
    else this.fileKyc = file;
  }

  onLanguageToggle(lang: string) {
    if (this.selectedLanguages.includes(lang)) {
      this.selectedLanguages = this.selectedLanguages.filter(l => l !== lang);
    } else {
      this.selectedLanguages.push(lang);
    }
  }

  submitForm() {
    const formData = new FormData();
    for (const key in this.form) {
      formData.append(key, this.form[key]);
    }
    formData.append('languages', JSON.stringify(this.selectedLanguages));
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
