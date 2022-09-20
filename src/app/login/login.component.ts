import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { error } from '@angular/compiler/src/util';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { UserService } from '../user.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public loginForm!: FormGroup
  //Authenticate user details from userapi
  userapi = environment.userapi;

  submitted = false;
  get f() { return this.loginForm.controls; }
  //constructor injection
  constructor(private formBuilder: FormBuilder, private http: HttpClient, private router: Router,
    private userService: UserService) { }

  ngOnInit(): void {
    this.userService.validateAuth(false); //data parameter in your userservice
    this.loginForm = this.formBuilder.group({
      useremail: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
  login() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.http.get<any>(this.userapi)
      .subscribe(res => {
        const user = res.find((a: any) => {
          return a.useremail === this.loginForm.value.useremail && a.password === this.loginForm.value.password
        });
        if (user) {
          alert("login successful!!");
          this.loginForm.reset();
          this.router.navigate(['home'])
          this.userService.validateAuth(true);
        } else {
          alert("user not found !!");
          this.userService.validateAuth(false);
        }
      })
  }
  onSubmit() {
    alert("You have entered the Dreamland!!");
  }
}