import { Component, OnInit } from '@angular/core';
import { CategoryOperationService } from '../category-operation.service';
import { CategoryData } from '../data/category-data';
import { RecipeOperationService } from '../recipe-operation.service';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { ArticleOperationService } from '../article-operation.service';
import { ArticleData } from '../data/article-data';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';


declare var $: any;
declare var require: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [NgbCarouselConfig]
})
export class HomeComponent implements OnInit {

  constructor(private categoryOperationService: CategoryOperationService, private recipeOperationService: RecipeOperationService, private router: Router,
    private dataService: DataService, private articleOperationService: ArticleOperationService, private config: NgbCarouselConfig) {
    config.interval = 100000;
    config.showNavigationIndicators = false;
    config.keyboard = true;
   
    config.pauseOnHover = true;
    config.showNavigationArrows = true;
    config.wrap = true;
  }

  model: any = {
    isDataLoaded: false,
    categoryList: [],
    articleDataList: [],
    articleList: [],
    recipeList: [],
    categoryChunkList: []
  }
  recipes: object;
  numberofitems: number = 3;
  nums=[];
  searchTerm:string;
  ngOnInit() {
    this.getCategoryList();
    this.getRecipes();
    this.getArticles(); 
  }
  
  car()
  {
    let x=this.model.categoryList.length;
    for(let i=0;i<x;i+=1)
    {
      if(x-i<5)
      break;
      this.nums[i]=(i);
    }
    
//     console.log(this.nums);
  }
  
  getCategoryList() {
    this.categoryOperationService.getCategoryDataList().then(data => {
      this.model.categoryList = data as CategoryData[];
      this.model.isDataLoaded = true;
//       console.log("cat list is ",this.model.categoryList);
      this.car()
    });
  }
  getRecipes() {
    this.recipeOperationService.getRecipe().subscribe((res) => {
      this.recipes = res.recipeObj;
      this.numberofitems = Math.min(res.recipeObj.length, this.numberofitems);
      for (var i = 0; i < this.numberofitems; i++) {
        this.model.recipeList.push(this.recipes[i]);
      }
      this.model.isDataLoaded = true;
      //console.log("Inside Browse data is ",this.recipes);
    });
  }

  getArticles() {
    this.articleOperationService.getArticleDataList().then(data => {
      this.model.articleList = data as ArticleData[];
      this.numberofitems = Math.min(this.model.articleList.length, this.numberofitems);
      for (var i = 0; i < this.numberofitems; i++) {
        this.model.articleDataList.push(this.model.articleList[i]);
      }
      this.model.isDataLoaded = true;
    });
  }

  gotoR(recipe, recipetitle) {
    //console.log(this.recipes[i]);
    this.router.navigate(['/recipe-display', recipetitle]);
    this.dataService.sendRecipe(recipe);
  }

  articleDisplay(article, articletitle) {
    this.router.navigate(['./article-display', articletitle]);
    this.dataService.sendArticle(article);
  }
  gotoC(obj)
  {
    //console.log("cat obj is ",obj.name);
    this.router.navigate(['./category-display', obj.name]);
  }
}
