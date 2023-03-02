/* 
  请求参数类型配置
*/

/* 
  访问接口
*/
// 用户登录
export interface userLogin {
  username: string;
  password: string;
}

/* 
  员工
*/
export interface getOwnProjects {
  identity: number;
  isCheck: number;
}
export interface getProjectProgress {
  project_id: string;
}
export interface getProjectProgressDetail {
  project_id: string;
  progress_id: string;
}
interface item {
  name: string;
}
export interface addNewList {
  progress_id: string;
  type: string;
  name: string;
  items: item[];
}
export interface replyQus {
  reason_id: string;
  text: string;
  attachment: string;
  type: string;
}

export interface applyAdjust {
  adjustTime: number;
  adjustReason: string;
  reasonId: string;
  adjustType: string;
}

export interface getTechnologyList {
  projectId: string;
  progressId: string;
}

export interface updateTechnologyList {
  projectId: string;
  progressId: string;
  sheetId: number;
  opinion: string;
  situation: string;
}

export interface getSpecial {
  progressId: string;
}

export interface specialAdjustTime {
  questionId: number;
  adjustTime: number;
  adjustReason: string;
  progressId: string;
}

export interface specialReply {
  questionId: number;
  text: string;
  attachment: string;
  progressId: string;
}

export interface specialReport {
  projectId: number;
  questionId: number;
  responsibleId: number;
}

export interface checkAdjustTime {
  projectId: number;
  zxpgId: number;
}

export interface checkReply {
  projectId: number;
  zxpgId: number;
}

export interface deleteOneCase {
  caseId: number;
}

export interface downLoadCaseFile {
  url: string;
}
/* 
  项目经理
*/
export interface getUncheckedProjectQuestion {
  project_id: string;
}

export interface replyApprove {
  project_id: string;
  question_id: string;
  itemName: string;
}

export interface passThreeListItem {
  itemName: string;
  project_id: string;
  problem_id: string;
  sendData: any;
}
export interface backThreeListItem {
  itemName: string;
  project_id: string;
  problem_id: string;
}
export interface pushProjectToNextProgress {
  project_id: string;
}
export interface selectProjectProgressStartTime {
  project_id: number;
  progress_id: number;
  startTime: number;
}
export interface selectProjectProgressPlanTime {
  project_id: number;
  progress_id: number;
  planTime: number;
}
export interface selectProjectProgressFinishTime {
  project_id: number;
  progress_id: number;
  finishTime: number;
}
export interface IAdjustTimeAfterChuShe {
  project_id: number;
  progress_id: number;
  adjustTime: number;
}
export interface comfirmResponsible {
  project_id: string;
  question_id: string;
  responsibles: number[];
  relevantors: number[];
  advanceDay: number;
}
export interface lookAllListReply {
  project_id: string;
  question_id: string;
  itemName: string;
}
export interface downloadFile {
  replyFile: string;
}
export interface timeApply {
  approvalId: string;
}
export interface managerTimeApply {
  project_id: string;
  question_id: string;
  responsibleId?: number;
  itemName: string;
}
export interface managerSubmitProjectProgressPlanTimeApply {
  projectId: number;
  progressId: number;
  adjustReason: string;
  adjustTime: number;
  responsibleId: number;
}
export interface managerCheckMidContent {
  projectId: number;
  progressId: number;
  sheetIds: number[];
  isCheck: number;
}
export interface getManagerProjectTeamPerson {
  fatherId: string;
}
export interface addManagerProjectTeamPerson {
  userIds: number[];
  identity: number;
  projectId: number;
}
export interface deleteManagerProjectTeamPerson {
  fatherId: number;
  userId: number;
}
export interface setFatherProjectNodeTime {
  project_id: string;
  progress_id: string;
  startTime: number;
}

export interface pushFatherProjectToNextProgress {
  fatherId: string;
}

export interface chooseTime {
  progressId: string;
  id: number;
  c?: number;
  d?: number;
  e?: number;
}

export interface managerGetAllWorker {
  fatherId: number;
}

export interface specialChooseResponsible {
  projectId: number;
  zxpgId: number;
  advanceDay: number;
  relevantors: any[];
  responsibles: any[];
}

export interface handoverProject {
  fatherId: number;
  userId: number;
}

export interface specialPass {
  projectId: string;
  zxpgId: number;
}

export interface specialReject {
  projectId: string;
  zxpgId: number;
}

export interface specialAdjustTimePass {
  projectId: string;
  questionId: number;
}

export interface specialAdjustTimeReject {
  projectId: string;
  questionId: number;
}

/*
  管理员
*/

export interface projectNewAdd {
  managers: number[];
  startTime: string;
  scope: number;
  type: number;
  subType: number;
  name: string;
  remark: string;
  fatherId: number;
}

export interface addDepartment {
  name: string;
  unitId: number;
}
export interface getWorkerFromDepartment {
  dept_id: string;
}
export interface addWorker {
  deptId: number;
  username: string;
  nickname: string;
  permission: string;
  password: string;
}
export interface getUnitDepartment {
  unitId: number;
}

export interface getDepartmentWorker {
  deptId: number;
}

export interface addUnit {
  name: string;
}

export interface deleteUnit {
  unitId: number;
}

export interface updateUnit {
  unitId: number;
  name: string;
}

export interface deleteDept {
  deptId: number;
}

export interface updateDept {
  deptId: number;
  name: string;
  unitId: number;
}

export interface deleteWorker {
  workerId: number;
}

export interface updateWorker {
  workerId: number;
  nickname: string;
  phone: string;
  deptId: number;
  permission: string;
}

export interface uploadAttachment {
  projectId: number;
  progressId: number;
  attachment: string;
}

export interface updateSheet {
  projectId: number;
  progressId: number;
  sheetId?: number;
  opinion?: string;
  situation?: string;
}

export interface mediateInspection {
  projectId: string;
  progressId: string;
}
export interface preInspection {
  projectId: number;
  progressType: number;
}

export interface getFatherProjectNodeDetail {
  projectId: number;
}

export interface fatherProjectNewAdd {
  name: string;
  scope: number;
}

export interface managerCheckForNK {
  projectId: number;
  progressType: number;
  code: string;
}
export type addManager = number[];

export interface deleteManager {
  userId: number;
}

export interface createClassicCase {}
