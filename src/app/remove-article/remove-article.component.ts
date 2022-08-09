import { Component, OnInit, ViewChild } from '@angular/core';
import { LoginService } from '../login.service';
import { ArticleOperationService } from '../article-operation.service';
import { ArticleData } from '../data/article-data';
import { SelectionModel } from '@angular/cdk/collections';
import { RecentActionsService } from '../recent-actions.service';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-remove-article',
  templateUrl: './remove-article.component.html',
  styleUrls: ['./remove-article.component.css'],

})
export class RemoveArticleComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  constructor(private loginService: LoginService, private articleOperationService: ArticleOperationService, private recentActionsService: RecentActionsService,
    private router: Router) { }

  model: any = {
    articleDataList: [],
    isDataLoaded: false,
    success: false,
    isDataPresent:false
  }
  dataSource: any;
  displayedColumns: string[] = ['select', 'imageUrl', 'title', 'category', 'author', 'createdOn', 'createdBy'];
  columns: Array<any> = [
    { name: 'imageUrl', label: 'Article Image' },
    { name: 'title', label: 'Title' },
    { name: 'category', label: 'Category' },
    { name: 'author', label: 'Author' },
    { name: 'createdOn', label: 'Created On' },
    { name: 'createdBy', label: 'Created By' },
  ];
  ngOnInit() {
    if (this.loginService.role === "admin") {
      this.getArticles();
    } else {
      this.getArticlesByUsername();
    }
  }

  getArticles() {
    this.articleOperationService.getArticleDataList().then(data => {
      this.model.articleDataList = data as ArticleData[];
      this.dataSource=this.dataSource=new MatTableDataSource(this.model.articleDataList);
      this.model.isDataLoaded = true;
      if(this.model.articleDataList.length>0) {
        this.model.isDataPresent=true;
      }
      this.dataSource.paginator = this.paginator;
    })
  }

  getArticlesByUsername() {
    this.articleOperationService.getArticleDataListByUserName().then(data => {
      this.model.articleDataList = data as ArticleData[];
      this.dataSource=new MatTableDataSource(this.model.articleDataList);
      this.model.isDataLoaded = true;
      if(this.model.articleDataList.length>0) {
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
    if (confirm("Are you sure you want to delete the Recipes?")) {
      this.articleOperationService.removeSelectedArticles(send).subscribe((res) => {
        if (res["message"] === "successfully deleted") {
          this.model.success = true;
          if (this.loginService.role === "admin") {
            this.getArticles();
          } else {
            this.getArticlesByUsername();
          }
        }
        if (this.model.success) {
          let action = {}
          action['createdById']=this.loginService.userid;
          action['createdBy'] = this.loginService.username;
          action['createdOn'] = new Date();
          action['ActionDone'] = `${this.selection.selected.length} Articles Deleted`;
          this.recentActionsService.addAction(action).subscribe((res) => {
            console.log("added recent action", res)
          });
          this.router.navigate(['/remove-articles']);
        }
      })
    }
  }



}
