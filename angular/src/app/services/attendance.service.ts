import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class AttendanceService {
  constructor(private api: ApiService) {}

  checkIn(latitude: number, longitude: number, timezone: string) {
    return this.api.post('/attendance/checkin', { latitude, longitude, timezone }, true);
  }

  checkOut(latitude: number, longitude: number, timezone: string) {
    return this.api.post('/attendance/checkout', { latitude, longitude, timezone }, true);
  }

  myAttendance(timezone: string) {
    return this.api.get(`/attendance/my?timezone=${timezone}`, true);
  }

  allAttendance(page = 1, limit = 20) {
    return this.api.get(`/admin/attendance?page=${page}&limit=${limit}`, true);
  }
}
