import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router, private ls: LoginService) { }

  ngOnInit() {
    setTimeout(() => {
      this.ls.userLoginStatus = false;
      this.ls.adminLoginStatus = false;
      this.ls.doLogout();
    });
  }
  model: any = {
    username: '',
    password: '',
    isLoginEnabled: false
  }

  enableDisabledFields() {
    this.model.isLoginEnabled = this.model.username.length && this.model.password.length;
  }

  submitForm(dataObj) {
    if (this.model.isLoginEnabled) {
      this.ls.doLogin(dataObj).subscribe((result) => {
        if (result["message"] == "invalid username") {
          alert("invalid user name");
        }
        else if (result["message"] == "invalid password") {
          alert("Invalid password");
        }
        else {
          alert("login sucess");
          localStorage.setItem("token", result["message"]);
          this.ls.userLoginStatus = true;
          this.ls.username = result["username"];
          this.ls.userid = result["userid"];
          //redirect to admindashboard component
          if (result["role"] == "admin") {
            this.ls.adminLoginStatus = true;
            this.ls.role = "admin";
            this.router.navigate(['/admindashboard']);
          }
          //redirect to userdashboard component
          else {
            this.ls.role = "user";
            this.router.navigate(['/userdashboard']);
          }
        }
      })
    }
  }
}
