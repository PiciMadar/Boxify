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
    private auth: AuthService,
    private msg : MessageService
  ) {

  }
    user : User = {
      name: '',
      email: '',
      password: ''
    };
    confirm:string = '';

    register() {
      if(this.user.password != this.confirm){
        this.msg.show("error","Error","Passwords do not match");
    }
    this.api.registration("users", this.user).subscribe({
      next: (response) => {
        this.msg.show("success", "Registration Successful", "User registered successfully");
      },
      error: (error) => {
        this.msg.show("error", "Registration Failed", error.message);
      }
    });
  }
}
