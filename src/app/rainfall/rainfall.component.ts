import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { RainfallService } from '../services/rainfall.service';

@Component({
  selector: 'app-rainfall',
  templateUrl: './rainfall.component.html',
  styleUrls: ['./rainfall.component.scss']
})
export class RainfallComponent implements OnInit {

  weatherForm: FormGroup;
  fields:any = [
    { key: 'pressure', label: 'Pressure', type: 'number' },
    { key: 'maxtemp', label: 'Maximum Temperature (°C)', type: 'number' },
    { key: 'temparature', label: 'Temperature (°C)', type: 'number' },
    { key: 'mintemp', label: 'Minimum Temperature (°C)', type: 'number' },
    { key: 'dewpoint', label: 'Dew Point', type: 'number' },
    { key: 'humidity', label: 'Humidity', type: 'number' },
    { key: 'winddirection', label: 'Wind Direction', type: 'number' },
    { key: 'windspeed', label: 'Wind Speed', type: 'number' }
  ];
  probability: number = 0;
  prediction: string = ''

  constructor(private spinner: NgxSpinnerService, private fb: FormBuilder, private rainfallService: RainfallService) {

    this.weatherForm = this.fb.group(
      this.fields.reduce((acc: any, field: any) => {
        acc[field.key] = ['', [Validators.required, Validators.pattern(/^[0-9]+(\.[0-9]+)?$/)]];
        return acc;
      }, {})
    );
  }
  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.weatherForm.valid) {
      const weatherData = [this.weatherForm.value];

      // Call the API service
      this.rainfallService.predictRainfall(weatherData).subscribe(
        (response) => {
          this.prediction = response.prediction;
          this.probability = this.convertToPercent(response.probability);
          console.log(response.probability);
        },
        (error) => {
          console.error('Error:', error);
        }
      );
    }
  }

  convertToPercent(probability: number) {
    return Math.round(probability * 100);
  }

}
