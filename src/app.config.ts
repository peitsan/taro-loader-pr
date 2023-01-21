export default defineAppConfig({
  pages: [
    // 系统登录
    'pages/login/index',
    // 主页
    'pages/home/index/index',
    /* 
    工程管理
  */
    'pages/home/projectManage/index',
    // 工程总览
    'pages/home/projectManage/projectOverview/index',
    // 工程进度
    'pages/home/projectManage/projectOverview/fatherProjectProgress/index',
    // 三项清单查阅
    'pages/home/projectManage/projectOverview/projectList/index',
    // 三项清单审批
    'pages/home/projectManage/threeListAudit/index',
    // 工程审核
    // 工程移交
    // 清单审核
    // 上报审核
    /* 
    项目团队管理
  */
    /* 
    典型经验
  */
    'pages/home/typicalExperience/index',
    /* 
    项目经理管理
  */
    'pages/home/managerManage/index',
  ],
  entryPagePath: 'pages/home/typicalExperience/index',
  // entryPagePath: 'pages/login/index',
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black',
  },
});
