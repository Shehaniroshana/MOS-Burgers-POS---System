import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  imports: [RouterLink,RouterOutlet],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})
export class SignInComponent {
  constructor(private router: Router) {}

  signIn() {
    console.log('Sign in clicked');
    window.location.href = 'http://localhost:4200/home'; 
   }

}
