import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../services/weather.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  Chart,
  ChartConfiguration,
  registerables // Import required registerables
} from 'chart.js';

Chart.register(...registerables); // Register all necessary chart components


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
  selectedDay: any
  lineChartData = {
    labels: [],
    datasets: [
      {
        label: 'Temperature (°C)',
        data: [],
        borderColor: 'rgb(255, 159, 64)',
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
        fill: true,
      }
    ]
  };

  lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  barChartData = {
    labels: [],
    datasets: [
      {
        label: 'Precipitation Probability (%)',
        data: [],
        backgroundColor: ['rgba(75, 192, 192, 0.2)'],
        borderColor: ['rgb(75, 192, 192)'],
        borderWidth: 1,
      }
    ]
  };

  barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  windChartData = {
    labels: [], 
    datasets: [
      {
        label: 'Wind Speed (km/h)',
        data: [], 
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgb(153, 102, 255)',
        borderWidth: 1,
      }
    ]
  };

  windChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

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
      this.getChartsData();
    },
    (error) => {
      console.log(error);
    },
    () => {
      this.spinner.hide();
    }
  )
  }

  getChartsData() {
    this.lineChartData.labels = this.days.map((day: any) => this.formatDate(day.datetime));
    this.lineChartData.datasets[0].data = this.days.map((day: any) =>
      this.convertFahrenheitToCelsius(day.temp)
    );
    this.barChartData.labels = this.days.map((day: any) => this.formatDate(day.datetime));
    this.barChartData.datasets[0].data = this.days.map((day: any) =>
      day.precipprob || 0
    );
    this.windChartData.labels = this.days.map((day: any) => this.formatDate(day.datetime));
    this.windChartData.datasets[0].data = this.days.map((day: any) =>
      this.convertMphToKmh(day.windspeed)
    );
  }

  fillData() {
    this.location = this.weatherData.resolvedAddress;
    this.description = this.weatherData.description;
    this.days = this.weatherData.days;
    this.selectedDay = this.days[0];
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

  getImage(day:any) {
    const condition: string = day.conditions;
    if(condition.includes("Rain")) {
      return "/assets/images/heavy-rain.png";
    }
    else if(condition.includes("Clear")) {
      return "/assets/images/day.png";
    }
    else {
      return "/assets/images/cloudy-day.png"
    }
  }

  changeHourlyData(day: any) {
    this.selectedDay = day;
  }

}
