import { Component, OnInit, OnDestroy } from '@angular/core';
import { RolePermissionsService } from 'src/app/services/role-permissions.service';
import { Subscription } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.scss']
})
export class SidebarMenuComponent implements OnInit, OnDestroy {
  permissions: { [key: string]: number } = {};
  permissionsSubscription: Subscription = new Subscription();
  routerSubscription: Subscription = new Subscription();
  dynamicMenuItems: string[] = [];
  permissionsLoaded: boolean = false; // Flag to indicate permissions are loaded

  constructor(
    public rolePermissionsService: RolePermissionsService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const userData = JSON.parse(sessionStorage.getItem('user_data') || '{}');
    const roleId = userData.role;

    if (roleId) {
      this.loadPermissions(roleId);
    } else {
      // console.warn('No roleId found, setting default permissions');
      this.permissions = {}; // Default to an empty permissions object
      this.permissionsLoaded = true; // Avoid infinite loading
    }

    this.permissionsSubscription = this.rolePermissionsService.permissions$.subscribe(
      (permissions: { [key: string]: number }) => {
        this.permissions = permissions;
        this.updateDynamicMenuItems();
        this.permissionsLoaded = true; // Mark permissions as loaded
        this.cdr.detectChanges();
      }
    );
  }


  loadPermissions(roleId: number) {
    // console.log('Loading permissions for roleId:', roleId);
    this.rolePermissionsService.loadPermissions(roleId);
  }

  updateDynamicMenuItems() {
    this.dynamicMenuItems = Object.keys(this.permissions).filter(permissionName => this.permissions[permissionName] === 1);
    // console.log('Dynamic Menu Items:', this.dynamicMenuItems);
  }

  hasPermission(permissionName: string): boolean {
    const normalizedPermissionName = permissionName.trim().toLowerCase();
    const hasPermission = this.permissions[normalizedPermissionName] === 1;
    // console.log(`Checking permission for "${permissionName}" (normalized as "${normalizedPermissionName}"):`, hasPermission);
    return hasPermission;
  }

  ngOnDestroy(): void {
    this.permissionsSubscription.unsubscribe();
    this.routerSubscription.unsubscribe();
  }
}

