import { Component } from '@angular/core';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule, ReactiveFormsModule, FormGroup,FormControl} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { CardModule } from 'primeng/card';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [InputTextModule, CommonModule,
    FormsModule, FloatLabelModule, ButtonModule,
    ReactiveFormsModule, CheckboxModule,
    PasswordModule, CardModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'

  
})
export class LoginComponent {
  formGroup!: FormGroup;

    email: string | undefined;
    password: string | undefined;
    ngOnInit() {
        this.formGroup = new FormGroup({
            city: new FormControl<string | null>(null)
        });
    }
}
