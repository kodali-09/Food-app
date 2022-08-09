import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/login.service';
import { Router } from '@angular/router';
import { ArticleOperationService } from 'src/app/article-operation.service';
import { RecipeOperationService } from 'src/app/recipe-operation.service';
import { DataService } from 'src/app/data.service';

@Component({
  selector: 'app-userdashboard',
  templateUrl: './userdashboard.component.html',
  styleUrls: ['./userdashboard.component.css']
})
export class UserdashboardComponent implements OnInit {
  username:String;
  constructor(private ls:LoginService,private router:Router,private articleOperationService:ArticleOperationService,
    private recipeOperationService:RecipeOperationService,private dataService:DataService) { }

  ngOnInit() {
    this.username=this.ls.username;
    this.totalArticles();
    this.totalRecipes();
    this.getDetails();
    this.totalLikesForArticles();
    this.totalLikesForRecipes();
  }

  model:any={
    noOfArticles:0,
    noOfRecipes:0,
    username:'',
    emailid:'',
    imageUrl:"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSNq-Mk-bEDdB90ZkoVmH-zFf-RoLenjYfUHps5qzp3d25Dt1TJ&usqp=CAU",
    noOfLikesForArticles:0,
    noOfLikesForRecipes:0
  }

  userobj:object;

  totalArticles() {
    this.articleOperationService.getTotalArticles().subscribe((res)=>{
      this.model.noOfArticles=res["count"];
    })
  }
  totalRecipes() {
    this.recipeOperationService.getTotalRecipes().subscribe((res)=>{
      this.model.noOfRecipes=res["count"];
    })
  }

  addArticles() {
    this.router.navigate(['/article-operation'])
  }

  addRecipes() {
    this.router.navigate(['/recipe-operation'])
  }

  myRecipes() {
    this.router.navigate([`/myrecipes/${this.ls.username}`]);
  }

  myArticles() {
    this.router.navigate([`/myarticles/${this.ls.username}`]);
  }

  removeSelectedArticles() {
    this.router.navigate(['/remove-articles']);
  }
  
  removeSelectedRecipes() {
    this.router.navigate(['/recipe-edit']);
  }

  editDetails() {
    this.router.navigate(['/userprofile']);
    this.dataService.sendUserData(this.userobj);
  }

  getDetails() {
    this.ls.readProfile().subscribe((res)=>{
      this.userobj=res;
      this.model.username=res["username"];
      this.model.emailid=res["email"];
      this.model.imageUrl=res["imageUrl"];
    });
  }

  totalLikesForArticles() {
    this.articleOperationService.getTotalLikesToUserForArticle().subscribe((res)=>{
      this.model.noOfLikesForArticles=res["count"];
    })
  }

  totalLikesForRecipes() {
    this.recipeOperationService.getTotalLikesToUserForRecipe().subscribe((res)=>{
      this.model.noOfLikesForRecipes=res["count"];
    })
  }

}
