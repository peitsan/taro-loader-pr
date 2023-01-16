import { transPermissionToIdentity } from "./index";
interface team {
  id: number;
  identity: number;
  projectId: number;
}
export const canCheckOtherReply = (fatherProjectId: number): boolean => {
  const teams: team[] = JSON.parse(Taro.getStorageSync("teams")!);
  const permission: string = Taro.getStorageSync("permission")!;
  let canCheck = false;
  if (teams.length) {
    for (let team of teams) {
      if (
        team.projectId === fatherProjectId &&
        team.identity === transPermissionToIdentity(permission)
      ) {
        canCheck = true;
        break;
      }
    }
  }
  return canCheck;
};
