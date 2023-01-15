/* 
  请求url配置
*/
// 引入请求方法
import { httpReq } from './httpReq';
// 引入参数类型
import {
  /* 
    访问接口
  */
  userLogin,

  /* 
    员工
  */
  getOwnProjects,
  getProjectProgress,
  getProjectProgressDetail,
  addNewList,
  replyQus,
  applyAdjust,
  getTechnologyList,
  mediateInspection,
  getFatherProjectNodeDetail,
  getSpecial,
  specialAdjustTime,
  specialReply,
  /* 
      项目经理
  */
  getUncheckedProjectQuestion,
  replyApprove,
  passThreeListItem,
  backThreeListItem,
  pushProjectToNextProgress,
  selectProjectProgressStartTime,
  selectProjectProgressPlanTime,
  selectProjectProgressFinishTime,
  comfirmResponsible,
  lookAllListReply,
  updateTechnologyList,
  downloadFile,
  uploadAttachment,
  updateSheet,
  timeApply,
  managerTimeApply,
  managerSubmitProjectProgressPlanTimeApply,
  managerCheckMidContent,
  getManagerProjectTeamPerson,
  addManagerProjectTeamPerson,
  deleteManagerProjectTeamPerson,
  setFatherProjectNodeTime,
  pushFatherProjectToNextProgress,
  chooseTime,
  specialChooseResponsible,
  managerGetAllWorker,
  handoverProject,
  /*

  /* 
    管理员
  */
  addDepartment,
  getWorkerFromDepartment,
  addWorker,
  projectNewAdd,
  getUnitDepartment,
  getDepartmentWorker,
  addUnit,
  deleteUnit,
  updateUnit,
  deleteDept,
  updateDept,
  deleteWorker,
  updateWorker,
  fatherProjectNewAdd,
  addManager,
  deleteManager,
  specialPass,
  specialReject,
  specialAdjustTimePass,
  specialAdjustTimeReject,
  specialReport,
  checkAdjustTime,
  checkReply,
  deleteOneCase,
  downLoadCaseFile,
  createClassicCase,
} from './params';

class HttpUtil {
  /* 
      访问接口
  */
  // 用户登录
  userLogin = (params: userLogin) => {
    httpReq('post', `/user/login`, params);
  };
  /* 
    员工
  */
  //获取所有父项目
  getFatherProjects = () => httpReq('get', `/worker/fatherProject`);

  // 获取和自己有关的所有项目
  getOwnProjects = (params: getOwnProjects) =>
    httpReq('get', `/worker/OwnProject/${params.identity}/${params.isCheck}`);

  // 获取单个项目详情
  getProjectProgress = (params: getProjectProgress) =>
    httpReq('get', `/worker/project/${params.project_id}`);

  // 获取流程详情
  getProjectProgressDetail = (params: getProjectProgressDetail) =>
    httpReq(
      'get',
      `/worker/project/${params.project_id}/progress/${params.progress_id}`,
    );

  //获取全部工程
  getSonProject = () => httpReq('get', `/worker/project`);

  //新建三个清单
  addNewList = (params: addNewList) =>
    httpReq(
      'post',
      `/worker/progress/${params.progress_id}/${params.type}`,
      params,
    );

  //回复三个清单问题
  replyQus = (params: replyQus) =>
    httpReq('put', `/worker/${params.type}/${params.reason_id}/reply`, params);

  //申请调整时间
  applyAdjust = (params: applyAdjust) =>
    httpReq(
      'put',
      `/worker/${params.adjustType}/${params.reasonId}/adjust`,
      params,
    );

  //获取可研技术收口数据
  getTechnologyList = (params: getTechnologyList) =>
    httpReq(
      'get',
      `/worker/project/${params.projectId}/progress/${params.progressId}/getKyskSheet`,
    );

  // 获取问题上报审核列表
  workerGetQuestionTimeApplyList = () =>
    httpReq('get', `/worker/timeApproval/unchecked`);

  // 获取大小项目上报审核列表
  workerGetProjectTimeApplyList = () =>
    httpReq('get', `/worker/ProjectTimeApproval/unchecked`);

  // 通过问题计划完成时间上报审核
  workerApproveQuestionTimeApply = (params: timeApply) =>
    httpReq('put', `/worker/timeApproval/${params.approvalId}/approve`);

  // 驳回问题计划完成时间上报审核
  workerRejectQuestionTimeApply = (params: timeApply) =>
    httpReq('put', `/worker/timeApproval/${params.approvalId}/reject`);

