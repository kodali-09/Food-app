import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ArticlesComponent } from './articles/articles.component';
import { QuillModule } from 'ngx-quill';
import { BrowseComponent } from './browse/browse.component';
import { LoginComponent } from './login/login.component';
import { AdmindashboardComponent } from './admin/admindashboard/admindashboard.component';
import { UserdashboardComponent } from './user/userdashboard/userdashboard.component';
import { RegisterComponent } from './register/register.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ArticleOperationComponent } from './article-operation/article-operation.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgbModule, NgbCarousel, NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { CategoryOperationComponent } from './category-operation/category-operation.component';
import { RecipeOperationComponent } from './recipe-operation/recipe-operation.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ArticleDisplayComponent } from './article-display/article-display.component';
import { RecipeDisplayComponent } from './recipe-display/recipe-display.component';
import { RecipeEditComponent } from './recipe-edit/recipe-edit.component';
import { AdminprofileComponent } from './admin/adminprofile/adminprofile.component';
import { MyarticlesComponent } from './myarticles/myarticles.component';
import { MyrecipesComponent } from './myrecipes/myrecipes.component';
import { AuthorizationService } from './authorization.service';
import { MatCarouselModule, MatCarouselSlideComponent } from '@ngmodule/material-carousel';
import {MatPaginatorModule} from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { RemoveArticleComponent } from './remove-article/remove-article.component';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import{ MatCheckboxModule, MatCardModule, MatToolbarModule, MatSidenavModule} from '@angular/material';
import { RemoveCategoryComponent } from './remove-category/remove-category.component';
import { CategoryDisplayComponent } from './category-display/category-display.component';
import { UserprofileComponent } from './user/userprofile/userprofile.component';
import { RecipefilterPipe } from './recipe-filter.pipe';
import { AdminModule } from './admin/admin.module';
import { UserModule } from './user/user.module';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ArticlesComponent,
    BrowseComponent,
    LoginComponent,
    // AdmindashboardComponent,
    // UserdashboardComponent,
    RegisterComponent,
    ArticleOperationComponent,
    CategoryOperationComponent,
    RecipeOperationComponent,
    ArticleDisplayComponent,
    RecipeDisplayComponent,
    RecipeEditComponent,
    // AdminprofileComponent,
    MyarticlesComponent,
    MyrecipesComponent,
    RemoveArticleComponent,
    RemoveCategoryComponent,
    CategoryDisplayComponent,
    // UserprofileComponent,
    RecipefilterPipe
  ],
  imports: [
    AdminModule,
    UserModule,
    MatSidenavModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatTableModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatIconModule,  
    MatToolbarModule,
    MatCheckboxModule,
    MatSelectModule,
    MatSortModule,
    MatFormFieldModule,
    MatCardModule,
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatCarouselModule.forRoot(),    
    NgMultiSelectDropDownModule.forRoot(),
    NgbModule,
    QuillModule.forRoot({
      modules: {
        syntax: false,
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
          ['blockquote', 'code-block'],

          [{ 'header': 1 }, { 'header': 2 }],               // custom button values
          [{ 'list': 'ordered' }, { 'list': 'bullet' }],
          [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
          [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
          [{ 'direction': 'rtl' }],                         // text direction

          [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

          [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
          [{ 'font': [] }],
          [{ 'align': [] }],

          ['clean'],                                         // remove formatting button

          ['link', 'image', 'video']                         // link and image, video
        ]
      }
    })
  ],
  providers: [NgbCarousel, NgbCarouselConfig,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthorizationService,
      multi: true
    }],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }
