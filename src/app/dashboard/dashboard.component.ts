import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../services/weather.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  Chart,
  ChartConfiguration,
  registerables
} from 'chart.js';

Chart.register(...registerables);


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
  lineChartData: any

  lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: 'white'
        },
        display: true,
        position: 'bottom',
      }
    },
    scales: {
      x: {
        ticks: {
          color: 'white',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.2)',
        },
      },
      y: {
        ticks: {
          color: 'white',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.2)',
        },
        beginAtZero: true
      }
    }
  };

  barChartData: any

  barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: 'white'
        },
        display: true,
        position: 'bottom',
      }
    },
    scales: {
      x: {
        ticks: {
          color: 'white',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.2)',
        },
      },
      y: {
        ticks: {
          color: 'white',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.2)',
        },
        beginAtZero: true
      }
    }
  };

  windChartData: any

  windChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: 'white'
        },
        display: true,
        position: 'bottom',
      }
    },
    scales: {
      r: {
        grid: {
          color: 'rgba(255, 255, 255, 0.2)',
        },
        angleLines: {
          color: 'rgba(255, 255, 255, 0.5)', 
        },
        pointLabels: {
          color: 'white', 
        },
      },
      x: {
        ticks: {
          color: 'white',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.2)',
        },
      },
      y: {
        ticks: {
          color: 'white',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.2)',
        },
        beginAtZero: true
      }
    }
  };

  constructor(private weatherService: WeatherService, private toastr: ToastrService, private spinner: NgxSpinnerService) {

  }

  ngOnInit(): void {
    this.getWeatherData('India');
  }

  search() {
    this.getWeatherData(this.searchInput);
    this.searchInput = ''; 
  }

  getWeatherData(city: string) {
    this.spinner.show();
    if(!city) {
      city = 'India';
    }
    this.weatherService.getCityData(city).subscribe((res)=> {
      this.weatherData = res;
      this.fillData();
      this.spinner.hide();
      this.toastr.info(this.description, 'Weather Info', {
        timeOut: 5000
      });
    },
    (error) => {
      if(error.status === 400) {
        this.toastr.error("Invalid City Input!!");
      }
      this.spinner.hide();
    },
    () => {
      
    }
  )
  }

  getChartsData() {
    this.lineChartData = {
      labels: [...this.days.map((day: any) => this.formatDate(day.datetime))],
      datasets: [
        {
          data: [...this.days.map((day: any) =>
            this.convertFahrenheitToCelsius(day.temp)
          )],
          label: 'Temperature (°C)',
          borderColor: 'rgb(255, 159, 64)',
          backgroundColor: 'rgba(255, 159, 64, 0.2)',
          fill: true,
        },
      ],
    };

    this.barChartData = {
      labels: [...this.days.map((day: any) => this.formatDate(day.datetime))],
      datasets: [
        {
          data: [...this.days.map((day: any) => day.precipprob || 0)],
          label: 'Precipitation Probability (%)',
          backgroundColor: ['rgba(75, 192, 192, 0.2)'],
          borderColor: ['rgb(75, 192, 192)'],
          borderWidth: 2,
        },
      ],
    };

    this.windChartData = { 
      labels: [...this.days.map((day: any) => this.formatDate(day.datetime))],
      datasets: [
        {
          data: [...this.days.map((day: any) =>
            this.convertMphToKmh(day.windspeed)
          )],
          label: 'Wind Speed (km/h)',
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          borderColor: 'rgb(135, 79, 246)',
          fill: true,
        },
      ],
    };
  }

  fillData() {
    this.location = this.weatherData.resolvedAddress;
    this.description = this.weatherData.description;
    this.days = this.weatherData.days;
    this.selectedDay = this.days[0];
    this.getChartsData();
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

  this.toastr.info(this.description, 'Weather Info', {
    timeOut: 5000
  });

  if (this.convertFahrenheitToCelsius(this.selectedDay.tempmax) >= 40) {
    this.toastr.error("Temperatures are expected to rise above 40°C. Stay indoors, stay hydrated, and avoid outdoor activities.", "Severe heat alert!");
  }else if (this.convertFahrenheitToCelsius(this.selectedDay.tempmax) > 35 && this.convertFahrenheitToCelsius(this.selectedDay.tempmax) < 40) {
    this.toastr.warning("High temperatures of 35–40°C expected. Stay hydrated and avoid outdoor activities during peak hours.", "Warm weather alert!");
  }

  if (this.convertFahrenheitToCelsius(this.selectedDay.tempmin) <= 5) {
    this.toastr.error("Temperatures are expected to drop below 5°C. Wear warm clothing and limit outdoor exposure.", "Extreme cold conditions!");
  }else if(this.convertFahrenheitToCelsius(this.selectedDay.tempmin) > 5 && this.convertFahrenheitToCelsius(this.selectedDay.tempmin) < 10) {
    this.toastr.warning("Cold weather with temperature dropping between 5–10°C. Dress warmly and take necessary precautions.", "Cold weather alert!");
  }

  if (this.selectedDay.precipprob >= 80) {
    this.toastr.error("High precipitation probability with heavy rain and possible storms. Avoid traveling and stay safe from waterlogging or flash floods", "Heavy rainfall alert!")
  } else if (this.selectedDay.precipprob > 50 && this.selectedDay.precipprob < 80) {
    this.toastr.warning("Rainfall expected. Carry an umbrella and stay alert for slippery roads.", "Rainfall alert!");
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
