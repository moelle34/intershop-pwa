export interface UserRole {
  fixed: boolean;
  permissions: {
    permissionDisplayName: string;
    permissionID: string;
    type: 'RolePermission';
  }[];
  roleDisplayName: string;
  roleID: string;
}
