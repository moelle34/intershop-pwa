import { UserRoleData } from './user-role.interface';
import { UserRoleMapper } from './user-role.mapper';

describe('User Role Mapper', () => {
  describe('fromData', () => {
    it(`should return User when getting  UserRoleData`, () => {
      const userRoleData = {
        fixed: true,
        permissions: [
          {
            permissionDisplayName: 'Permission1',
            permissionID: 'Permission1ID',
            type: 'RolePermission',
          },
          {
            permissionDisplayName: 'Permission2',
            permissionID: 'Permission2ID',
            type: 'RolePermission',
          },
        ],
        roleDisplayName: 'Buyer',
        roleID: 'APP_B2B_BUYER',
        type: 'UserRole',
      } as UserRoleData;
      const userRole = UserRoleMapper.fromData(userRoleData);

      expect(userRole).toBeTruthy();
      expect(userRole.fixed).toBe(userRoleData.fixed);
      expect(userRole.permissions).toBe(userRoleData.permissions);
      expect(userRole.roleDisplayName).toBe(userRoleData.roleDisplayName);
      expect(userRole.roleID).toBe(userRoleData.roleID);
    });
  });
});
