export interface IFatherProject {
  id: number;
  name: string;
  scope: number;
  creater: number; //
  manager: string;
}
export type ManagerType = {
  id: number;
  nickname: string;
  phone: string;
};
export interface IChildrenProject {
  fatherProject: string; //
  id: number;
  managers: ManagerType[];
  name: string;
  progressNow: { name: string; id: number };
  remark: string;
  scope: string;
  startTime: string;
  subType: string;
  uncheckedQuestionCount: number;
}

export interface IData {
  fatherProject: IFatherProject;
  sonProject: IChildrenProject[];
}
