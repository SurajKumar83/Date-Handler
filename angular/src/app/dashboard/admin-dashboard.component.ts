import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AttendanceService } from '../services/attendance.service';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html'
})
export class AdminDashboardComponent implements OnInit {
  records: any[] = [];
  message = '';

  officeForm = this.fb.group({
    officeLatitude: [0, Validators.required],
    officeLongitude: [0, Validators.required],
    allowedRadiusMeters: [300, Validators.required]
  });

  constructor(private fb: FormBuilder, private attendance: AttendanceService, private api: ApiService) {}

  ngOnInit(): void {
    this.loadAttendance();
  }

  loadAttendance() {
    this.attendance.allAttendance().subscribe((res: any) => {
      this.records = res.records;
    });
  }

  saveOfficeConfig() {
    this.api.put('/admin/office', this.officeForm.value, true).subscribe((res: any) => {
      this.message = res.message;
    });
  }
}
