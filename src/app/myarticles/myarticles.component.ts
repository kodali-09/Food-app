import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service';
import { ArticleOperationService } from '../article-operation.service';
import { ArticleData } from '../data/article-data';
import { DomSanitizer } from '@angular/platform-browser';
import { DataService } from '../data.service';
import { Router } from '@angular/router';
import { RecentActionsService } from '../recent-actions.service';

@Component({
  selector: 'app-myarticles',
  templateUrl: './myarticles.component.html',
  styleUrls: ['./myarticles.component.css']
})
export class MyarticlesComponent implements OnInit {

  constructor(private sanitizer: DomSanitizer, private dataService: DataService, private router: Router, private loginService: LoginService,
    private articleOperationService: ArticleOperationService, private recentActionsService: RecentActionsService) { }

  model = {
    articleDataList: [],
    isDataLoaded: false,
    title: ''
  }
  private success: boolean = false;
  ngOnInit() {
    this.getArticles();
  }
  private getArticles() {
    const parent = this;
    parent.articleOperationService.getArticleDataListByUserName().then(data => {
      parent.model.articleDataList = data as ArticleData[];
      parent.model.isDataLoaded = true;
    });
  }

  articleDisplay(article, articletitle) {
    this.router.navigate(['./article-display', articletitle]);
    this.dataService.sendArticle(article);
  }

  deleteArticle(article_id,articletitle) {
    if (confirm("Are you sure you want to delete the article?")) {
      this.articleOperationService.removeAticle(article_id).subscribe((result) => {
        if (result["message"] === "successfully deleted") {
          alert("successfully deleted the article");
          this.model.title=articletitle;
          this.success = true;
        }
        if (this.success) {
          let action = {};
          action['createdById']=this.loginService.userid;
          action['createdBy'] = this.loginService.username;
          action['createdOn'] = new Date();
          action['ActionDone'] = "Article " + this.model.title + " deleted";
          this.recentActionsService.addAction(action).subscribe((res) => {
            console.log("added recent action", res)
          });
          this.getArticles();
          this.router.navigate([`myarticles/${this.loginService.username}`]);
        }

      });
    }
  }

}
