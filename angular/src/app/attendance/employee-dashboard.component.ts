import { Component, OnInit } from '@angular/core';
import { AttendanceService } from '../services/attendance.service';

@Component({
  selector: 'app-employee-dashboard',
  templateUrl: './employee-dashboard.component.html'
})
export class EmployeeDashboardComponent implements OnInit {
  timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  location = { latitude: 0, longitude: 0 };
  history: any[] = [];
  message = '';

  constructor(private attendanceService: AttendanceService) {}

  ngOnInit(): void {
    this.loadLocation();
    this.fetchHistory();
  }

  loadLocation() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.location = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };
    });
  }

  checkIn() {
    this.attendanceService.checkIn(this.location.latitude, this.location.longitude, this.timezone).subscribe((res: any) => {
      this.message = res.message;
      this.fetchHistory();
    });
  }

  checkOut() {
    this.attendanceService.checkOut(this.location.latitude, this.location.longitude, this.timezone).subscribe((res: any) => {
      this.message = res.message;
      this.fetchHistory();
    });
  }

  fetchHistory() {
    this.attendanceService.myAttendance(this.timezone).subscribe((records: any) => {
      this.history = records;
    });
  }
}
