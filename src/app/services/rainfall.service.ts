import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RainfallService {

  private apiUrl = 'http://127.0.0.1:5000/predict'; // Flask API URL
  constructor(private http : HttpClient) { }

  predictRainfall(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }
}
