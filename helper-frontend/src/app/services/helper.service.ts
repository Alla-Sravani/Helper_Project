import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HelperService {
  private apiUrl = 'http://localhost:3000/api/helpers'; 

  constructor(private http: HttpClient) {}

  getHelpers(params: any = {}): Observable<any> {
    console.log('Fetching helpers with params:', params);
    let httpParams = new HttpParams();
    for (const key in params) {
      if (params[key]) {
        httpParams = httpParams.set(key, params[key]);
      }
    }
    return this.http.get<any>(this.apiUrl, { params: httpParams });
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
