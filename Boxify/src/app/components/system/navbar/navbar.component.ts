import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MenubarModule,CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit{
  items: MenuItem[] | undefined;

    ngOnInit() {
        this.items = [
            //Always on
            {
                label: 'Home',
                icon: 'pi pi-home'
            },
            //After auth
            {
                label: 'Dashboard',
                icon: 'pi pi-chart-pie'
            },
            {
                label: 'Boxes',
                icon: 'pi pi-box',
                items:[
                  {
                    label:"My boxes",
                    icon:'pi pi-box'
                  },
                  {
                    label:"Fill a new box",
                    icon:'pi pi-plus'
                  },
                ]
            },
            //admin
            {
                label: 'User control panel',
                icon: 'pi pi-users'
            }
        ]
    }
}
