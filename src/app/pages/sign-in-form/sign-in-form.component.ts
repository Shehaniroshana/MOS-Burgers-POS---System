import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sign-in-form',
  standalone: true,
  imports: [RouterLink,CommonModule],
  templateUrl: './sign-in-form.component.html',
  styleUrls: ['./sign-in-form.component.css']
})
export class SignInFormComponent {

  constructor(private router: Router) { }

  isPasswordVisible: boolean = false;

  togglePassword(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
  logIn(email: string, password: string): void {
    console.log(email, password);
  
    if (email !== '' && password !== '') {
      const encodedEmail = encodeURIComponent(email);
      const encodedPassword = encodeURIComponent(password);
      
      fetch(`http://localhost:8080/mos/user/authenticateUser/${encodedEmail}/${encodedPassword}`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then(result => {
          if (result === true || result === "true") {
            Swal.fire('Success!', 'Login successful', 'success');
            this.router.navigate(['navbar']);
          } else {
            Swal.fire('Error!', 'Invalid email or password', 'error');
          }
        })
        .catch(error => {
          console.error('Login error:', error);
          Swal.fire('Error!', 'Something went wrong', 'error');
        });
  
    } else {
      Swal.fire('Error!', 'Please enter email and password', 'error');
    }
  }
  

}
