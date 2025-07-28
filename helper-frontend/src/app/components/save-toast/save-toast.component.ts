import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-save-toast',
  imports: [MatIconModule, MatSnackBarModule],
  standalone: true,
  template: `
    <div class="toast-container">
      <div class="toast-icon">
        <mat-icon>check_circle</mat-icon>
      </div>
      <div class="toast-text">
        {{ data.message }}
      </div>
    </div>
  `,
  styles: [`
  :host {
    all: unset;
  }

  .toast-container {
    background: #fff;
    color: #333;
    padding: 12px 16px;
    border-radius: 8px;
    display: flex;
    align-items: center;
   // box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15); /* light shadow */
    border-left: 4px solid #4caf50;
  }

  .toast-icon {
    background-color: #4caf50;
    border-radius: 50%;
    padding: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .toast-icon mat-icon {
    color: white;
    font-size: 20px;
  }

  .toast-text {
    margin-left: 10px;
    font-weight: 500;
  }
`]


})
export class SaveToastComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {}
}

