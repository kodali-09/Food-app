import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../data.service';
import { LoginService } from '../login.service';
import { RecipeOperationService } from '../recipe-operation.service';

@Component({
  selector: 'app-recipe-display',
  templateUrl: './recipe-display.component.html',
  styleUrls: ['./recipe-display.component.css']
})
export class RecipeDisplayComponent implements OnInit {

  public recipeDataEvent:any;
  public isDataLoaded:boolean=false;
  constructor(private ar:ActivatedRoute,private hc:HttpClient,private ds:DataService,private loginService:LoginService,
    private router:Router,private recipeOperationService:RecipeOperationService) { }
  public recipeId: string = "";
  public createdBy: string = "";
  public recipeObj:any={};
  public isLiked: boolean;
  public noOfLikes: number = 0;
  ngOnInit() {
    this.recipeDataEvent = this.ds.recipeData.subscribe(data => {
      if (data != null) {  
        this.recipeObj = data;
        this.recipeId = this.recipeObj["_id"];
        this.createdBy = this.recipeObj["createdById"];
        this.isDataLoaded=true;
        //console.log("recipeObj is ",this.recipeObj);
        //console.log("category is ",this.recipeObj['category']);   
      } 
    });
    this.totalLikes();
  }

  ngOnDestroy(): void {
    this.recipeDataEvent.unsubscribe();
  }

  private checkifUserAlreadyLiked() {
    let dataObj = {};
    dataObj['recipeid'] = this.recipeId;
    dataObj['userid'] = this.loginService.userid;
    dataObj['createdBy'] = this.createdBy;
    this.recipeOperationService.checkIfUserAlreadyLiked(dataObj).subscribe((res) => {
      if (res["message"] === "user already liked the recipe") {
        this.isLiked = true;
      } else {
        this.isLiked = false;
      }
    });
  }

  private totalLikes() {
    this.recipeOperationService.getTotalLikesToParticularRecipe(this.recipeId).subscribe((result) => {
      this.noOfLikes = result["count"];
      if (this.noOfLikes == 0) {
        this.isLiked = false;
      } else {
        this.isLiked = true;
      }
    });
  }

  toggleLike(event) {
    if (this.loginService.adminLoginStatus || this.loginService.userLoginStatus) {
      this.checkifUserAlreadyLiked();
      this.isLiked = !this.isLiked;
      if (this.isLiked) {
        this.likeRecipe();
      } else {
        this.dislikeRecipe();
      }
    } else {
      if (confirm("Please login to continue")) {
        this.router.navigate(['/login']);
      }
    }
  }

  likeRecipe() {
    let dataObj = {};
    dataObj['recipeid'] = this.recipeId;
    dataObj['userid'] = this.loginService.userid;
    dataObj['createdBy'] = this.createdBy;
    this.recipeOperationService.LikeRecipe(dataObj).subscribe((res) => {
      if (res["message"] === "updated like") {
        this.totalLikes();
      }
    })
  }

  dislikeRecipe() {
    let dataObj = {};
    dataObj['recipeid'] = this.recipeObj["_id"];
    dataObj['userid'] = this.loginService.userid;
    dataObj['createdBy'] = this.createdBy;
    this.recipeOperationService.removeLike(dataObj).subscribe((res) => {
      if (res["message"] === "deleted like") {
        // alert("u disliked the recipe");
        this.totalLikes();
        console.log("disliked");
      }
    })
  }

  gotoC(categoryname) {
    this.router.navigate([`/category-display/${categoryname}`]);
  }

}


