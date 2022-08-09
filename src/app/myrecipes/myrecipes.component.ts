import { Component, OnInit } from '@angular/core';
import { RecipeOperationService } from '../recipe-operation.service';
import { Router } from '@angular/router';
import { LoginService } from '../login.service';
import { DataService } from '../data.service';
import { RecentActionsService } from '../recent-actions.service';

@Component({
  selector: 'app-myrecipes',
  templateUrl: './myrecipes.component.html',
  styleUrls: ['./myrecipes.component.css']
})
export class MyrecipesComponent implements OnInit {

  constructor(private ra:RecentActionsService,private recipeOperationService: RecipeOperationService, private router: Router, private loginService: LoginService, private dataService: DataService) { }

  recipes:object;
  success:boolean=false;
  username:any;
  title:String;
  isloaded:boolean=false;
  ngOnInit() {
    this.getRecipes();
    this.username=this.loginService.username;
  }
  getRecipes() {
    this.recipeOperationService.getRecipeObjByUserName().subscribe((res)=>{
      this.recipes=res["recipeObj"];
      this.isloaded=true;
    });
  }
  gotoR(recipe,recipetitle)
  {
    //console.log(this.recipes[i]);
    this.router.navigate(['/recipe-display',recipetitle]);
    this.dataService.sendRecipe(recipe);
  }
  
  deleteRecipe(recipeobj,recipe_id) {
    if (confirm("Are you sure you want to delete the recipe?")) {
      this.recipeOperationService.removeRecipe(recipe_id).subscribe((result) => {
        if (result["message"] === "successfully deleted") {
          alert("successfully deleted the recipe");
          this.success=true;
          this.title=recipeobj.recipe;
        }
        if(this.success){
          let action={}
          action['createdById']=this.loginService.userid;
          action['createdBy']=this.username
          action['createdOn']=new Date()
          action['ActionDone']=`Recipe ${this.title} Deleted`  
          this.ra.addAction(action).subscribe((res)=>{
            console.log("added recent action",res)            
          })
          this.getRecipes();
          this.router.navigate([`myrecipes/${this.loginService.username}`]);
        }            
      });
    }
  }

}
