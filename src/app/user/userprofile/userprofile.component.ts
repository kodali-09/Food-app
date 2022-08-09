import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { LoginService } from 'src/app/login.service';
import { RecentActionsService } from 'src/app/recent-actions.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.css']
})
export class UserprofileComponent implements OnInit {

  constructor(private dataService: DataService, private loginService: LoginService, private recentActionsService: RecentActionsService,
    private router: Router) { }
  @ViewChild('fileUploader', { static: false })
  fileUploader: ElementRef;
  model: any = {
    username: '',
    password: '',
    emailid: '',
    confirmPassword: '',
    isPasswordValid: true,
    isPasswordMatched: true,
    isUsernameValid: true,
    isSaveEnabled: false,
    isEmailIdValid: true,
    usernameErrMsg: '',
    isImageUploaded: true,
    message: ''
  }

  private usernameLength = 6;
  private passwordPattern = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/);
  private emailIdPattern = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
  private filetype = ['image/jpeg', 'image/png', 'image/jpg'];

  getDataEvent: any;
  userdata: object;
  isDataLoaded: boolean = false;
  file: File;
  imageUrl: string | ArrayBuffer = "";
  password: '';
  email: '';
  isUsernameExists: boolean = false;

  ngOnInit() {
    if (this.loginService.role == "admin") {
      this.dataService.adminData.subscribe((data) => {
        if (data != null) {
          this.userdata = data;
          this.isDataLoaded = true;
          this.model.username = data["username"];
          this.model.emailid = data["email"];
          if (data["imageUrl"] == null) {
            this.imageUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSNq-Mk-bEDdB90ZkoVmH-zFf-RoLenjYfUHps5qzp3d25Dt1TJ&usqp=CAU"
          } else {
            this.imageUrl = data["imageUrl"];
          }
          this.password = data["password"];
          this.email = data["email"];
        }
      });
    } else {
      this.dataService.userData.subscribe((data) => {
        if (data != null) {
          this.userdata = data;
          this.isDataLoaded = true;
          this.model.username = data["username"];
          this.model.emailid = data["email"];
          this.imageUrl = data["imageUrl"];
          this.password = data["password"];
          this.email = data["email"];
        }
      });
    }
  }

  // ngOnDestroy(): void {
  //   this.getDataEvent.unsubscibe();
  // }

  searchUser(username) {
    this.loginService.searchuser(username).subscribe((res) => {
      if (res["message"] === "username already exists") {
        this.isUsernameExists = true;
        this.model.usernameErrMsg = 'Username already exists';
        this.model.isUsernameValid = false;
        this.enableDisabledFields();
      } else {
        this.isUsernameExists = false;
        this.model.isUsernameValid = true;
        this.enableDisabledFields();
      }
    });
  }

  validateUsername() {
    const parent = this;
    if (parent.model.username != this.loginService.username) {
      if (parent.model.username.length < parent.usernameLength) {
        parent.model.usernameErrMsg = 'Invalid, Must have atleast 6 chars.';
        parent.model.isUsernameValid = false;
      } else {
        this.searchUser(parent.model.username);
        if (this.isUsernameExists === true) {
          parent.model.usernameErrMsg = 'Username already exists';
          parent.model.isUsernameValid = false;
        } else {
          parent.model.isUsernameValid = true;
        }
      }
    } else {
      parent.model.isUsernameValid = true;
    }
    parent.enableDisabledFields();
  }

  validateEmail() {
    const parent = this;
    if (parent.emailIdPattern.test(parent.model.emailid) == false) {
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

  private enableDisabledFields() {
    const parent = this;
    parent.model.isSaveEnabled = parent.model.isUsernameValid && parent.model.isEmailIdValid
      && parent.model.isPasswordValid && parent.model.isPasswordMatched;
  }

  getImageFile(imageInfo: File) {
    this.file = imageInfo;
    if (this.file !== undefined && this.filetype.includes(this.file.type)) {
      if (this.file != undefined) {
        let reader = new FileReader();
        reader.readAsDataURL(this.file);
        reader.onload = () => {
          this.imageUrl = reader.result;
          this.model.isDataLoaded = true;
          this.model.message = "";
        }
        this.enableDisabledFields();
      }
    } else {
      this.model.message = "upload a valid photo of type jpg or jpeg or png";
      this.imageUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSNq-Mk-bEDdB90ZkoVmH-zFf-RoLenjYfUHps5qzp3d25Dt1TJ&usqp=CAU";
      this.model.isImageUploaded = false;
      this.fileUploader.nativeElement.value = null;
      this.file = undefined;
      this.model.isSaveEnabled = false;
    }
  }

  removePhoto() {
    this.imageUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSNq-Mk-bEDdB90ZkoVmH-zFf-RoLenjYfUHps5qzp3d25Dt1TJ&usqp=CAU";
    this.model.isDataLoaded = true;
    this.file = undefined;
    this.fileUploader.nativeElement.value = null;
    this.enableDisabledFields();
  }

  submitForm() {
    if (this.model.isSaveEnabled) {
      let fd = new FormData();
      // var userObj = formObj.value;
      let userObj = {};
      let action = {};
      if (this.model.username.length == 0) {
        userObj['username'] = this.loginService.username;
      } else {
        userObj['username'] = this.model.username;
      }
      if (this.model.emailid.length == 0) {
        userObj['email'] = this.email;
      } else {
        userObj['email'] = this.model.emailid;
      }
      if (this.model.password.length == 0) {
        userObj['password'] = this.password;
        userObj['isHashed'] = true;
      } else {
        userObj['password'] = this.model.password;
        userObj['isHashed'] = false;
      }
      if (this.file == undefined) {
        userObj['imageUrl'] = this.imageUrl;
      }
      userObj['createdOn'] = new Date();
      fd.append("photo", this.file);
      fd.append("userObj", JSON.stringify(userObj));
      this.loginService.updateProfile(fd).subscribe((res) => {
        if (res["message"] == "updated profile successfully") {
          alert("updated profile successfully");
          action['createdById'] = this.loginService.userid
          action['createdBy'] = this.loginService.username
          action['createdOn'] = new Date();
          action['ActionDone'] = 'Updated profile'
          this.recentActionsService.addAction(action).subscribe((res) => {
            console.log("added recent action", res)
          })
          if (this.loginService.role === "admin") {
            this.router.navigate(['/admindashboard']);
          } else {
            this.router.navigate(['/userdashboard']);
          }
        }
      })
    }
  }

  cancel() {
    if (this.loginService.role === "admin") {
      this.router.navigate(['/admindashboard']);
    } else {
      this.router.navigate(['/userdashboard']);
    }
  }

}
