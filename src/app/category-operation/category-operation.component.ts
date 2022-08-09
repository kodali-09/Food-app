import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CategoryOperationService } from '../category-operation.service';
import { CategoryData } from '../data/category-data';
import { FileUploadService } from '../file-upload.service';
import { Router } from '@angular/router';
import { LoginService } from '../login.service';
import { RecentActionsService } from '../recent-actions.service';

@Component({
  selector: 'app-category-operation',
  templateUrl: './category-operation.component.html',
  styleUrls: ['./category-operation.component.css']
})
export class CategoryOperationComponent implements OnInit {

  constructor(private categoryOperationService: CategoryOperationService, private fileUploadService: FileUploadService,
    private router: Router, private loginService: LoginService, private recentActionsService: RecentActionsService) { }
  @ViewChild('fileUploader', { static: false })
  fileUploader: ElementRef;
  model: any = {
    categoryName: '',
    categoryList: [],
    categoryNameList: [],
    isCategoryExists: false,
    base64textString: "",
    isImageUploaded: false,
    message: "upload a photo"
  }

  ngOnInit() {
    const parent = this;
    parent.categoryOperationService.getCategoryDataList().then(data => {
      const categoryList = data as CategoryData[];
      parent.model.categoryList = parent.isListHasValue(categoryList) ? categoryList : [];
      for (let i = 0; i < parent.model.categoryList.length; i++) {
        parent.model.categoryNameList.push(parent.model.categoryList[i].name);
      }
    });
  }

  private imgFile: File = undefined;
  private filetype = ['image/jpeg', 'image/png', 'image/jpg'];
  private imageObj: {
    imageUrl: '',
    publicId: ''
  } = { imageUrl: "", publicId: "" };


  handleFileSelect(evt) {
    const parent = this;
    this.imgFile = <File>evt.target.files[0];

    if (this.imgFile !== undefined && this.filetype.includes(this.imgFile.type)) {
      if (this.imgFile !== undefined) {
        var reader = new FileReader();
        reader.readAsDataURL(this.imgFile);
        reader.onload = (event => {
          parent._handleReaderLoaded(reader.result);
        });
      }
    } else {
      this.model.isImageUploaded = false;
      this.imgFile = undefined;
      evt.target.files = undefined;
      this.model.base64textString = "";
      this.fileUploader.nativeElement.value = null;
      this.model.message = "upload a valid photo of type jpg or jpeg or png";

    }
  }

  private _handleReaderLoaded(resultStr) {
    this.model.base64textString = resultStr;
    if (this.model.base64textString.length !== 0) {
      this.model.isImageUploaded = true;
    }
  }

  validateCategoryList() {
    const parent = this;
    const tempCategoryName = parent.model.categoryName.toLowerCase();
    if (!(parent.isListHasValue(parent.model.categoryList)) || !(parent.model.categoryNameList.includes(tempCategoryName))) {
      parent.model.isCategoryExists = false;
    } else {
      parent.model.isCategoryExists = true;
    }

  }

  isValidDetails() {
    return !this.model.isCategoryExists && this.model.categoryName.length > 0 && this.model.isImageUploaded;
  }

  addCategory() {
    if (this.isValidDetails()) {
      const parent = this;
      parent.getImageUrlForFile().then(data => {
        const request = {
          _id: {
            id: {},
            name: parent.model.categoryName.toLowerCase()
          },
          name: parent.model.categoryName.toLowerCase(),
          imageUrl: parent.imageObj.imageUrl,
          imageId: parent.imageObj.publicId,
          createdBy: parent.loginService.username,
          createdById: parent.loginService.userid,
          createdOn: new Date()
        };
        parent.categoryOperationService.addCategory(request).subscribe(res => {
          if (res["message"] === "sucessfully added") {
            // console.log(res["message"]);
            let action = {};
            action['createdById'] = this.loginService.userid;
            action['createdBy'] = this.loginService.username;
            action['createdOn'] = new Date();
            action['ActionDone'] = "category " + this.model.categoryName + " Added";
            this.recentActionsService.addAction(action).subscribe((res) => {
              console.log("added recent action", res)
            });
            alert("sucessfully added the category");
            this.router.navigate(['/admindashboard']);
          }
        });
      });
    }
  }

  cancel() {
    this.router.navigate(['/admindashboard']);
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

