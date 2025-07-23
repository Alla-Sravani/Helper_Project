import { Routes } from '@angular/router';


    export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'helpers'
  },
  {
    path: 'helpers',
    loadComponent: () =>
      import('./components/helper-list/helper-list.component').then(m => m.HelperListComponent)
  },
  {
    path: 'helpers/add',
    loadComponent: () =>
      import('./components/helper-form/helper-form.component').then(m => m.HelperFormComponent)
  },
  {
    path: 'helpers/edit/:id',
    loadComponent: () =>
      import('./components/helper-form/helper-form.component').then(m => m.HelperFormComponent)
  }
];

