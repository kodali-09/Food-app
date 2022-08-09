import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ArticlesComponent } from './articles/articles.component';
import { BrowseComponent } from './browse/browse.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AdmindashboardComponent } from './admin/admindashboard/admindashboard.component';
import { UserdashboardComponent } from './user/userdashboard/userdashboard.component';
import { RegisterComponent } from './register/register.component';
import { ArticleOperationComponent } from './article-operation/article-operation.component';
import { CategoryOperationComponent } from './category-operation/category-operation.component';
import { RecipeOperationComponent } from './recipe-operation/recipe-operation.component';
import { SecurerouteGuard } from './secureroute.guard';
import { ArticleDisplayComponent } from './article-display/article-display.component';
import { RecipeDisplayComponent } from './recipe-display/recipe-display.component';
import { RecipeEditComponent } from './recipe-edit/recipe-edit.component';
import { AdminprofileComponent } from './admin/adminprofile/adminprofile.component';
import { MyarticlesComponent } from './myarticles/myarticles.component';
import { MyrecipesComponent } from './myrecipes/myrecipes.component';
import { RemoveArticleComponent } from './remove-article/remove-article.component';
import { RemoveCategoryComponent } from './remove-category/remove-category.component';
import { CategoryDisplayComponent } from './category-display/category-display.component';
import { UserprofileComponent } from './user/userprofile/userprofile.component';

const routes: Routes = [{path:'',component:HomeComponent},
{path:'browse', component:BrowseComponent},
{path:'home',component:HomeComponent},
{path:'login',component:LoginComponent},
{path:'admindashboard',component:AdmindashboardComponent,canActivate:[SecurerouteGuard]},
{path:'admin/addadmin',component:AdminprofileComponent,canActivate:[SecurerouteGuard]},
{path:'userdashboard',component:UserdashboardComponent,canActivate:[SecurerouteGuard]},
{path:'userprofile',component:UserprofileComponent,canActivate:[SecurerouteGuard]},
{path:'register',component:RegisterComponent},
{path:'article-operation',component:ArticleOperationComponent,canActivate:[SecurerouteGuard]},
{path:'article-display/:articletitle',component:ArticleDisplayComponent},
{path:'category-operation',component:CategoryOperationComponent},
{path:'recipe-operation',component:RecipeOperationComponent,canActivate:[SecurerouteGuard]},
{path:'recipe-display/:recipetitle',component:RecipeDisplayComponent},
{path:'recipe-edit',component:RecipeEditComponent,canActivate:[SecurerouteGuard]},
{path:'articles',component:ArticlesComponent},
{path:'myarticles/:username',component:MyarticlesComponent,canActivate:[SecurerouteGuard]},
{path:'myrecipes/:username',component:MyrecipesComponent,canActivate:[SecurerouteGuard]},
{path:'remove-articles',component:RemoveArticleComponent,canActivate:[SecurerouteGuard]},
{path:'remove-category' ,component:RemoveCategoryComponent,canActivate:[SecurerouteGuard]},
{path:'category-display/:category',component:CategoryDisplayComponent}];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
