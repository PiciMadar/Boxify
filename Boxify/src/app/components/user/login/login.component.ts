import { Component } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CardModule } from 'primeng/card';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CheckboxModule } from 'primeng/checkbox';
import { User } from '../../../interfaces/user';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { MessageService } from '../../../services/message.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FloatLabelModule, InputTextModule, FormsModule, ReactiveFormsModule, ButtonModule, PasswordModule, CheckboxModule, CardModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  rememberMe: boolean = false;
  user:User = {
    id: '',
    name: '',
    email: '',
    password: '',
    role: '',
    status: false
  }

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private router: Router,
    private msg: MessageService
  ) {}

  login() {
    let data = {
      email: this.user.email,
      password: this.user.password
    }
    this.api.login('users', data).subscribe({
      next: (res) => {
        if (this.rememberMe) {
          this.auth.storeUser(res as any);
        }
        this.auth.login(res as any);
        this.msg.show("success","Success","Logged in successfully");
        this.router.navigate(['/boxes']);
      },
      error: (err) => {
        console.error(err);
        this.msg.show("error","Error",err.error.error);
      }
    });
  }
}
