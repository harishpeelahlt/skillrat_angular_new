import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsersService, UserDto, PageResponse } from '../../services/users.service';

interface RoleResponse {
  id: string;
  name: string;
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  roles: string[] = [];
  selectedRole: string = 'all';
  showUserForm = false;

  users: UserDto[] = [];
  isLoadingUsers = false;
  usersError: string | null = null;

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
    this.showUserForm = true;
  }

  onUserFormClosed(success: boolean): void {
    this.showUserForm = false;
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
    this.http
      .get<RoleResponse[]>('http://localhost:8081/api/roles/all')
      .subscribe({
        next: (data) => {
          const uniqueNames = Array.from(
            new Set(
              (data || [])
                .filter((r) => !!r.name)
                .map((r) => r.name)
            )
          );
          this.roles = uniqueNames;
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

    const roleParam = this.selectedRole === 'all' ? undefined : this.selectedRole;
    const qParam = this.searchQuery && this.searchQuery.trim().length > 0 ? this.searchQuery.trim() : undefined;

    this.usersService.getUsers(this.page, this.size, qParam, roleParam).subscribe({
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
      }
    });
  }

  getUserRoles(user: UserDto): string {
    if (!user || !user.roles || user.roles.length === 0) {
      return 'no role';
    }
    return user.roles.map((r) => r.name).join(', ');
  }
}
