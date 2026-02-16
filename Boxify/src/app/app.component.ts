import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingService } from './services/loading.service';
import { ProgressbarComponent } from './components/system/progressbar/progressbar.component';
import { NavbarComponent } from './components/system/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './components/system/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { MessageComponent } from './components/system/message/message.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,ProgressbarComponent,NavbarComponent,CommonModule,FooterComponent,HeaderComponent,MessageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  app_title = 'Boxify';

  loading$ = inject(LoadingService).loading$;
  constructor(
  ) { }
}
