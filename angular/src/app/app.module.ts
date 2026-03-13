import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';

import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login.component';
import { EmployeeDashboardComponent } from './attendance/employee-dashboard.component';
import { AdminDashboardComponent } from './dashboard/admin-dashboard.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [AppComponent, LoginComponent, EmployeeDashboardComponent, AdminDashboardComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
