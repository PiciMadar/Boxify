import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CardModule } from 'primeng/card';
import { ApiService } from '../../../services/api.service';
import { MessageService } from '../../../services/message.service';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../interfaces/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    InputTextModule,
    CommonModule,
    FormsModule,
    FloatLabelModule,
    ButtonModule,
    PasswordModule,
    CardModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  constructor(private api : ApiService,
    private msg : MessageService,
    private router: Router
  ) {

  }
    user : User = {
      name: '',
      email: '',
      password: ''
    };
    confirm:string = '';

    register() {
      if(!this.user.name || !this.user.password || !this.user.email){
      this.msg.show("error","Error","All fields are required");
      return;
    }
      if(this.user.password != this.confirm){
        this.msg.show("error","Error","Passwords do not match");
        return;
    }
    if(this.user.password.length < 8){
      this.msg.show("error","Error","Password must be at least 8 characters long");
      return;
    }
    if(!this.user.email.includes("@")){
      this.msg.show("error","Error","Email is invalid");
      return;
    }
    
    this.api.registration("users", this.user).subscribe({
      next: (response) => {
        this.msg.show("success", "Registration Successful", "User registered successfully");
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.msg.show("error", "Registration Failed", err.error.message);
      }
    });
  }
}
