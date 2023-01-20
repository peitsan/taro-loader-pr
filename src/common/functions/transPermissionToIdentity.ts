export const transPermissionToIdentity = (permission: string) => {
  type ObjectType = {
    [propName: string]: number;
  };
  const permissionMap: ObjectType = {
    manager: 1,
    worker: 2,
  };
  return permissionMap[permission] || 2;
};
