import { Component, ViewChild, HostListener, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { LoginService } from './login.service';
import { Router } from '@angular/router';
import {MatSidenav} from "@angular/material";
import { MediaMatcher } from '@angular/cdk/layout';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {
  // @ViewChild('sidenav',{static:false}) sidenav: MatSidenav;

  // @HostListener('window:resize', ['$event'])
  // onResize(event) {
  //     if (event.target.innerWidth < 500) {
  //         this.sidenav.close();
  //     }
  // }
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  constructor(public ls:LoginService,private router:Router,changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
  // title = 'food-app';
  // status:boolean=true;
  // changeStatus()
  // {
  //   this.status=!this.status;
  // }
  // isCollapsed = true;
  myRecipes() {
    this.router.navigate([`/myrecipes/${this.ls.username}`]);
  }

  myArticles() {
    this.router.navigate([`/myarticles/${this.ls.username}`]);
  }
}
