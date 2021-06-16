import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../shared/service/auth.service";
import { Router } from "@angular/router";


@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  constructor(public authService: AuthService, public router: Router) { }

  ngOnInit(): void {
    //Check if the user is logged in, and if a user is logged in redirect to dashboard to prevent logging them in again
    if(this.authService.userData !== null/*JSON.parse(localStorage.getItem('user')) !== null*/) {
      this.router.navigate(['dashboard']);
    }
  }

}
