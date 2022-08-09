import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserdashboardComponent } from './userdashboard/userdashboard.component';
import { UserprofileComponent } from './userprofile/userprofile.component';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material';


@NgModule({
  declarations: [UserdashboardComponent, UserprofileComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
    FormsModule,
    MatIconModule,
  ]
})
export class UserModule { }
