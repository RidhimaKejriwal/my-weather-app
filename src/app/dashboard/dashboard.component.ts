import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../services/weather.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit{
  searchInput: string = '';
  weatherData: any;
  location: string = '';
  description: string = '';
  days: any;

  constructor(private weatherService: WeatherService, private toastr: ToastrService, private spinner: NgxSpinnerService) {

  }

  ngOnInit(): void {
    this.spinner.show();
    this.getWeatherData('India');
  }

  updateSearch(event: any) {
    this.searchInput = event.target.value;
  }

  search() {
    this.getWeatherData(this.searchInput);
  }

  getWeatherData(city: string) {
    if(!city) {
      city = 'India';
    }
    this.weatherService.getCityData(city).subscribe((res)=> {
      this.weatherData = res;
      this.fillData();
      this.showAlert();
    },
    (error) => {
      console.log(error);
    },
    () => {
      this.spinner.hide();
    }
  )
  }

  fillData() {
    this.location = this.weatherData.resolvedAddress;
    this.description = this.weatherData.description;
    this.days = this.weatherData.days;
  }

  convertFahrenheitToCelsius(fahrenheit: number): number {
    return Math.round((fahrenheit - 32) * (5 / 9));
  }

  formatDate(inputDate: string) {
    const date = new Date(inputDate);
    const formattedDate = date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
    });
    return formattedDate;
  }

  showAlert()
 {
  if(this.weatherData.alerts.length > 0) {
    const alert = this.weatherData.alerts[0]
    this.toastr.warning(alert.headline, alert.event, {
      timeOut: 10000
    });
  }
 }

 convertMphToKmh(mph: number): number {
  return mph * 1.60934; 
}

getCardinalDirection(degrees: number): string {
  if (degrees >= 0 && degrees <= 22.5 || degrees > 337.5 && degrees <= 360) return 'North';
  if (degrees > 22.5 && degrees <= 67.5) return 'Northeast';
  if (degrees > 67.5 && degrees <= 112.5) return 'East';
  if (degrees > 112.5 && degrees <= 157.5) return 'Southeast';
  if (degrees > 157.5 && degrees <= 202.5) return 'South';
  if (degrees > 202.5 && degrees <= 247.5) return 'Southwest';
  if (degrees > 247.5 && degrees <= 292.5) return 'West';
  if (degrees > 292.5 && degrees <= 337.5) return 'Northwest';
  return 'Unknown';
}
}
