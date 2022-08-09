import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CategoryOperationService } from '../category-operation.service';
import { LoginService } from '../login.service';
import { Router } from '@angular/router';
import { RecentActionsService } from '../recent-actions.service';
import { CategoryData } from '../data/category-data';
import { SelectionModel } from '@angular/cdk/collections';
@Component({
  selector: 'app-remove-category',
  templateUrl: './remove-category.component.html',
  styleUrls: ['./remove-category.component.css']
})
export class RemoveCategoryComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  constructor(private loginService: LoginService, private categoryOperationService: CategoryOperationService, private recentActionsService: RecentActionsService,
    private router: Router) { }
    model: any = {
      categoryDataList: [],
      isDataLoaded: false,
      success: false,
      isDataPresent:false
    }
    dataSource:any;
    displayedColumns: string[] = ['select', 'imageUrl', 'name', 'createdOn', 'createBy'];
    columns: Array<any> = [
    { name: 'imageUrl', label: 'Category Image' },
    { name: 'name', label: 'name' },
    { name: 'createdOn', label: 'Created On' },
    { name: 'createBy', label: 'Created By' },
  ];
  ngOnInit() {
    if (this.loginService.role === "admin") {
      this.getCategory();
    } else {
      this.getCategoryByUsername();
    }
  }
  getCategory() {
    this.categoryOperationService.getCategoryDataList().then(data => {
      this.model.categoryDataList = data as CategoryData[];
      this.dataSource=this.dataSource=new MatTableDataSource(this.model.categoryDataList);
      this.model.isDataLoaded = true;
      if(this.model.categoryDataList.length>0) {
        this.model.isDataPresent=true;
      }
      this.dataSource.paginator = this.paginator;
    })
  }

  getCategoryByUsername() {
    this.categoryOperationService.getCategoryDataListByUserName().then(data => {
      this.model.categoryDataList = data as CategoryData[];
      this.dataSource=new MatTableDataSource(this.model.articleDataList);
      this.model.isDataLoaded = true;
      if(this.model.categoryDataList.length>0) {
        this.model.isDataPresent=true;
      }
      this.dataSource.paginator = this.paginator;
    })
  }

  cancel() {
    if (this.loginService.role === "admin") {
      this.router.navigate(['/admindashboard']);
    } else {
      this.router.navigate(['/userdashboard']);
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  selection = new SelectionModel<any>(true, []);
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;

  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));

  }

  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row`;
  }

  get() {
    let send: Array<any> = [];
    for (let i = 0; i < this.selection.selected.length; i++) {
      send.push(this.selection.selected[i]['_id']);
    }
    if (confirm("Are you sure you want to delete the Categories?")) {
      this.categoryOperationService.removeSelectedCategories(send).subscribe((res) => {
        if (res["message"] === "successfully deleted") {
          this.model.success = true;
          if (this.loginService.role === "admin") {
            this.getCategory();
          } else {
            this.getCategoryByUsername();
          }
        }
        if (this.model.success) {
          let action = {}
          action['createdById'] = this.loginService.userid;
          action['createdBy'] = this.loginService.username;
          action['createdOn'] = new Date();
          action['ActionDone'] = `${this.selection.selected.length} Categories Deleted`;
          this.recentActionsService.addAction(action).subscribe((res) => {
            console.log("added recent action", res)
          });
          this.router.navigate(['/remove-category']);
        }
      })
    }
  }

}
