import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { RecipeOperationService } from '../recipe-operation.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { LoginService } from '../login.service';
import { Router } from '@angular/router';
import { RecentActionsService } from '../recent-actions.service';
@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  constructor(private ra: RecentActionsService, private loginService: LoginService, private recipeOperationService: RecipeOperationService,
    private fb: FormBuilder, private router: Router, private rs: RecipeOperationService) { }
  recipes: any;
  success: boolean = false;
  title: string;
  username: any;
  isDataPresent:boolean=false;
  ngOnInit(): void {
    if (this.loginService.role == "admin") {
      this.getRecipes();
    }
    else {
      this.getRecipesByUsername();
    }
    this.username = this.loginService.username;
  }
  dataSource: any;
  load: boolean = false;
  columns: Array<any> = [

    { name: 'profileImage', label: 'Recipe Image' },
    { name: 'recipe', label: 'Recipe Name' },
    { name: 'author', label: 'Author' },
    { name: 'time', label: 'Time Required' },
    { name: 'category', label: 'Category' },
    { name: 'brief', label: 'Brief' },
    //{ name: 'ingrlist', label: 'Ingredients' },
    //{ name: 'instrlist', label: 'Instructions' },
  ];

  getRecipes() {
    this.rs.getRecipe().subscribe((res) => {
      this.recipes = res.recipeObj;
      //console.log(this.recipes);
      this.load = true;
      if(this.recipes.length>0) {
        this.isDataPresent=true;
      }
      this.dataSource = new MatTableDataSource(this.recipes);
      this.dataSource.paginator = this.paginator;
    })
  }
  getRecipesByUsername() {
    this.rs.getRecipeObjByUserName().subscribe((res) => {
      this.recipes = res["recipeObj"];
      this.load = true;
      if(this.recipes.length>0) {
        this.isDataPresent=true;
      }
      this.dataSource = new MatTableDataSource(this.recipes);
      this.dataSource.paginator = this.paginator;
    })
  }

  displayedColumns: string[] = ['select', 'profileImage', 'recipe', 'author', 'time', 'category', 'brief']
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
    for (let i = 0; i < this.selection.selected.length; i++) { send.push(this.selection.selected[i]['_id']); }

    console.log(send);
    if (confirm("Are you sure you want to delete the Recipes?")) {
      this.recipeOperationService.deleteRecipes(send).subscribe((res) => {
        if (res['message'] == "successfully deleted") {
          this.success = true;
          //console.log("data sent is ",res); 
          if (this.loginService.role == "admin") {
            this.getRecipes();
          }
          else {
            this.getRecipesByUsername();
          }
        }
        if (this.success) {
          let action = {}
          action['createdById']=this.loginService.userid
          action['createdBy'] = this.username
          action['createdOn'] = new Date();
          action['ActionDone'] = `${this.selection.selected.length} Recipes Deleted`
          this.ra.addAction(action).subscribe((res) => {
            console.log("added recent action", res)
          })
          this.router.navigate(['recipe-edit']);
        }

      })
    }
  }

  cancel() {
    if (this.loginService.role === "admin") {
      this.router.navigate(['/admindashboard']);
    } else {
      this.router.navigate(['/userdashboard']);
    }
  }

}
