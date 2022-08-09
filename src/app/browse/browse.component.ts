import { Component, OnInit } from '@angular/core';
import { RecipeOperationService } from '../recipe-operation.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '../data.service';

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.css']
})
export class BrowseComponent implements OnInit {

  constructor(private ar:ActivatedRoute,private rs:RecipeOperationService,private router:Router,private ds:DataService) { }
  recipes:object;
  isloaded:boolean=false;
  searchTerm:string='';
  ngOnInit() {
    this.getRecipes();
  }
  getRecipes()
  {
    this.rs.getRecipe().subscribe((res)=>{      
      this.recipes=res.recipeObj;
      //console.log("Inside Browse data is ",this.recipes);
      this.isloaded=true;
    })
  }
  gotoR(recipe,recipetitle)
  {
    //console.log(this.recipes[i]);
    this.router.navigate(['/recipe-display',recipetitle]);
    this.ds.sendRecipe(recipe);
  }

}
