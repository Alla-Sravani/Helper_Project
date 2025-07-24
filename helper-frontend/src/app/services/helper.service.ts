import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HelperService {
  private apiUrl = 'http://localhost:3000/api/helpers'; // Change if needed

  constructor(private http: HttpClient) {}

  getHelpers(search: string = '', sortBy: string = 'fullName', order: string = 'asc'): Observable<any> {
    const params = new HttpParams()
      .set('search', search)
      .set('sortBy', sortBy)
      .set('order', order);

    return this.http.get(this.apiUrl, { params });
  }

  getHelperById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  addHelper(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, formData);
  }

  updateHelper(id: string, formData: FormData): Observable<any> {
    console.log('Updating helper with ID:', id);
    console.log('Form data:', formData);
    return this.http.put(`${this.apiUrl}/${id}`, formData);
  }

  deleteHelper(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
