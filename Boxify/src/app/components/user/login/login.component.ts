import { Component } from '@angular/core';
import { Message } from 'primeng/message';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [Message, InputTextModule,CommonModule,FormsModule,FloatLabelModule,ButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'

  
})
export class LoginComponent {
    value1: string | undefined;
    value2: string | undefined;
    value3: string | undefined;
}
