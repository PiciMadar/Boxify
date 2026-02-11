import { Component } from '@angular/core';
import { Message } from 'primeng/message';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule, ReactiveFormsModule, FormGroup,FormControl} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [Message, InputTextModule,CommonModule,
    FormsModule,FloatLabelModule,ButtonModule,
    ReactiveFormsModule,CheckboxModule,
    PasswordModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'

  
})
export class LoginComponent {
  formGroup!: FormGroup;

    value1: string | undefined;
    value2: string | undefined;
    value3: string | undefined;
    ngOnInit() {
        this.formGroup = new FormGroup({
            city: new FormControl<string | null>(null)
        });
    }
}
