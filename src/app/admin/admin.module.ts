import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdmindashboardComponent } from './admindashboard/admindashboard.component';
import { AdminprofileComponent } from './adminprofile/adminprofile.component';
import { MatSidenavModule, MatInputModule, MatDatepickerModule, MatNativeDateModule, MatButtonModule, MatTableModule, MatFormFieldModule, MatPaginatorModule, MatIconModule, MatToolbarModule, MatCheckboxModule, MatSelectModule, MatSortModule } from '@angular/material';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [AdmindashboardComponent, AdminprofileComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    MatSidenavModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatTableModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatIconModule,  
    MatToolbarModule,
    MatCheckboxModule,
    MatSelectModule,
    MatSortModule,
    MatFormFieldModule,
  ],
  exports:[
    AdmindashboardComponent, AdminprofileComponent
  ]
})
export class AdminModule { }
