import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { createAccount } from '../../Service/RegisterService';

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

   createAccount(fullName, email, role, password, confirmPassword, this.router);

  }

}
