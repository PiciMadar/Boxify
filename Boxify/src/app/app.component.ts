import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { LoadingService } from './services/loading.service';
import { ProgressbarComponent } from './components/system/progressbar/progressbar.component';
import { NavbarComponent } from './components/system/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './components/system/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { MessageComponent } from './components/system/message/message.component';
import { AuthService } from './services/auth.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,ProgressbarComponent,NavbarComponent,CommonModule,FooterComponent,HeaderComponent,MessageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  constructor(
    private auth: AuthService,
    private router: Router
  ) { }
  
  app_title = 'Boxify';
  loading$ = inject(LoadingService).loading$;

  ngOnInit() {
    if (this.auth.isLoggedUser()) {
      this.router.navigate(['/boxes']);
    }
  }
}