  // 通过大小项目节点计划完成时间上报审核
  workerApproveProjectTimeApply = (params: timeApply) =>
    httpReq('put', `/worker/timeApproval/${params.approvalId}/approve`);

  // 驳回大小项目节点计划完成时间上报审核
  workerRejectProjectTimeApply = (params: timeApply) =>
    httpReq('put', `/worker/timeApproval/${params.approvalId}/reject`);

  //中间检查节点
  mediateInspection = (params: mediateInspection) =>
    httpReq(
      'get',
      `/worker/project/${params.projectId}/progress/${params.progressId}/IntermediateInspection`,
    );
  // 获取父项目节点详情
  getFatherProjectNodeDetail = (params: getFatherProjectNodeDetail) =>
    httpReq('get', `/worker/fatherProject/${params.projectId}`);

  //获取专项评估
  getSpecial = (params: getSpecial) =>
    httpReq('get', `/worker/getZxpg/${params.progressId}`);

  //专项评估申请调整时间
  specialAdjustTime = (params: specialAdjustTime) =>
    httpReq(
      'put',
      `/worker/zxpg/question/${params.progressId}/${params.questionId}/adjust`,
      params,
    );

  //回复专项评估
  specialReply = (params: specialReply) =>
    httpReq(
      'put',
      `/worker/zxpg/question/${params.progressId}/${params.questionId}/reply`,
      params,
    );

  //通过调整时间
  specialAdjustPass = (params: specialAdjustTimePass) =>
    httpReq(
      'put',
      `/manager/project/${params.projectId}/SpecialEvaluation/${params.questionId}/adjust/approve`,
    );

  //驳回调整时间
  specialAdjustReject = (params: specialAdjustTimeReject) =>
    httpReq(
      'put',
      `/manager/project/${params.projectId}/SpecialEvaluation/${params.questionId}/adjust/reject`,
    );

  //上报时间调整
  specialReport = (params: specialReport) =>
    httpReq(
      'put',
      `/manager/project/${params.projectId}/SpecialEvaluation/${params.questionId}/adjust/submit`,
      params,
    );

  //查看申请调整时间回复
  specialCheckTime = (params: checkAdjustTime) =>
    httpReq(
      'get',
      `/manager/project/${params.projectId}/SpecialEvaluation/${params.zxpgId}/adjust`,
    );

  //查看回复
  specialCheckReply = (params: checkReply) =>
    httpReq(
      'get',
      `/manager/project/${params.projectId}/SpecialEvaluation/${params.zxpgId}/reply`,
    );

  //查询所有典型经验
  getAllCase = () => httpReq('get', `/worker/case/caseDetail/all`);

  //下载指定典型经验的附件
  downLoadCaseFile = (params: downLoadCaseFile) =>
    httpReq('post', `/worker/case/download`, params);

  /* 
    项目经理
  */
  //新建父项目
  fatherProjectNewAdd = (params: fatherProjectNewAdd) =>
    httpReq('post', `/manager/fatherProject`, params);

  //新建项目
  projectNewAdd = (params: projectNewAdd) =>
    httpReq('post', `/manager/project`, params);

  // 获取自己所管理的所有项目
  getManagerProjects = () => httpReq('get', `/manager/project`);

  // 获取待审批问题
  getUncheckedProjectQuestion = (params: getUncheckedProjectQuestion) =>
    httpReq('get', `/manager/project/${params.project_id}/list/unchecked`);

  // 审批通过回复
  passReplyApprove = (params: replyApprove) =>
    httpReq(
      'put',
      `/manager/project/${params.project_id}/${params.itemName}/${params.question_id}/reply/approve`,
    );

  // 审批驳回回复
  backReplyApprove = (params: replyApprove) =>
    httpReq(
      'put',
      `/manager/project/${params.project_id}/${params.itemName}/${params.question_id}/reply/reject`,
    );

  // 通过三个清单
  passThreeListItem = (params: passThreeListItem) =>
    httpReq(
      'put',
      `/manager/project/${params.project_id}/${params.itemName}/${params.problem_id}/approve`,
      params.sendData,
    );
  // 驳回三个清单
  backThreeListItem = (params: backThreeListItem) =>
    httpReq(
      'put',
      `/manager/project/${params.project_id}/${params.itemName}/${params.problem_id}/reject`,
    );

