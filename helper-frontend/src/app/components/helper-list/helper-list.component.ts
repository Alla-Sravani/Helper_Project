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
  ConfirmDeleteDialogComponent
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

  constructor(private dialog: MatDialog,private helperService: HelperService,private snackBar: MatSnackBar) {}

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
  deleteHelper(id: string) {
  const confirmed = confirm('Are you sure you want to delete this helper?');
  if (!confirmed) return;

  this.helperService.deleteHelper(id).subscribe(() => {
    this.fetchHelpers();  // Refresh the list

    // Reset selectedHelper if it was the one deleted
    if (this.selectedHelper && this.selectedHelper._id === id) {
      this.selectedHelper = null;
    }

    // Optionally show a toast
    this.snackBar.open('Helper deleted successfully', 'Close', {
      duration: 3000,
      panelClass: 'success-snackbar'
    });
  });
}

}
