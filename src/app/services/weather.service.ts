import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  private apiKey = '2PPHA7JNFJF2BXLPQVUCT99F3';
  private baseUrl = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline';

  constructor(private http : HttpClient) { }

  getCityData(city: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${city}?key=${this.apiKey}`);
  }
}
