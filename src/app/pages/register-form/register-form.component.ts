import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register-form',
  imports: [RouterLink, CommonModule],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.css'
})
export class RegisterFormComponent {

  isPasswordVisible: boolean = false;

  togglePassword(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  constructor(private router: Router) { }

  register(fullName: string, email: string, role: string, password: string, confirmPassword: string) {

    if (fullName != '' && email != '' && role != '' && password != '' && confirmPassword != '') {

      if (password === confirmPassword) {
        console.log(fullName, email, role, password, confirmPassword);


        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
          "userName": fullName,
          "password": password,
          "role": role,
          "email": email
        });

        const requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow" as RequestRedirect
        };

        fetch("http://localhost:8080/mos/user/saveUser", requestOptions)
          .then((response) => response.text())
          .then((result) =>{
            console.log(result);
            if (result) {
              Swal.fire('Success!', 'Registration successful', 'success');
              this.router.navigate(['/']);
            } else {
              Swal.fire('Error!', 'Registration failed', 'error');
            }
          })
          .catch((error) => console.error(error));

      } else {
        Swal.fire('Error!', 'Passwords do not match', 'error');
      }

    } else {
      Swal.fire('Error!', 'Please enter all the fields', 'error');
    }

  }

}