  // 进入项目下一个节点
  pushProjectToNextProgress = (params: pushProjectToNextProgress) =>
    httpReq('put', `/manager/project/${params.project_id}/progress/next`);

  // 选择大/小项目节点开始时间
  selectProjectProgressStartTime = (params: selectProjectProgressStartTime) =>
    httpReq(
      'put',
      `/manager/project/${params.project_id}/progress/${params.progress_id}/setTime`,
      params,
    );

  // 选择父/子项目节点预计完成时间
  selectProjectProgressPlanTime = (params: selectProjectProgressPlanTime) =>
    httpReq(
      'put',
      `/manager/project/${params.project_id}/progress/${params.progress_id}/setPlanTime`,
      params,
    );

  // 选择父/子项目节点实际完成时间
  selectProjectProgressFinishTime = (params: selectProjectProgressFinishTime) =>
    httpReq(
      'put',
      `/manager/project/${params.project_id}/progress/${params.progress_id}/setFinishTime`,
      params,
    );

  // 指定内置清单负责人
  comfirmResponsible = (params: comfirmResponsible) =>
    httpReq(
      'put',
      `/manager/project/${params.project_id}/question/${params.question_id}/responsibles`,
      params,
    );
  // 查看内置清单问题
  lookAllListReply = (params: lookAllListReply) =>
    httpReq(
      'get',
      `/manager/project/${params.project_id}/${params.itemName}/${params.question_id}/reply`,
    );
  //修改可研技术收口数据
  updateTechnologyList = (params: updateTechnologyList) => httpReq('');

  // 下载文件
  downloadFile = (params: downloadFile) =>
    httpReq('get', `${params.replyFile}`, null, 'blob');

  // 获取上报审核列表
  getTimeApplyList = () => httpReq('get', `/worker/timeApproval/unchecked`);

  //初设批复上传文件
  uploadAttachment = (params: uploadAttachment) =>
    httpReq(
      'put',
      `/manager/project/${params.projectId}/progress/${params.progressId}/setAttachment`,
      params,
    );

  //修改可研技术收口表
  updateSheet = (params: updateSheet) =>
    httpReq(
      'post',
      `/manager/project/${params.projectId}/progress/${params.progressId}/updateKyskSheet`,
      params,
    );
  // 项目经理查看申请时间调整
  managerLookTimeApply = (params: managerTimeApply) =>
    httpReq(
      'get',
      `/manager/project/${params.project_id}/${params.itemName}/${params.question_id}/adjust`,
    );
  // 项目经理上报问题时间调整
  managerSubmitQuestionTimeApply = (params: managerTimeApply) =>
    httpReq(
      'put',
      `/manager/project/${params.project_id}/${params.itemName}/${params.question_id}/adjust/submit`,
      params,
    );
  // 项目经理上报父/子项目节点预计完成时间调整
  managerSubmitProjectProgressPlanTimeApply = (
    params: managerSubmitProjectProgressPlanTimeApply,
  ) =>
    httpReq(
      'put',
      `/manager/project/${params.projectId}/${params.progressId}/adjust/submit`,
      params,
    );
  // 项目经理审批通过时间调整
  managerApproveTimeApply = (params: managerTimeApply) =>
    httpReq(
      'put',
      `/manager/project/${params.project_id}/${params.itemName}/${params.question_id}/adjust/approve`,
    );
  // 项目经理审批驳回时间调整
  managerRejectTimeApply = (params: managerTimeApply) =>
    httpReq(
      'put',
      `/manager/project/${params.project_id}/${params.itemName}/${params.question_id}/adjust/reject`,
    );
  // 项目经理勾选第一次/第二次中间检查内容
  managerCheckMidContent = (params: managerCheckMidContent) =>
    httpReq(
      'post',
      `/manager/project/${params.projectId}/progress/${params.progressId}/midCheck`,
      params,
    );

  // 获取项目组成员
  getManagerProjectTeamPerson = (params: getManagerProjectTeamPerson) =>
    httpReq('get', `/manager/project/${params.fatherId}/getWorker`);

  // 添加项目组成员
  addManagerProjectTeamPerson = (params: addManagerProjectTeamPerson) =>
    httpReq('post', `/manager/addWorker`, params);

  // 删除项目组成员
  deleteManagerProjectTeamPerson = (params: deleteManagerProjectTeamPerson) =>
    httpReq(
      'delete',
      `/manager/project/${params.fatherId}/delTeamMember/${params.userId}`,
    );

