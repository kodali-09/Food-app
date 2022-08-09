import { Component, OnInit, Inject, ElementRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ViewChild } from '@angular/core';
import { CategoryData } from '../data/category-data';
import { FormBuilder, FormArray, Validators } from '@angular/forms';
// import { MatDialog, MatTable } from '@angular/material';
import { Router } from '@angular/router';
import { LoginService } from '../login.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegisterService } from '../register.service';
import { RecipeOperationService } from '../recipe-operation.service';
import { RecentActionsService } from '../recent-actions.service';
import { CategoryOperationService } from '../category-operation.service';

//var alertify = require('alertifyjs');
@Component({
  selector: 'app-recipe-operation',
  templateUrl: './recipe-operation.component.html',
  styleUrls: ['./recipe-operation.component.css']
})
export class RecipeOperationComponent implements OnInit {
  constructor(private router: Router, private ls: LoginService, private hc: HttpClient, private rs: RecipeOperationService,
    private ra: RecentActionsService, private fb: FormBuilder, private categoryOperationService: CategoryOperationService) { }
  @ViewChild('fileUploader', { static: false })
  fileUploader: ElementRef;
  //model declaration
  model = {
    recipe: '',
    brief: '',
    author: '',
    time: '',
    name: '',
    notes: '',
    value: '',
    categoryList: [],
    categoryNameList: [],
    touchedRows: [],
    touchedRows1: []

  };
  //variables declaration

  userTable: FormGroup;
  userTable1: FormGroup;
  control: FormArray;
  control1: FormArray;
  file: File;
  success: boolean = false;
  categoryList1: string[];
  category = new FormControl();
  imgUrl: string | ArrayBuffer = "";
  username: String;

  ngOnInit() {
    this.username = this.ls.username;
    this.model.touchedRows = [];
    this.userTable = this.fb.group({
      tableRows: this.fb.array([])
    });
    this.addRow();
    this.model.touchedRows1 = [];
    this.userTable1 = this.fb.group({
      tableRows1: this.fb.array([])
    });
    this.addRow1();

    this.categoryOperationService.getCategoryDataList().then(data => {
      const categoryList = data as CategoryData[];
      this.model.categoryList = this.isListHasValue(categoryList) ? categoryList : [];
      for (let i = 0; i < this.model.categoryList.length; i++) {
        this.model.categoryNameList.push(this.model.categoryList[i].name);
      }
    });

    this.categoryList1 = this.model.categoryNameList;

  }
  ngAfterOnInit() {
    this.control = this.userTable.get('tableRows') as FormArray;
    this.control1 = this.userTable1.get('tableRows1') as FormArray;
  }
  private filetype = ['image/jpeg', 'image/png', 'image/jpg'];
  //to get image
  getImageFile(imageInfo: File) {
    this.file = imageInfo;
    if (this.file !== undefined && this.filetype.includes(this.file.type)) {
      //create FileReader object to read file content
      let reader = new FileReader();

      //read data of file(image)
      //readAsdatafile is asynchronous operation 
      //we need to wait until the data is read
      reader.readAsDataURL(this.file);

      reader.onload = () => {
        this.imgUrl = reader.result;
        //this gives blob data
      }
      //console.log("image url",this.imgUrl);
    }
    else {
      this.fileUploader.nativeElement.value = null;
      alert("upload a valid photo of type jpg or jpeg or png");
    }


  }
  initiateForm(): FormGroup {
    return this.fb.group({
      name: [''],
      value: [''],
      units: [''],
      notes: [''],
      isEditable: [true]
    });
  }
  initiateForm1(): FormGroup {
    return this.fb.group({
      instr: [''],
      isEditable: [true]
    });
  }
  addRow() {
    const control = this.userTable.get('tableRows') as FormArray;
    control.push(this.initiateForm());
  }

  deleteRow(index: number) {
    const control = this.userTable.get('tableRows') as FormArray;
    control.removeAt(index);
  }

  editRow(group: FormGroup) {
    group.get('isEditable').setValue(true);
  }

  doneRow(group: FormGroup) {
    if (group.value.name.length < 1 || group.value.value.length < 1)
      alert('Name and Value cannot should be given');
    else
      group.get('isEditable').setValue(false);
  }

  saveUserDetails() {
    console.log(this.userTable.value);
  }
  get getFormControls() {
    const control = this.userTable.get('tableRows') as FormArray;
    return control;
  }

  submitForm() {
    const control = this.userTable.get('tableRows') as FormArray;
    this.model.touchedRows = control.controls.filter(row => row.touched).map(row => row.value);
    console.log(this.model.touchedRows);
  }


  addRow1() {
    const control1 = this.userTable1.get('tableRows1') as FormArray;
    control1.push(this.initiateForm1());
  }

  deleteRow1(index: number) {
    const control1 = this.userTable1.get('tableRows1') as FormArray;
    control1.removeAt(index);
  }

  editRow1(group: FormGroup) {
    group.get('isEditable').setValue(true);
  }

  doneRow1(group: FormGroup) {
    group.get('isEditable').setValue(false);
  }

  saveUserDetails1() {
    console.log(this.userTable1.value);
  }

  get getFormControls1() {
    const control1 = this.userTable1.get('tableRows1') as FormArray;
    return control1;
  }

  submitForm1() {
    const control1 = this.userTable1.get('tableRows1') as FormArray;
    this.model.touchedRows1 = control1.controls.filter(row => row.touched).map(row => row.value);
    console.log("control is ", this.control1);
    console.log(this.model.touchedRows1);
  }

  //to submit recipe
  submitRecipe(user) {
    let action = {};
    let dateTime = new Date()
    user['category'] = this.category.value;
    user['ingrlist'] = this.model.touchedRows
    user['instrlist'] = this.model.touchedRows1
    user['createdBy'] = this.username
    user['createdById'] = this.ls.userid
    user['createdOn'] = dateTime
    let fd = new FormData();

    //append file data to fd object

    fd.append("photo", this.file);

    //append userobj to fd
    //convert pbject into string

    fd.append("userObj", JSON.stringify(user));
    console.log("above user object in recipe", fd);
    this.rs.addRecipe(fd).subscribe((res) => {
      if (res["message"] == "recipe added successfully") {
        this.success = true;
        alert(`Recipe ${user['recipe']} Added`);
      }
      if (this.success) {
        action['createdById'] = this.ls.userid
        action['createdBy'] = this.username
        action['createdOn'] = dateTime
        action['ActionDone'] = `Recipe ${user['recipe']} Added`
        this.ra.addAction(action).subscribe((res) => {
          console.log("added recent action", res)
        })
      }
      if (this.ls.role === "admin") {
        this.router.navigate(['/admindashboard']);
      } else {
        this.router.navigate(['/userdashboard']);
      }
    })
  }

  //cancel posting recipe
  cancel() {
    if (this.ls.role === "admin") {
      this.router.navigate(['/admindashboard']);
    } else {
      this.router.navigate(['/userdashboard']);
    }
  }
  isFormPopulated() {
    return this.model.recipe.length && this.model.brief.length &&
      this.model.author.length && this.model.touchedRows.length >= 1 && this.model.touchedRows1.length >= 1;
  }
  private isListHasValue(list) {
    return list !== null && list !== undefined && list.length > 0;
  }

}

