import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToolbarModule } from 'primeng/toolbar';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { DropdownModule } from 'primeng/dropdown';
import { ApiService } from '../../../services/api.service';
import { MessageService } from '../../../services/message.service';
import { ConfirmationService } from 'primeng/api';
import { User } from '../../../interfaces/user';

@Component({
  selector: 'app-user-control',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    FloatLabelModule,
    ToggleButtonModule,
    ConfirmDialogModule,
    ToolbarModule,
    CardModule,
    TagModule,
    TooltipModule,
    IconFieldModule,
    InputIconModule,
    DropdownModule
  ],
  templateUrl: './user-control.component.html',
  styleUrl: './user-control.component.scss',
  providers: [ConfirmationService]
})
export class UserControlComponent implements OnInit {
  users: User[] = [];
  selectedUser: User | null = null;
  displayEditDialog: boolean = false;
  editingUser: User | null = null;
  loading: boolean = false;
  roleOptions = [
    { label: 'User', value: 'user' },
    { label: 'Admin', value: 'admin' }
  ];

  constructor(
    private api: ApiService,
    private msg: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.api.selectAll('users').subscribe({
      next: (response: any) => {
        this.users = response;
        console.log('Users loaded:', this.users);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.msg.show('error', 'Error', error.error?.error || 'Failed to load users');
        this.loading = false;
      }
    });
  }

  openEditDialog(user: User) {
    this.editingUser = JSON.parse(JSON.stringify(user)); // Deep copy
    this.displayEditDialog = true;
  }

  saveUser() {
    if (!this.editingUser) return;

    // Validate required fields
    if (!this.editingUser.name || !this.editingUser.email) {
      this.msg.show('error', 'Error', 'Name and email are required');
      return;
    }

    const userId = this.editingUser.id as string;
    this.api.update('users', userId, this.editingUser).subscribe({
      next: (response) => {
        this.msg.show('success', 'Success', 'User updated successfully');
        this.displayEditDialog = false;
        this.loadUsers();
      },
      error: (error) => {
        console.error('Error updating user:', error);
        this.msg.show('error', 'Error', error.error?.error || 'Failed to update user');
      }
    });
  }

  closeDialog() {
    this.displayEditDialog = false;
    this.editingUser = null;
  }

  confirmSuspendUser(user: User) {
    this.confirmationService.confirm({
      message: `Are you sure you want to ${user.status ? 'suspend' : 'activate'} this user?`,
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.toggleUserStatus(user);
      }
    });
  }

  toggleUserStatus(user: User) {
    const updatedUser = {
      ...user,
      status: !user.status
    };

    const userId = user.id as string;
    this.api.update('users', userId, updatedUser).subscribe({
      next: (response) => {
        const action = updatedUser.status ? 'activated' : 'suspended';
        this.msg.show('success', 'Success', `User ${action} successfully`);
        this.loadUsers();
      },
      error: (error) => {
        console.error('Error updating user status:', error);
        this.msg.show('error', 'Error', error.error?.error || 'Failed to update user status');
      }
    });
  }

  getStatusBadgeClass(status: boolean): string {
    return status ? 'active' : 'suspended';
  }

  getStatusText(status: boolean): string {
    return status ? 'Active' : 'Suspended';
  }
}