  // 指定父项目节点时间
  setFatherProjectNodeTime = (params: setFatherProjectNodeTime) =>
    httpReq(
      'put',
      `/manager/chooseProgressTime/${params.project_id}/fatherProgress/${params.progress_id}/setTime`,
      params,
    );
  // 进入父项目项目下一节点
  pushFatherProjectToNextProgress = (params: pushFatherProjectToNextProgress) =>
    httpReq('put', `/manager/fatherProject/${params.fatherId}/progress/next`);

  // 专项评估选择时间
  specialChooseTime = (params: chooseTime) =>
    httpReq('post', `/manager/selectFinishTime`, params);

  // 专项评估指派负责人
  specialChooseResponsible = (params: specialChooseResponsible) =>
    httpReq(
      'put',
      `/manager/project/${params.projectId}/SpecialEvaluation/${params.zxpgId}/responsibles`,
      params,
    );

  // 获取项目组中未添加的员工
  managerGetAllWorker = (params: managerGetAllWorker) =>
    httpReq('get', `/manager/worker/detail/${params.fatherId}`);

  // 移交指定项目
  handoverProject = (params: handoverProject) =>
    httpReq(
      'put',
      `/manager/project/${params.fatherId}/handOverProject`,
      params,
    );

  //专项评估通过
  specialPass = (params: specialPass) =>
    httpReq(
      'put',
      `/manager/project/${params.projectId}/SpecialEvaluation/${params.zxpgId}/reply/approve`,
    );

  //专项评估驳回
  specialReject = (params: specialReject) =>
    httpReq(
      'put',
      `/manager/project/${params.projectId}/SpecialEvaluation/${params.zxpgId}/reply/reject`,
    );

  //创建典型经验
  createClassicCase = (params: createClassicCase) =>
    httpReq('post', `/manager/case/createClassicCase`, params);

  //删除指定典型经验
  deleteOneCase = (params: deleteOneCase) =>
    httpReq('delete', `/manager/case/deleteCase/${params.caseId}`);

  /*
    管理员
  */
  //获取所有员工
  adminGetAllWorker = () => httpReq('get', `/admin/worker/detail`);

  //获取所有单位
  getUnit = () => httpReq('get', `/admin/unit`);

  //获取单位内得部门
  getUnitDepartment = (params: getUnitDepartment) =>
    httpReq('get', `/admin/unit/${params.unitId}/dept`);

  //获取部门内得人员
  getDepartmentWorker = (params: getDepartmentWorker) =>
    httpReq('get', `/admin/dept/${params.deptId}/worker`);

  //新建单位
  addUnit = (params: addUnit) => httpReq('post', `/admin/unit`, params);

  //获取部门
  getAllDepartment = () => httpReq('get', `/admin/dept`);

  // 新建部门
  addDepartment = (params: addDepartment) =>
    httpReq('post', `/admin/dept`, params);

  // 获取部门内的员工
  getWorkerFromDepartment = (params: getWorkerFromDepartment) =>
    httpReq('get', `/admin/dept/${params.dept_id}/worker`);

  // 新建人员
  addWorker = (params: addWorker) => httpReq('post', `/admin/worker`, params);

  //删除单位
  deleteUnit = (params: deleteUnit) =>
    httpReq('delete', `/admin/unit/${params.unitId}`);

  //修改单位
  updateUnit = (params: updateUnit) =>
    httpReq('put', `/admin/unit/${params.unitId}`, params);

  //删除部门
  deleteDept = (params: deleteDept) =>
    httpReq('delete', `/admin/dept/${params.deptId}`);

  //修改部门
  updateDept = (params: updateDept) =>
    httpReq('put', `/admin/dept/${params.deptId}`, params);

  //删除员工
  deleteWorker = (params: deleteWorker) =>
    httpReq('delete', `/admin/worker/${params.workerId}`);

  //修改员工
  updateWokrer = (params: updateWorker) =>
    httpReq('put', `/admin/worker/${params.workerId}`, params);

  // 获取项目经理列表
  getManagers = () => httpReq('get', `/manager/getManagers`);

  // 指定项目经理
  addManager = (params: addManager) =>
    httpReq('post', `/admin/manager/`, params);

  // 撤销项目经理
  deleteManager = (params: deleteManager) =>
    httpReq('put', `/admin/delManager/${params.userId}`);
}

export default new HttpUtil();
