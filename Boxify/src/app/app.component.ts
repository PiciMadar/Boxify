import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingService } from './services/loading.service';
import { ProgressbarComponent } from './components/system/progressbar/progressbar.component';
import { NavbarComponent } from './components/system/navbar/navbar.component';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,ProgressbarComponent,NavbarComponent,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Boxify';

  loading$ = inject(LoadingService).loading$;
  constructor(
  ) { }
}
