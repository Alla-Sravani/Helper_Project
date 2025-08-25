import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filter-panel',
  standalone: true,
  imports: [NgIf, NgFor, MatSelectModule, MatButtonModule, FormsModule],
  templateUrl: './filter-panel.component.html',
  styleUrls: ['./filter-panel.component.css']
})
export class FilterPanelComponent {
  @Input() services: string[] = [];
  @Input() organizations: string[] = [];

  @Output() applyFilter = new EventEmitter<{ service: string[], organization: string[] }>();
  @Output() resetFilter = new EventEmitter<void>();

  selectedService: string[] = [];
  selectedOrganization: string[] = [];
 

  Onapply() {
    this.applyFilter.emit({ service: this.selectedService, organization: this.selectedOrganization });
  }

  Onreset() {
    this.selectedService = [];
    this.selectedOrganization = [];
    this.resetFilter.emit();
  }
}
