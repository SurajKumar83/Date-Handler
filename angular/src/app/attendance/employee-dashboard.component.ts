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
  error = '';

  constructor(private attendanceService: AttendanceService) {}

  ngOnInit(): void {
    this.loadLocation();
    this.fetchHistory();
  }

  loadLocation() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
      },
      () => {
        this.error = 'Unable to read location. Please enable GPS/location permission.';
      }
    );
  }

  checkIn() {
    this.message = '';
    this.error = '';
    this.attendanceService.checkIn(this.location.latitude, this.location.longitude, this.timezone).subscribe({
      next: (res: any) => {
        this.message = res.geofence?.note ? `${res.message} (${res.geofence.note})` : res.message;
        this.fetchHistory();
      },
      error: (err) => {
        this.error = err?.error?.message || 'Check-in failed';
      }
    });
  }

  checkOut() {
    this.message = '';
    this.error = '';
    this.attendanceService.checkOut(this.location.latitude, this.location.longitude, this.timezone).subscribe({
      next: (res: any) => {
        this.message = res.geofence?.note ? `${res.message} (${res.geofence.note})` : res.message;
        this.fetchHistory();
      },
      error: (err) => {
        this.error = err?.error?.message || 'Check-out failed';
      }
    });
  }

  fetchHistory() {
    this.attendanceService.myAttendance(this.timezone).subscribe({
      next: (records: any) => {
        this.history = records;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Unable to load attendance history';
      }
    });
  }
}
