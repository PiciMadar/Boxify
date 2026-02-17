import { Component, OnInit } from '@angular/core';
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
export class LoginComponent implements OnInit {

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
      next: (res: any) => {
        if (this.rememberMe) {
          this.auth.storeUser(res.token);
        }
        this.auth.login(res.token,res.id);
        this.msg.show("success","Success","Logged in successfully");
        this.router.navigate(['/boxes']);
      },
      error: (err) => {
        console.error(err);
        this.msg.show("error","Error",err.error.error);
      }
    });
  }
  ngOnInit(): void {
    if (this.auth.isLoggedUser()) {
      this.router.navigate(['/boxes']);
    }
  }
}
