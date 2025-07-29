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

import { MatDialog } from '@angular/material/dialog';
import { ConfirmDeleteDialogComponent } from '../confirm-delete-dialog/confirm-delete-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

import { FilterPanelComponent } from '../filter-panel/filter-panel.component';
import { ToastrService } from 'ngx-toastr';


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
    MatButtonModule,
    ConfirmDeleteDialogComponent,
    FilterPanelComponent
  ]
})
export class HelperListComponent implements OnInit {
  helpers: any[] = [];
  selectedHelper: any = this.helpers[0] || null;
  search = '';
  sortBy = '';
  order = 'asc';
  service = '';
  organization = '';
  totalCount = 0;
  filteredCount = 0;

  constructor(private dialog: MatDialog, private helperService: HelperService, private snackBar: MatSnackBar,private ToastrService:ToastrService) { }


  searchTerm: string = '';
  sortOrder: string = 'asc'; 
  showFilter: boolean = false;
  currentFilters = { service: '', organization: '' };

  
  allServices = ['Cooking', 'Cleaning', 'Security'];
  allOrganizations = ['Org A', 'Org B', 'Org C'];


  onApplyFilter(filter: { service: string, organization: string }) {
    this.currentFilters = filter;
    console.log('Applied filters:', this.currentFilters);
    this.fetchHelpers();  // Trigger backend call
  }

  onResetFilter() {
    this.currentFilters = { service: '', organization: '' };
    this.fetchHelpers();
  }

  ngOnInit() {
    this.fetchHelpers();
    this.selectHelper(this.helpers[0] || null);
  }


  fetchHelpers(): void {
    const params = {
      search: this.searchTerm,
      sortBy: this.sortBy,
      order: this.order,
      service: this.currentFilters.service,
      organization: this.currentFilters.organization,
    };

    this.helperService.getHelpers(params).subscribe((res) => {
      this.helpers = res.results;
      this.totalCount = res.totalCount;
      this.filteredCount = res.filteredCount;
      this.selectedHelper = this.helpers[0] || null;
    });
  }


  

  onSearchChange(): void {
    this.fetchHelpers();
  }

  onSortChange(selectedSort: string) {
  this.sortOrder = selectedSort;
  this.fetchHelpers(); // or whatever method you're calling to update the list
}

  applyFilters(service: string, organization: string): void {
    this.service = service;
    this.organization = organization;
    this.fetchHelpers();
  }

  resetFilters(): void {
    this.service = '';
    this.organization = '';
    this.fetchHelpers();
  }

  selectHelper(helper: any) {
    this.selectedHelper = helper;
  }

  // ✅ ADD THIS METHOD BELOW

  openDeleteDialog(helper: any) {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      data: helper,
      width: '400px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'confirm') {
        this.deleteHelper(helper._id);
      }
    });
  }

  // downloadHelpers() {
  //   // Convert helpers to CSV or JSON and trigger download
  //   const blob = new Blob([JSON.stringify(this.filteredHelpers)], { type: 'application/json' });
  //   const url = window.URL.createObjectURL(blob);
  //   const a = document.createElement('a');
  //   a.href = url;
  //   a.download = 'helpers.json';
  //   a.click();
  //   window.URL.revokeObjectURL(url);
  // }

  deleteHelper(id: string) {
    const confirmed = confirm('Are you sure you want to delete this helper?');
    if (!confirmed) return;

    this.helperService.deleteHelper(id).subscribe(() => {
      this.fetchHelpers();  // Refresh the list

      // Reset selectedHelper if it was the one deleted
      if (this.selectedHelper && this.selectedHelper._id === id) {
        this.selectedHelper = null;
      }

      this.ToastrService.success('Helper deleted successfully', 'Success');
      // Optionally show a toast
      // this.snackBar.open('Helper deleted successfully', 'Close', {
      //   duration: 3000,
      //   panelClass: 'success-snackbar'
      // });
    });
  }

}
