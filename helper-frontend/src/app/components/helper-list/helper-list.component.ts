
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelperService } from '../../services/helper.service';

import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './helper-list.component.html',
  styleUrls: ['./helper-list.component.scss']
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
}
