import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { LoginService } from '../login.service';
import { ArticleOperationService } from '../article-operation.service';
import { Router } from '@angular/router';
import { CategoryOperationService } from '../category-operation.service';
import { CategoryData } from '../data/category-data';
import { RecentActionsService } from '../recent-actions.service';
import { FileUploadService } from '../file-upload.service';

@Component({
  selector: 'app-article-operation',
  templateUrl: './article-operation.component.html',
  styleUrls: ['./article-operation.component.css']
})
export class ArticleOperationComponent implements OnInit {

  constructor(private articleOperationService: ArticleOperationService, private ls: LoginService, private router: Router
    , private categoryOperationService: CategoryOperationService, private recentActionsService: RecentActionsService
    , private fileUploadService: FileUploadService) { }
    @ViewChild('fileUploader',{static: false}) 
    fileUploader:ElementRef;
  placeholder = "enter details..";
  model = {
    content: '',
    title: '',
    author: '',
    description: '',
    articleContent: new FormControl(),
    categoryList: [],
    categoryNameList: [],
    selectedItems: [],
    dropdownSettings: {},
    isDataLoaded: false,
    isImageUploaded: false,
    message: "upload a photo"
  };
   imgFile: File = undefined;
   success:boolean=false;
   filetype = ['image/jpeg', 'image/png', 'image/jpg'];
  public imageObj: {
    imageUrl: string | ArrayBuffer ,
    publicId: ''
  } = { imageUrl: "", publicId: "" };

  ngOnInit() {
    this.categoryOperationService.getCategoryDataList().then(data => {
      const categoryList = data as CategoryData[];
      this.model.categoryList = this.isListHasValue(categoryList) ? categoryList : [];
      for (let i = 0; i < this.model.categoryList.length; i++) {
        this.model.categoryNameList.push(this.model.categoryList[i].name);
      }
      this.model.isDataLoaded = true;
    });
    // this.model.categoryNameList = ["chicken", "summer", "winter", "american", "desserts", "dinner"]
    this.model.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 5,
      enableCheckAll: false,
      allowSearchFilter: true
    };
  }

  getImageFile(imageInfo: File) {
    this.imgFile = imageInfo;
    if (this.imgFile !== undefined && this.filetype.includes(this.imgFile.type)) {
      if (this.imgFile !== undefined) {
        let reader = new FileReader();//to read file content
        reader.readAsDataURL(this.imgFile);//read data of file(image);we need to wait until data is read
        reader.onload = () => {
          this.imageObj.imageUrl = reader.result;//contains blob data
          this.model.isImageUploaded = true;
        }
      }
    } else {
      this.model.message = "upload a valid photo of type jpg or jpeg or png";
      this.model.isImageUploaded = false;
      this.fileUploader.nativeElement.value = null;
    }
  }

  postArticle() {
    if (this.isFormPopulated()) {
      const parent = this;
      parent.getImageUrlForFile().then(data => {
        const request = {
          'title': parent.model.title,
          'category': parent.model.selectedItems,
          'description': parent.model.description,
          'imageUrl': parent.imageObj.imageUrl,
          'imageId': parent.imageObj.publicId,
          'content': parent.model.content,
          'author': parent.model.author,
          'createdBy': parent.ls.username,
          'createdById':parent.ls.userid,
          'createdOn': new Date()
        };
        this.articleOperationService.addArticle(request).subscribe(res => {
          if (res["message"] === "sucessfully added") {
            // console.log(res["message"]);
            alert("sucessfully added an article");
            this.success = true;
            if (this.success) {
              let action = {};
              action['createdById'] =this.ls.userid;
              action['createdBy'] = this.ls.username;
              action['createdOn'] = new Date();
              action['ActionDone'] = "Article "+this.model.title +" Added";
              this.recentActionsService.addAction(action).subscribe((res) => {
                console.log("added recent action", res)
              });
            }
            if (this.ls.role === "admin") {
              this.router.navigate(['/admindashboard']);
            } else {
              this.router.navigate(['/userdashboard']);
            }
          }
        });
      });
    }
  }

  cancel() {
    if (this.ls.role === "admin") {
      this.router.navigate(['/admindashboard']);
    } else {
      this.router.navigate(['/userdashboard']);
    }
  }

  isFormPopulated() {
    return this.model.title.length && this.model.selectedItems.length && this.model.author.length && this.model.description.length
      && this.model.content.length && this.model.isImageUploaded;
  }
  private getImageUrlForFile() {
    const parent = this;
    return new Promise(function (fulfilled, rejected) {
      const files: File[] = [];
      files.push(parent.imgFile);
      parent.fileUploadService.getImageUrlForFile(files).then(response => {
        if (parent.isListHasValue(response["data"])) {
          const imageObjs = response["data"];
          imageObjs.forEach(image => {
            if (image) {
              parent.imageObj.imageUrl = image.url;
              parent.imageObj.publicId = image.id;
            }
          });
          fulfilled();
        } else {
          rejected();
        }
      });
    });
  }

  private isListHasValue(list) {
    return list !== null && list !== undefined && list.length > 0;
  }
}
