import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LoginService } from '../login.service';
import { RecipeOperationService } from '../recipe-operation.service';
import { DataService } from '../data.service';

@Component({
  selector: 'app-category-display',
  templateUrl: './category-display.component.html',
  styleUrls: ['./category-display.component.css']
})
export class CategoryDisplayComponent implements OnInit {

  constructor(private router: Router,private dataService: DataService,private ar:ActivatedRoute,private hc:HttpClient,private ls:LoginService,private recipeService:RecipeOperationService) { }

  model:any={
    isDataLoaded:false
  }
  category:string;
  recipes:any;
  ngOnInit() {
    this.ar.paramMap.subscribe(param=>{
      this.category=param.get("category");
      //console.log("category is ",this.category);
    })
    this.getAllRecipe();
  }
  getAllRecipe()
  {
    this.recipeService.getRequiredCategories(this.category).subscribe((res)=>{      
      this.recipes=res['recipeObj'];
      this.model.isDataLoaded=true;
      //console.log("Object received is ",this.recipes);
    })
  }
  gotoR(recipe,recipetitle)
  {
    //console.log(this.recipes[i]);
    this.router.navigate(['/recipe-display',recipetitle]);
    this.dataService.sendRecipe(recipe);
  }
}

