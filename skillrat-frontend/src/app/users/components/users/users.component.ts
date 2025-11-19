import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  UsersService,
  UserDto,
  PageResponse,
} from '../../services/users.service';

interface RoleResponse {
  id: string;
  name: string;
}

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrl: './users.component.css',
    standalone: false
})
export class UsersComponent implements OnInit {
  roles: any;
  selectedRole: string = 'all';
  showUserForm = false;

  users: UserDto[] = [];
  isLoadingUsers = false;
  usersError: string | null = null;
  selectedUserForEdit: UserDto | null = null;

  page = 0;
  size = 10;
  totalElements = 0;
  totalPages = 0;

  searchQuery = '';

  constructor(private http: HttpClient, private usersService: UsersService) {}

  ngOnInit(): void {
    this.loadRoles();
    this.loadUsers();
  }

  openUserForm(): void {
    this.selectedUserForEdit = null;
    this.showUserForm = true;
  }

  onUserFormClosed(success: boolean): void {
    this.showUserForm = false;
    this.selectedUserForEdit = null; // Reset after close
    if (success) {
      this.loadUsers();
    }
  }

  onSearchChange(value: string): void {
    this.searchQuery = value;
    this.page = 0;
    this.loadUsers();
  }

  onRoleChange(value: string): void {
    this.selectedRole = value;
    this.page = 0;
    this.loadUsers();
  }

  nextPage(): void {
    if (this.page < this.totalPages - 1) {
      this.page += 1;
      this.loadUsers();
    }
  }

  previousPage(): void {
    if (this.page > 0) {
      this.page -= 1;
      this.loadUsers();
    }
  }

  private loadRoles(): void {
    this.usersService.getAllRoles().subscribe({
      next: (data) => {
        const map = new Map<string, string>();
        (data || []).forEach((r: any) => {
          if (r.name && r.id && !map.has(r.name)) {
            map.set(r.name, r.id);
          }
        });
        this.roles = Array.from(map.entries()).map(([name, id]) => ({
          id,
          name,
        }));
      },
      error: (err) => {
        console.error('Failed to load roles', err);
        this.roles = [];
      },
    });
  }

  private loadUsers(): void {
    this.isLoadingUsers = true;
    this.usersError = null;

    const roleParam =
      this.selectedRole === 'all' ? undefined : this.selectedRole;
    const qParam =
      this.searchQuery && this.searchQuery.trim().length > 0
        ? this.searchQuery.trim()
        : undefined;

    this.usersService
      .getUsers(this.page, this.size, qParam, roleParam)
      .subscribe({
        next: (response: PageResponse<UserDto>) => {
          this.users = response.content || [];
          this.totalElements = response.totalElements;
          this.totalPages = response.totalPages;
          this.isLoadingUsers = false;
        },
        error: () => {
          this.usersError = 'Failed to load users. Please try again.';
          this.users = [];
          this.isLoadingUsers = false;
        },
      });
  }

  getUserRoles(user: UserDto): string {
    if (!user || !user.roles || user.roles.length === 0) {
      return 'No role';
    }
    return user.roles[0]?.name || 'No role';
  }

  onEditUser(user: UserDto): void {
    debugger;
    this.selectedUserForEdit = user; // Pass the user to edit
    this.showUserForm = true;
  }

  onDeleteUser(user: UserDto): void {
    if (
      confirm(
        `Are you sure you want to delete ${user.firstName} ${user.lastName}?`
      )
    ) {
      console.log('Delete user:', user);
    }
  }
}
