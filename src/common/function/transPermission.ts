export const tansPermission = (permission: string) => {
  type MapType = {
    [propName: string]: string;
  };
  const map: MapType = {
    worker: "员工",
    manager: "项目经理",
    admin: "管理员",
  };
  return map[permission];
};
