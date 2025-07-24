import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelperService } from '../../services/helper.service';

import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';

import { MatCardModule } from '@angular/material/card';

@Component({
  standalone: true,
  selector: 'app-helper-list',
  templateUrl: './helper-list.component.html',
  styleUrls: ['./helper-list.component.scss'],
  imports: [
    CommonModule,
  FormsModule,
  RouterModule,
  MatFormFieldModule,
  MatInputModule,
  MatIconModule,
  MatSelectModule,
  MatListModule,
  MatCardModule,
  MatButtonModule
  ]
})
export class HelperListComponent implements OnInit {
  helpers: any[] = [];
  filteredCount = 0;
  totalCount = 0;
  selectedHelper: any = null;
  searchTerm = '';
  sortBy = 'fullName';
  sortOrder = 'asc';

  constructor(private helperService: HelperService) {}

  ngOnInit() {
    this.fetchHelpers();
  }

  fetchHelpers() {
    this.selectedHelper = this.helpers[0] || null;
    this.helperService.getHelpers(this.searchTerm, this.sortBy, this.sortOrder)
      .subscribe((res: any) => {
        this.helpers = res.results;
        this.filteredCount = res.filteredCount;
        this.totalCount = res.totalCount;
        this.selectedHelper = this.helpers[0] || null;
      });
  }

  onSearchChange() {
    this.fetchHelpers();
  }

  onSortChange(order: string) {
    this.sortOrder = order;
    this.fetchHelpers();
  }

  selectHelper(helper: any) {
    this.selectedHelper = helper;
  }

  // ✅ ADD THIS METHOD BELOW
  deleteHelper(id: string) {
    if (confirm('Are you sure you want to delete this helper?')) {
      this.helperService.deleteHelper(id).subscribe(() => {
        this.fetchHelpers();  // Refresh the list
        if (this.selectedHelper?._id === id) {
          this.selectedHelper = null;
        }
      });
    }
  }
}
