import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { AuthService } from '../../../services/auth.service';
import { Subscription } from 'rxjs';
import { MessageService } from '../../../services/message.service';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MenubarModule,CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit, OnDestroy{
  constructor(
    private auth: AuthService,
    private msg: MessageService,
    private router: Router,
    private api: ApiService
  ) { }
  items: MenuItem[] = [];
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;
  private subscription: Subscription | null = null;

  ngOnInit() {
    // Initial check and build
    this.checkAuthStatus();
    this.buildMenuItems();

    // Subscribe to login status changes
    this.subscription = this.auth.isLoggedIn$.subscribe((loggedIn) => {
      this.checkAuthStatus();
      this.buildMenuItems();
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

   async checkAuthStatus() {
    this.isLoggedIn = this.auth.isLoggedUser();
    if (this.isLoggedIn) {
    this.isAdmin = await this.auth.isAdmin();
    }
  }

  buildMenuItems() {
    const menuItems: MenuItem[] = [
    ];

    // Logged out items
    if (!this.isLoggedIn) {
      menuItems.push(
        {
          label: 'Login',
          icon: 'pi pi-sign-in',
          url: '/login'
        },
        {
          label: 'Register',
          icon: 'pi pi-user-plus',
          url: '/register'
        }
      );
    }

    // Logged in items
    if (this.isLoggedIn) {
      menuItems.push(
        {
          label: 'Dashboard',
          icon: 'pi pi-chart-pie',
          url: '/dashboard'
        },
        {
          label: 'Boxes',
          icon: 'pi pi-box',
          items: [
            {
              label: 'My Boxes',
              icon: 'pi pi-box',
              url: '/boxes'
            },
            {
              label: 'Fill a New Box',
              icon: 'pi pi-plus',
              url: '/packing'
            }
          ]
        }
      );

      // Admin only items
      if (this.isAdmin) {
        menuItems.push(
          {
            label: 'User Control Panel',
            icon: 'pi pi-users',
            url: '/user-control'
          }
        );
      }

      // Logout button
      menuItems.push(
        {
          label: 'Logout',
          icon: 'pi pi-sign-out',
          command: () => this.logout()
        }
      );
    }

    this.items = menuItems;
  }

  logout() {
    this.auth.logout();
    this.msg.show("success", "Success", "You have been logged out successfully");
    this.router.navigate(['/login']);
  }
}
