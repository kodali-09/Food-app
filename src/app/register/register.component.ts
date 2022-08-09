import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { RegisterService } from '../register.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private rs: RegisterService, private route: Router) { }
  @ViewChild('fileUploader',{static: false}) 
    fileUploader:ElementRef;
  private usernameLength = 6;
  private passwordPattern = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/);
  private emailIdPattern = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
  model: any = {
    username: '',
    password: '',
    emailId: '',
    confirmPassword: '',
    isPasswordValid: true,
    isPasswordMatched: true,
    isUsernameValid: true,
    isRegisterEnabled: false,
    isEmailIdValid: true,
    usernameErrMsg: '',
    message: "upload a photo"
  }
  imageUrl: string | ArrayBuffer = "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSNq-Mk-bEDdB90ZkoVmH-zFf-RoLenjYfUHps5qzp3d25Dt1TJ&usqp=CAU";
  file: File;
  isImageUploaded: boolean = false;
  private filetype = ['image/jpeg', 'image/png', 'image/jpg'];
  ngOnInit() {
  }

  isUserNamePopulated() {
    const parent = this;
    if (parent.model.username.length < parent.usernameLength) {
      parent.model.usernameErrMsg = 'Invalid, Must have atleast 6 chars.';
      parent.model.isUsernameValid = false;
    } else {
      parent.model.isUsernameValid = true;
    }
    parent.enableDisabledFields();
  }

  validateEmail() {
    const parent = this;
    if (parent.emailIdPattern.test(parent.model.emailId) == false) {
      parent.model.isEmailIdValid = false;
    } else {
      parent.model.isEmailIdValid = true;
    }
    parent.enableDisabledFields();
  }

  validatePassword() {
    const parent = this;
    if (parent.passwordPattern.test(parent.model.password) == false) {
      parent.model.isPasswordValid = false;
    } else {
      parent.model.isPasswordValid = true;
    }
    parent.enableDisabledFields();
  }

  validateConfirmPassword() {
    const parent = this;
    if (parent.model.password === parent.model.confirmPassword) {
      parent.model.isPasswordMatched = true;
    } else {
      parent.model.isPasswordMatched = false;
    }
    parent.enableDisabledFields();
  }

  getImageFile(imageInfo: File) {
    this.file = imageInfo;
    if (this.file !== undefined && this.filetype.includes(this.file.type)) {
      if (this.file !== undefined) {
        let reader = new FileReader();
        reader.readAsDataURL(this.file);
        reader.onload = () => {
          this.imageUrl = reader.result;
          this.isImageUploaded = true;
          this.model.message = "";
        }
      }
    } else {
      this.imageUrl="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSNq-Mk-bEDdB90ZkoVmH-zFf-RoLenjYfUHps5qzp3d25Dt1TJ&usqp=CAU"
      this.model.message = "upload a valid photo of type jpg or jpeg or png";
      this.model.isImageUploaded = false;
      this.fileUploader.nativeElement.value = null;
      this.file=undefined;
    }
  }

  submitForm(formObj: NgForm) {
    //send user obj to registration form
    //console.log(userObj);
    if (this.model.isRegisterEnabled) {
      let fd = new FormData();
      let userObj = formObj.value;
      if (this.file == undefined) {
        userObj['imageUrl'] = this.imageUrl;
      }
      fd.append("photo", this.file);
      fd.append("userObj", JSON.stringify(userObj));
      this.rs.doRegister(fd).subscribe((res) => {
        //alert(res['message'])
        if (res["message"] === "username already existed") {
          this.model.isRegisterEnabled = false;
          this.model.usernameErrMsg = 'Username already exists';
          this.model.isUsernameValid = false;
        }
        if (res["message"] === "register successful") {
          this.route.navigate(["./login"]);
        }
      })
    }
  }

  //------------PRIVATE METHODS--------------//

  private enableDisabledFields() {
    const parent = this;
    parent.model.isRegisterEnabled = parent.model.isUsernameValid && parent.model.isEmailIdValid
      && parent.model.isPasswordValid && parent.model.isPasswordMatched && parent.model.username.length
      && parent.model.password.length && parent.model.emailId.length && parent.model.confirmPassword.length;
  }

}
