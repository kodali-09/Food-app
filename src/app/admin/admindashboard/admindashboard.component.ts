import { Component, OnInit, ViewChild } from '@angular/core';
import { LoginService } from 'src/app/login.service';
import { Router } from '@angular/router';
import { RecentActionsService } from 'src/app/recent-actions.service';
import { DataService } from 'src/app/data.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-admindashboard',
  templateUrl: './admindashboard.component.html',
  styleUrls: ['./admindashboard.component.css']
})
export class AdmindashboardComponent implements OnInit {
  username: String;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  constructor(public ls: LoginService, private router: Router, private dataService: DataService, private ra: RecentActionsService) { }
  userobj: object;
  actions: any;
  dataSource: any;
  load: boolean = false;
  columns: Array<any> = [

    { name: 'createdBy', label: 'Username' },
    { name: 'ActionDone', label: 'Action Performed' },
    { name: 'createdOn', label: 'Performed At' }
  ];

  ngOnInit() {
    this.username = this.ls.username;
    this.getAction();
    this.getDetails();
  }
  displayedColumns: string[] = ['createdBy', 'ActionDone', 'createdOn']
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  addRecipe() {
    this.router.navigate(['/recipe-operation'])
  }
  removeRecipe() {
    this.router.navigate(['/recipe-edit'])
  }

  getAction() {
    this.ra.getActions().subscribe((res) => {
      this.actions = res.recentObj
      //console.log("recent actions are",this.actions);
      this.dataSource = new MatTableDataSource(this.actions);
      this.dataSource.paginator = this.paginator;
    })
  }

  addArticle() {
    this.router.navigate(['/article-operation'])
  }

  addCategory() {
    this.router.navigate(['/category-operation'])
  }

  addAdmin() {
    this.router.navigate(['/admin/addadmin']);
  }

  removeArticles() {
    this.router.navigate(['/remove-articles']);
  }

  removeCategories() {
    this.router.navigate(['/remove-category']);
  }

  editProfile() {
    this.router.navigate(['/userprofile']);
    this.dataService.sendAdminData(this.userobj);
  }

  getDetails() {
    this.ls.readProfile().subscribe((res) => {
      this.userobj = res;
      // this.model.username=res["username"];
      // this.model.emailid=res["email"];
      // this.model.imageUrl=res["imageUrl"];
    });
  }

}
