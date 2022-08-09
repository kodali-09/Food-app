import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../data.service';
import { LoginService } from '../login.service';
import { ArticleOperationService } from '../article-operation.service';

@Component({
  selector: 'app-article-display',
  templateUrl: './article-display.component.html',
  styleUrls: ['./article-display.component.css']
})
export class ArticleDisplayComponent implements OnInit, OnDestroy {

  constructor(private activatedRoute: ActivatedRoute, private dataService: DataService, private loginService: LoginService,
    private router: Router, private articleOperationService: ArticleOperationService) { }

  articleId: string = "";
  createdBy: string = "";
  public articleObj: any={};
  isDataLoaded: boolean = false;
  isLiked: boolean;
  noOfLikes: number = 0;
  private articleDataEvent: any;

  ngOnInit() {
    // this.activatedRoute.paramMap.subscribe(param => {
    //   this.articleId = param.get("id");
    // });
    this.articleDataEvent = this.dataService.articleData.subscribe(data => {
      if (data != null) {
        this.articleObj = data;
        this.articleId = this.articleObj["_id"];
        this.createdBy = this.articleObj["createdById"];
        this.isDataLoaded = true;
      }
    });
    this.totalLikes();
  }

  private checkifUserAlreadyLiked() {
    let dataObj = {};
    dataObj['articleid'] = this.articleId;
    dataObj['userid'] = this.loginService.userid;
    dataObj['createdBy'] = this.createdBy;
    this.articleOperationService.checkIfUserAlreadyLiked(dataObj).subscribe((res) => {
      if (res["message"] === "user already liked the article") {
        this.isLiked = true;
      } else {
        this.isLiked = false;
      }
    });
  }

  private totalLikes() {
    this.articleOperationService.getTotalLikesToParticularArticle(this.articleId).subscribe((result) => {
      this.noOfLikes = result["count"];
      if (this.noOfLikes == 0) {
        this.isLiked = false;
      } else {
        this.isLiked = true;
      }
    });
  }

  ngOnDestroy(): void {
    this.articleDataEvent.unsubscribe();
  }

  toggleLike(event) {
    if (this.loginService.adminLoginStatus || this.loginService.userLoginStatus) {
      this.checkifUserAlreadyLiked();
      this.isLiked = !this.isLiked;
      if (this.isLiked) {
        this.likeArticle();
      } else {
        this.dislikeArticle();
      }
    } else {
      if (confirm("Please login to continue")) {
        this.router.navigate(['/login']);
      }
    }
  }

  likeArticle() {
    let dataObj = {};
    dataObj['articleid'] = this.articleId;
    dataObj['userid'] = this.loginService.userid;
    dataObj['createdBy'] = this.createdBy;
    this.articleOperationService.LikeArticle(dataObj).subscribe((res) => {
      if (res["message"] === "updated like") {
        this.totalLikes();
      }
    })
  }

  dislikeArticle() {
    let dataObj = {};
    dataObj['articleid'] = this.articleObj["_id"];
    dataObj['userid'] = this.loginService.userid;
    dataObj['createdBy'] = this.createdBy;
    this.articleOperationService.removeLike(dataObj).subscribe((res) => {
      if (res["message"] === "deleted like") {
        // alert("u disliked the article");
        this.totalLikes();
        console.log("disliked");
      }
    })
  }

  gotoC(categoryname) {
    this.router.navigate([`/category-display/${categoryname}`]);
  }

}
